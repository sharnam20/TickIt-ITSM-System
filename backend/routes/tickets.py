from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ticket, User, TicketHistory, SLARule, Notification, Comment, Employee, Team
from utils.email_service import send_ticket_update_email
from datetime import datetime, timedelta
from bson import ObjectId

tickets_bp = Blueprint('tickets', __name__)

def create_notification(recipient, title, message, link=None):
    """Helper to create a notification"""
    try:
        notif = Notification(
            recipient=recipient,
            title=title,
            message=message,
            link=link
        )
        notif.save()
    except Exception as e:
        print(f"[NOTIF] Error: {str(e)}")

def calculate_sla_due_date(priority):
    """Calculate SLA due date based on priority"""
    try:
        sla_rule = SLARule.objects(priority=priority).first()
        if sla_rule:
            hours = sla_rule.resolution_time_hours
        else:
            # Default SLA hours if no rule exists
            default_hours = {'LOW': 72, 'MEDIUM': 24, 'HIGH': 8}
            hours = default_hours.get(priority, 24)
        
        return datetime.utcnow() + timedelta(hours=hours)
    except Exception as e:
        print(f"[SLA] Error calculating due date: {str(e)}")
        return datetime.utcnow() + timedelta(hours=24)

def get_user_role(user_id):
    """Get user role by ID"""
    user = User.objects(id=user_id).first()
    return user.role if user else None

def create_ticket_history(ticket, action, user_id, details=None):
    """Create a history entry for ticket"""
    try:
        history = TicketHistory(
            ticket=ticket,
            action=action,
            performed_by=user_id,
            details=details
        )
        history.save()
    except Exception as e:
        print(f"[HISTORY] Error creating history: {str(e)}")

