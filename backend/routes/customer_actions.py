from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ticket, User, TicketHistory
from routes.tickets import create_notification, create_ticket_history, get_user_role

customer_bp = Blueprint('customer_actions', __name__)

@customer_bp.route('/<ticket_id>/feedback', methods=['POST'])
@jwt_required()
def submit_feedback(ticket_id):
    """Submit rating and feedback for a resolved ticket"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
            
        # Permission check
        if str(ticket.created_by.id) != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403
            
        if ticket.status != 'RESOLVED' and ticket.status != 'CLOSED':
            return jsonify({"error": "Can only rate resolved tickets"}), 400
            
        ticket.rating = data.get('rating')
        ticket.feedback_comment = data.get('comment')
        ticket.save()
        
        create_ticket_history(
            ticket=ticket,
            action='FEEDBACK',
            user_id=current_user_id,
            details=f"Rated {ticket.rating}/5. Comment: {ticket.feedback_comment}"
        )
        
        return jsonify({"message": "Feedback submitted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@customer_bp.route('/<ticket_id>/escalate', methods=['POST'])
@jwt_required()
def escalate_ticket(ticket_id):
    """Customer requests ticket escalation"""
    try:
        current_user_id = get_jwt_identity()
        
        ticket = Ticket.objects(id=ticket_id).first()
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
            
        if str(ticket.created_by.id) != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403
            
        if ticket.is_escalated:
             return jsonify({"message": "Ticket already escalated"}), 200
             
        ticket.is_escalated = True
        ticket.save()
        
        create_ticket_history(
            ticket=ticket,
            action='ESCALATED',
            user_id=current_user_id,
            details="Customer requested escalation"
        )
        
        # Notify Managers
        managers = User.objects(role='MANAGER')
        for manager in managers:
            create_notification(
                recipient=manager,
                title="Escalation Request",
                message=f"Customer escalated ticket #{ticket.id}",
                link=f"/tickets?id={ticket.id}"
            )
            
        return jsonify({"message": "Escalation request sent to management"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
