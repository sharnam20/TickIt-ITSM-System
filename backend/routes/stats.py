from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ticket, SLARule, User, Employee, AuditLog
from utils.rbac import role_required
import datetime
import csv
import io
from collections import Counter

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_stats_summary():
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    
    # Base query filter
    query_filter = {}
    if user.role == 'CUSTOMER':
        query_filter['created_by'] = user.id
    elif user.role == 'EMPLOYEE':
        query_filter['assigned_to'] = user.id
        
    # Basic counts
    total_tickets = Ticket.objects(**query_filter).count()
    open_tickets = Ticket.objects(status='OPEN', **query_filter).count()
    resolved_tickets = Ticket.objects(status='RESOLVED', **query_filter).count()
    in_progress_tickets = Ticket.objects(status='IN_PROGRESS', **query_filter).count()
    
    # SLA Status
    now = datetime.datetime.utcnow()
    # For SLA, we combine the role filter with the SLA conditions
    sla_query = query_filter.copy()
    sla_query['status__ne'] = 'RESOLVED'
    sla_query['sla_due_at__lt'] = now
    sla_breached = Ticket.objects(**sla_query).count()
    
    # Priority Breakdown
    # Note: MongoEngine aggregation or iterating is needed for filtered counters properly, 
    # but for simple usage iterating filtered objects is fine for now (performance optimization later)
    tickets_subset = Ticket.objects(**query_filter).only('priority', 'category')
    priority_counts = Counter([t.priority for t in tickets_subset])
    category_counts = Counter([t.category for t in tickets_subset if t.category])
    
    # Recent Daily Trends (last 7 days)
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_trends = []
    for i in range(7):
        day = today - datetime.timedelta(days=i)
        next_day = day + datetime.timedelta(days=1)
        
        # Trend query needs strict date range AND the user filter
        trend_query = query_filter.copy()
        trend_query['created_at__gte'] = day
        trend_query['created_at__lt'] = next_day
        
        count = Ticket.objects(**trend_query).count()
        daily_trends.append({
            "date": day.strftime("%b %d"),
            "count": count
        })
    daily_trends.reverse()

    return jsonify({
        "summary": {
            "total": total_tickets,
            "open": open_tickets,
            "resolved": resolved_tickets,
            "in_progress": in_progress_tickets,
            "sla_breached": sla_breached
        },
        "priority": dict(priority_counts),
        "categories": dict(category_counts),
        "trends": daily_trends
    }), 200


@stats_bp.route('/export/csv', methods=['GET'])
@jwt_required()
@role_required(['MANAGER'])
def export_tickets_csv():
    """Export all tickets as a CSV file for reporting"""
    try:
        tickets = Ticket.objects().order_by('-created_at')
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header row
        writer.writerow([
            'Ticket ID', 'Title', 'Category', 'Priority', 'Status',
            'Created By', 'Assigned To', 'Created At', 'SLA Due At',
            'SLA Status', 'Rating'
        ])
        
        for t in tickets:
            # Safely get referenced user names
            created_name = ''
            assigned_name = ''
            try:
                if t.created_by:
                    created_name = t.created_by.name
            except:
                pass
            try:
                if t.assigned_to:
                    assigned_name = t.assigned_to.name
            except:
                pass
            
            # Calculate SLA status
            sla_status = 'N/A'
            if t.sla_due_at:
                now = datetime.datetime.utcnow()
                if t.status in ('RESOLVED', 'CLOSED'):
                    sla_status = 'COMPLETED'
                elif now > t.sla_due_at:
                    sla_status = 'BREACHED'
                elif (t.sla_due_at - now).total_seconds() < 7200:
                    sla_status = 'AT_RISK'
                else:
                    sla_status = 'ON_TRACK'
            
            writer.writerow([
                str(t.id)[-8:],
                t.title,
                t.category or '',
                t.priority,
                t.status,
                created_name,
                assigned_name,
                t.created_at.strftime('%Y-%m-%d %H:%M') if t.created_at else '',
                t.sla_due_at.strftime('%Y-%m-%d %H:%M') if t.sla_due_at else '',
                sla_status,
                t.rating or ''
            ])
        
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename=tickets_report_{datetime.datetime.utcnow().strftime("%Y%m%d")}.csv'
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@stats_bp.route('/agent-performance', methods=['GET'])
@jwt_required()
@role_required(['MANAGER'])
def get_agent_performance():
    """Get per-agent performance metrics"""
    try:
        employees = Employee.objects()
        performance = []
        
        for emp in employees:
            try:
                user = emp.user
                if not user:
                    continue
                
                # Add any tickets they breached and were subsequently reassigned away from them!
                historical_breaches = getattr(emp, 'failed_sla_tickets', 0)
                
                # Count tickets
                total = Ticket.objects(assigned_to=user).count() + historical_breaches
                resolved = Ticket.objects(assigned_to=user, status='RESOLVED').count()
                active = Ticket.objects(assigned_to=user, status__nin=['RESOLVED', 'CLOSED']).count()
                
                # SLA compliance
                now = datetime.datetime.utcnow()
                active_breaches = Ticket.objects(
                    assigned_to=user,
                    sla_due_at__lt=now,
                    status__nin=['RESOLVED', 'CLOSED']
                ).count()
                
                breached = active_breaches + historical_breaches
                
                # Average rating
                rated_tickets = Ticket.objects(assigned_to=user, rating__exists=True, rating__gt=0)
                ratings = [t.rating for t in rated_tickets if t.rating]
                avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
                
                compliance = round(((total - breached) / total * 100), 1) if total > 0 else 100
                
                performance.append({
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "skills": emp.skills or [],
                    "status": emp.availability_status,
                    "total_tickets": total,
                    "resolved": resolved,
                    "active": active,
                    "breached": breached,
                    "sla_compliance": compliance,
                    "avg_rating": avg_rating,
                    "current_load": emp.current_ticket_load
                })
            except Exception:
                continue
        
        # Sort by resolved count (best performers first)
        performance.sort(key=lambda x: x['resolved'], reverse=True)
        
        return jsonify({"agents": performance}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@stats_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@role_required(['MANAGER'])
def get_audit_logs():
    """Get security audit logs"""
    try:
        limit = int(request.args.get('limit', 50))
        logs = AuditLog.objects().order_by('-timestamp').limit(limit)
        
        result = []
        for log in logs:
            result.append({
                "id": str(log.id),
                "user_name": log.user.name if log.user else "Unknown",
                "user_email": log.user_email,
                "action": log.action,
                "details": log.details,
                "ip_address": log.ip_address,
                "timestamp": log.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })
            
        return jsonify({"logs": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

