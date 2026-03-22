from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Notification, User

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({"notifications": [], "unread_count": 0}), 200
        
        notifications = Notification.objects(recipient=user).order_by('-created_at').limit(20)
        unread_count = Notification.objects(recipient=user, is_read=False).count()
        
        return jsonify({
            "notifications": [
                {
                    "id": str(n.id),
                    "title": n.title,
                    "message": n.message,
                    "link": n.link,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat()
                } for n in notifications
            ],
            "unread_count": unread_count
        }), 200
    except Exception as e:
        print(f"[NOTIF] Error fetching notifications: {str(e)}")
        return jsonify({"notifications": [], "unread_count": 0}), 200

@notifications_bp.route('/mark-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if user:
            Notification.objects(recipient=user, is_read=False).update(set__is_read=True)
        return jsonify({"message": "Notifications marked as read"}), 200
    except Exception as e:
        print(f"[NOTIF] Error marking all read: {str(e)}")
        return jsonify({"message": "Error"}), 400

@notifications_bp.route('/<notif_id>/read', methods=['PATCH'])
@jwt_required()
def mark_single_read(notif_id):
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if user:
            notif = Notification.objects(id=notif_id, recipient=user).first()
            if notif:
                notif.is_read = True
                notif.save()
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"[NOTIF] Error marking read: {str(e)}")
        return jsonify({"success": False}), 400