def auto_assign_ticket(ticket, exclude_user_id=None):
    """
    Intelligent Auto-Assignment Logic (Enhanced):
    1. Team-Based: Find a Team that handles this category. Pick best member.
    2. Skill-Based: Find any individual with matching skill.
    3. General Pool: Pick any available agent.
    """
    try:
        category = ticket.category
        candidates = []
        source_details = ""

        # 1. Team-Based Routing (Priority)
        matching_teams = Team.objects(skills=category)
        if matching_teams:
            # Collect potential assignees from these teams
            team_member_ids = []
            team_names = [t.name for t in matching_teams]
            
            for team in matching_teams:
                for member in team.members:
                    if not exclude_user_id or str(member.id) != str(exclude_user_id):
                        team_member_ids.append(member.id)
            
            # Filter for AVAILABLE employees within these teams
            candidates = Employee.objects(user__in=team_member_ids, availability_status='AVAILABLE').order_by('current_ticket_load', 'id')
            if candidates:
                source_details = f"via Team '{team_names[0]}'"

        # 2. Individual Skill-Based Routing (Fallback)
        if not candidates:
            query = {'skills': category, 'availability_status': 'AVAILABLE'}
            if exclude_user_id:
                query['user__ne'] = ObjectId(exclude_user_id)
            candidates = Employee.objects(**query).order_by('current_ticket_load', 'id')
            if candidates:
                source_details = "via Skill Match"
                
        # 3. General Pool (Last Resort - Any Available Agent)
        if not candidates:
            # Try finding anyone available regardless of skill
            query = {'availability_status': 'AVAILABLE'}
            if exclude_user_id:
                query['user__ne'] = ObjectId(exclude_user_id)
            candidates = Employee.objects(**query).order_by('current_ticket_load', 'id')
            if candidates:
                source_details = "via General Pool"

        # 4. Absolute Fallback (Anyone, even if busy/offline)
        if not candidates:
             query = {}
             if exclude_user_id:
                 query['user__ne'] = ObjectId(exclude_user_id)
             candidates = Employee.objects(**query).order_by('current_ticket_load', 'id')
             source_details = "via Emergency Fallback"

        best_employee = candidates.first()
        
        if best_employee:
            user = best_employee.user
            ticket.assigned_to = user
            ticket.save()
            
            # Update load
            best_employee.current_ticket_load += 1
            best_employee.save()
            
            # History log
            create_ticket_history(
                ticket=ticket,
                action='AUTO_ASSIGNED',
                user_id=None, # System action
                details=f"Assigned to {user.name} {source_details} (Load: {best_employee.current_ticket_load})"
            )
            
            # Notify agent
            create_notification(
                recipient=user,
                title="New Ticket Assigned",
                message=f"Ticket #{str(ticket.id)[-8:]} assigned to you.",
                link=f"/tickets?id={ticket.id}"
            )
            
            # Email Notification
            send_ticket_update_email(
                user_email=user.email,
                user_name=user.name,
                ticket_id=str(ticket.id),
                status_or_action=f"A new ticket has been assigned to you ({source_details})."
            )
            
            print(f"[AUTO-ASSIGN] Assigned ticket {ticket.id} to {user.email} ({source_details})")
            return True
            
        print("[AUTO-ASSIGN] No suitable employee found.")
        return False

    except Exception as e:
        print(f"[AUTO-ASSIGN] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_sla_and_auto_escalate():
    """Automatically escalate breached SLA tickets and reassign them to suitable employees."""
    try:
        now = datetime.utcnow()
        # Find active, non-escalated tickets past their SLA due date
        breached_tickets = Ticket.objects(
            status__nin=['RESOLVED', 'CLOSED'],
            is_escalated=False,
            sla_due_at__lt=now
        )
        
        for ticket in breached_tickets:
            print(f"[ESCALATION] Ticket #{ticket.id} breached SLA. Auto-escalating.")
            ticket.is_escalated = True
            ticket.sla_status = 'BREACHED'
            ticket.priority = 'HIGH'
            
            old_assignee_id = None
            # Decrement old assignee's load and apply permanent SLA penalty
            if ticket.assigned_to:
                old_assignee_id = str(ticket.assigned_to.id)
                old_emp = Employee.objects(user=ticket.assigned_to).first()
                if old_emp:
                    if getattr(old_emp, 'current_ticket_load', 0) > 0:
                        old_emp.current_ticket_load -= 1
                    # Permanent penalty mark against the employee who failed!
                    old_emp.failed_sla_tickets = getattr(old_emp, 'failed_sla_tickets', 0) + 1
                    old_emp.save()
            
            # Unassign so it falls freshly into queue
            ticket.assigned_to = None
            # Give the new escalation agent a 2-hour grace period before it breaches on them!
            ticket.sla_due_at = now + timedelta(hours=2)
            ticket.save()
            
            create_ticket_history(
                ticket=ticket,
                action='ESCALATED',
                user_id=None,
                details="SLA Breached. Automatically escalated by system."
            )
            
            # Re-assign to a suitable employee via smart routing, EXCLUDING the original failing assignee
            auto_assign_ticket(ticket, exclude_user_id=old_assignee_id)
            
            # Notify Managers
            managers = User.objects(role='MANAGER')
            for manager in managers:
                create_notification(
                    recipient=manager,
                    title="Auto-Escalation Alert",
                    message=f"Ticket #{str(ticket.id)[-8:]} breached SLA and was auto-reassigned.",
                    link=f"/tickets?id={ticket.id}"
                )
    except Exception as e:
        print(f"[ESCALATION CHECK] Error: {str(e)}")

@tickets_bp.route('', methods=['POST'])
@jwt_required()
def create_ticket():
    """Create a new ticket"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'priority']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate priority
        if data['priority'] not in ['LOW', 'MEDIUM', 'HIGH']:
            return jsonify({"error": "Invalid priority. Must be LOW, MEDIUM, or HIGH"}), 400
        
        # Calculate SLA due date
        sla_due_at = calculate_sla_due_date(data['priority'])
        
        # Create ticket
        ticket = Ticket(
            title=data['title'],
            description=data['description'],
            category=data.get('category', 'General'),
            priority=data['priority'],
            status='OPEN',
            created_by=current_user_id,
            sla_due_at=sla_due_at,
            sla_status='ON_TRACK'
        )
        ticket.save()
        
        # Create history entry
        create_ticket_history(
            ticket=ticket,
            action='CREATED',
            user_id=current_user_id,
            details=f"Ticket created with priority {data['priority']}"
        )
        
        # Run Intelligent Assignment
        auto_assign_ticket(ticket)
        
        print(f"[TICKET] Created ticket #{ticket.id} by user {current_user_id}")
        
        return jsonify({
            "message": "Ticket created successfully",
            "ticket_id": str(ticket.id),
            "ticket": {
                "id": str(ticket.id),
                "title": ticket.title,
                "description": ticket.description,
                "category": ticket.category,
                "priority": ticket.priority,
                "status": ticket.status,
                "sla_due_at": ticket.sla_due_at.isoformat(),
                "created_at": ticket.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        print(f"[TICKET] Error creating ticket: {str(e)}")
        return jsonify({"error": str(e)}), 400

@tickets_bp.route('', methods=['GET'])
@jwt_required()
def get_tickets():
    """Get tickets based on user role and filters"""
    try:
        # Run auto-escalation check
        check_sla_and_auto_escalate()
        
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        
        # Get query parameters
        status = request.args.get('status')
        priority = request.args.get('priority')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        
        # Build query based on role
        query = {}
        
        if user_role == 'CUSTOMER':
            # Customers see only their tickets
            query['created_by'] = ObjectId(current_user_id)
        elif user_role == 'EMPLOYEE':
            # Employees see assigned tickets
            query['assigned_to'] = ObjectId(current_user_id)
        # Managers see all tickets (no filter)
        
        # Apply filters
        if status:
            query['status'] = status
        if priority:
            query['priority'] = priority
        if search:
            query['title__icontains'] = search
        
        # Get tickets with pagination
        skip = (page - 1) * limit
        tickets = Ticket.objects(**query).order_by('-created_at').skip(skip).limit(limit)
        total = Ticket.objects(**query).count()
        
        # Format response
        tickets_list = []
        for ticket in tickets:
            try:
                ticket_data = {
                    "id": str(ticket.id),
                    "title": ticket.title,
                    "description": ticket.description,
                    "category": ticket.category,
                    "priority": ticket.priority,
                    "status": ticket.status,
                    "is_escalated": ticket.is_escalated,
                    "created_by": None,
                    "assigned_to": None,
                    "sla_due_at": ticket.sla_due_at.isoformat() if ticket.sla_due_at else None,
                    "sla_status": ticket.sla_status,
                    "created_at": ticket.created_at.isoformat(),
                    "updated_at": ticket.updated_at.isoformat()
                }
                
                # Safely dereference created_by
                try:
                    if ticket.created_by:
                        ticket_data["created_by"] = {
                            "id": str(ticket.created_by.id),
                            "name": ticket.created_by.name,
                            "email": ticket.created_by.email
                        }
                except Exception:
                    ticket_data["created_by"] = {"id": "", "name": "Unknown", "email": ""}
                
                # Safely dereference assigned_to
                try:
                    if ticket.assigned_to:
                        ticket_data["assigned_to"] = {
                            "id": str(ticket.assigned_to.id),
                            "name": ticket.assigned_to.name,
                            "email": getattr(ticket.assigned_to, 'email', '')
                        }
                except Exception:
                    ticket_data["assigned_to"] = {"id": "", "name": "Unassigned", "email": ""}
                
                tickets_list.append(ticket_data)
            except Exception as e:
                print(f"[TICKET] Error serializing ticket {ticket.id}: {str(e)}")
                continue
        
        return jsonify({
            "tickets": tickets_list,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"[TICKET] Error fetching tickets: {str(e)}")
        return jsonify({"error": str(e)}), 400

@tickets_bp.route('/<ticket_id>', methods=['GET'])
@jwt_required()
def get_ticket(ticket_id):
    """Get a single ticket by ID"""
    try:
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        
        # Get ticket
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
        
        # Check access permissions
        is_creator = str(ticket.created_by.id) == current_user_id
        is_assignee = ticket.assigned_to and str(ticket.assigned_to.id) == current_user_id
        is_manager = user_role == 'MANAGER'
        
        if not (is_creator or is_assignee or is_manager):
            return jsonify({"error": "Access denied"}), 403
        
        # Get ticket history
        history = TicketHistory.objects(ticket=ticket).order_by('-timestamp')
        history_list = []
        for entry in history:
            history_list.append({
                "action": entry.action,
                "performed_by": {
                    "id": str(entry.performed_by.id),
                    "name": entry.performed_by.name
                } if entry.performed_by else None,
                "timestamp": entry.timestamp.isoformat(),
                "details": entry.details
            })
        
        # Format response
        ticket_data = {
            "id": str(ticket.id),
            "title": ticket.title,
            "description": ticket.description,
            "category": ticket.category,
            "priority": ticket.priority,
            "status": ticket.status,
            "is_escalated": ticket.is_escalated,
            "created_by": {
                "id": str(ticket.created_by.id),
                "name": ticket.created_by.name,
                "email": ticket.created_by.email
            } if ticket.created_by else None,
            "assigned_to": {
                "id": str(ticket.assigned_to.id),
                "name": ticket.assigned_to.name,
                "email": ticket.assigned_to.email
            } if ticket.assigned_to else None,
            "sla_due_at": ticket.sla_due_at.isoformat() if ticket.sla_due_at else None,
            "sla_status": ticket.sla_status,
            "breach_acknowledged": ticket.breach_acknowledged,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat(),
            "history": history_list
        }
        
        return jsonify({"ticket": ticket_data}), 200
        
    except Exception as e:
        print(f"[TICKET] Error fetching ticket: {str(e)}")
        return jsonify({"error": str(e)}), 400

@tickets_bp.route('/<ticket_id>', methods=['PATCH'])
@jwt_required()
def update_ticket(ticket_id):
    """Update a ticket"""
    try:
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        data = request.get_json()
        
        # Get ticket
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
        
        # Check permissions
        is_creator = str(ticket.created_by.id) == current_user_id
        is_assignee = ticket.assigned_to and str(ticket.assigned_to.id) == current_user_id
        is_manager = user_role == 'MANAGER'
        
        changes = []
        
        # CUSTOMER can update title/description if status is OPEN
        if user_role == 'CUSTOMER':
            if ticket.status != 'OPEN':
                return jsonify({"error": "Cannot update ticket after it's been assigned"}), 403
            if 'title' in data:
                ticket.title = data['title']
                changes.append(f"Title updated")
            if 'description' in data:
                ticket.description = data['description']
                changes.append(f"Description updated")
        
        # EMPLOYEE can update status
        elif user_role == 'EMPLOYEE':
            if not is_assignee:
                return jsonify({"error": "Can only update assigned tickets"}), 403
            if 'status' in data:
                old_status = ticket.status
                ticket.status = data['status']
                changes.append(f"Status changed from {old_status} to {data['status']}")
                # Decrement load when ticket is resolved/closed
                if data['status'] in ('RESOLVED', 'CLOSED') and old_status not in ('RESOLVED', 'CLOSED'):
                    if ticket.assigned_to:
                        emp = Employee.objects(user=ticket.assigned_to).first()
                        if emp and emp.current_ticket_load > 0:
                            emp.current_ticket_load -= 1
                            emp.save()
        
        # MANAGER can update everything
        elif user_role == 'MANAGER':
            if 'title' in data:
                ticket.title = data['title']
                changes.append("Title updated")
            if 'description' in data:
                ticket.description = data['description']
                changes.append("Description updated")
            if 'status' in data:
                old_status = ticket.status
                ticket.status = data['status']
                changes.append(f"Status changed from {old_status} to {data['status']}")
                # Decrement load when ticket is resolved/closed
                if data['status'] in ('RESOLVED', 'CLOSED') and old_status not in ('RESOLVED', 'CLOSED'):
                    if ticket.assigned_to:
                        emp = Employee.objects(user=ticket.assigned_to).first()
                        if emp and emp.current_ticket_load > 0:
                            emp.current_ticket_load -= 1
                            emp.save()
            if 'priority' in data:
                old_priority = ticket.priority
                ticket.priority = data['priority']
                ticket.sla_due_at = calculate_sla_due_date(data['priority'])
                changes.append(f"Priority changed from {old_priority} to {data['priority']}")
            if 'assigned_to' in data:
                # Decrement old assignee's load
                if ticket.assigned_to:
                    old_emp = Employee.objects(user=ticket.assigned_to).first()
                    if old_emp and old_emp.current_ticket_load > 0:
                        old_emp.current_ticket_load -= 1
                        old_emp.save()
                # Increment new assignee's load
                new_emp = Employee.objects(user=data['assigned_to']).first()
                if new_emp:
                    new_emp.current_ticket_load += 1
                    new_emp.save()
                ticket.assigned_to = data['assigned_to']
                changes.append("Ticket reassigned")
        
        # Update timestamp
        ticket.updated_at = datetime.utcnow()
        ticket.save()
        
        # Create history entry
        if changes:
            create_ticket_history(
                ticket=ticket,
                action='UPDATED',
                user_id=current_user_id,
                details=", ".join(changes)
            )

            # --- Notification Triggers ---
            # If status changed, notify customer
            if 'status' in data:
                create_notification(
                    recipient=ticket.created_by,
                    title="Ticket Status Updated",
                    message=f"Ticket #{ticket.id} status is now {ticket.status}",
                    link=f"/tickets?id={ticket.id}"
                )
                try:
                    send_ticket_update_email(
                        user_email=ticket.created_by.email,
                        user_name=ticket.created_by.name,
                        ticket_id=str(ticket.id),
                        status_or_action=f"Status changed to {ticket.status}"
                    )
                except:
                    pass
            
            # If priority changed by manager, notify assignee (if any) and creator
            if 'priority' in data and user_role == 'MANAGER':
                msg = f"Ticket #{ticket.id} priority changed to {ticket.priority}"
                create_notification(ticket.created_by, "Ticket Priority Changed", msg)
                try:
                    send_ticket_update_email(
                        ticket.created_by.email, ticket.created_by.name, str(ticket.id),
                        f"Priority changed to {ticket.priority}"
                    )
                except: pass
                
                if ticket.assigned_to:
                    create_notification(ticket.assigned_to, "Assigned Ticket Updated", msg)
                    try:
                        send_ticket_update_email(
                            ticket.assigned_to.email, ticket.assigned_to.name, str(ticket.id),
                            f"Priority changed to {ticket.priority}"
                        )
                    except: pass
            
            # If reassigned, notify the new assignee
            if 'assigned_to' in data and user_role == 'MANAGER':
                create_notification(
                    recipient=ticket.assigned_to,
                    title="New Ticket Assigned",
                    message=f"You have been assigned ticket #{ticket.id}: {ticket.title}",
                    link=f"/tickets?id={ticket.id}"
                )
                try:
                    send_ticket_update_email(
                        ticket.assigned_to.email, ticket.assigned_to.name, str(ticket.id),
                        "You have been assigned this ticket."
                    )
                except: pass
        
        return jsonify({
            "message": "Ticket updated successfully",
            "changes": changes
        }), 200
        
    except Exception as e:
        print(f"[TICKET] Error updating ticket: {str(e)}")
        return jsonify({"error": str(e)}), 400

@tickets_bp.route('/<ticket_id>', methods=['DELETE'])
@jwt_required()
def delete_ticket(ticket_id):
    """Delete a ticket (MANAGER only)"""
    try:
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        
        if user_role != 'MANAGER':
            return jsonify({"error": "Only managers can delete tickets"}), 403
        
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
        
        # Decrement assignee's load if ticket is still active
        if ticket.assigned_to and ticket.status not in ('RESOLVED', 'CLOSED'):
            emp = Employee.objects(user=ticket.assigned_to).first()
            if emp and emp.current_ticket_load > 0:
                emp.current_ticket_load -= 1
                emp.save()
        
        ticket.delete()
        
        return jsonify({"message": "Ticket deleted successfully"}), 200
        
    except Exception as e:
        print(f"[TICKET] Error deleting ticket: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ──────── COMMENTS / CONVERSATION ────────
@tickets_bp.route('/<ticket_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(ticket_id):
    """Get all comments for a ticket."""
    try:
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404

        comments = Comment.objects(ticket=ticket).order_by('created_at')

        comments_list = []
        for c in comments:
            # Hide internal notes from customers
            if c.is_internal and user_role == 'CUSTOMER':
                continue
            comments_list.append({
                "id": str(c.id),
                "content": c.content,
                "is_internal": c.is_internal,
                "author": {
                    "id": str(c.author.id),
                    "name": c.author.name,
                    "email": c.author.email,
                    "role": c.author.role
                },
                "created_at": c.created_at.isoformat() if c.created_at else None
            })

        return jsonify({"comments": comments_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@tickets_bp.route('/<ticket_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(ticket_id):
    """Add a comment or internal note to a ticket."""
    try:
        current_user_id = get_jwt_identity()
        user_role = get_user_role(current_user_id)
        data = request.get_json()

        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404

        content = data.get('content', '').strip()
        if not content:
            return jsonify({"error": "Comment cannot be empty"}), 400

        # Only staff can post internal notes
        is_internal = data.get('is_internal', False)
        if is_internal and user_role == 'CUSTOMER':
            is_internal = False

        author = User.objects(id=current_user_id).first()

        comment = Comment(
            ticket=ticket,
            author=author,
            content=content,
            is_internal=is_internal
        )
        comment.save()

        # Create history entry
        action_type = 'INTERNAL_NOTE' if is_internal else 'COMMENT_ADDED'
        create_ticket_history(
            ticket=ticket,
            action=action_type,
            user_id=current_user_id,
            details=content[:100]
        )

        # Notify relevant parties
        if not is_internal:
            # If customer comments, notify assignee
            if user_role == 'CUSTOMER' and ticket.assigned_to:
                create_notification(
                    recipient=ticket.assigned_to,
                    title="New comment on ticket",
                    message=f"Customer replied on ticket #{str(ticket.id)[:8]}",
                    link=f"/tickets?id={ticket.id}"
                )
            # If agent comments, notify customer
            elif user_role in ['EMPLOYEE', 'MANAGER']:
                create_notification(
                    recipient=ticket.created_by,
                    title="Agent replied to your ticket",
                    message=f"New reply on ticket #{str(ticket.id)[:8]}",
                    link=f"/tickets?id={ticket.id}"
                )

        return jsonify({
            "message": "Comment added successfully",
            "comment_id": str(comment.id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
