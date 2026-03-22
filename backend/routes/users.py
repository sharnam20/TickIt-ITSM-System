from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Employee
from utils.rbac import role_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/staff', methods=['GET'])
@jwt_required()
@role_required(['MANAGER'])
def get_staff_members():
    """
    Get all staff members (Employees and Managers).
    """
    try:
        # Get all users with EMPLOYEE or MANAGER roles
        staff_users = User.objects(role__in=['EMPLOYEE', 'MANAGER'])
        
        staff_list = []
        for user in staff_users:
            profile = {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_verified": user.is_verified,
                "joined_at": user.id.generation_time.isoformat()
            }
            
            # If employee, fetch status
            if user.role == 'EMPLOYEE':
                emp = Employee.objects(user=user).first()
                if emp:
                    profile['status'] = emp.availability_status
                    profile['skills'] = emp.skills
                    profile['current_load'] = emp.current_ticket_load
            
            staff_list.append(profile)
            
        return jsonify({"staff": staff_list}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user details with employee profile if applicable"""
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
             return jsonify({"error": "User not found"}), 404
             
        profile = {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "joined_at": user.id.generation_time.isoformat()
        }
        
        if user.role == 'EMPLOYEE':
            emp = Employee.objects(user=user).first()
            if emp:
                profile['status'] = emp.availability_status
                profile['skills'] = emp.skills
                profile['current_load'] = emp.current_ticket_load
        
        return jsonify({"user": profile}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/me/status', methods=['PATCH'])
@jwt_required()
@role_required(['EMPLOYEE'])
def update_status():
    """Update employee availability status"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['AVAILABLE', 'ON_LEAVE', 'OFFLINE']:
             return jsonify({"error": "Invalid status. Must be AVAILABLE, ON_LEAVE, or OFFLINE"}), 400
             
        user = User.objects(id=user_id).first()
        employee = Employee.objects(user=user).first()
        
        if not employee:
             return jsonify({"error": "Employee profile not found"}), 404
             
        employee.availability_status = new_status
        employee.save()
        
        return jsonify({"message": "Status updated successfully", "status": new_status}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/me/skills', methods=['PATCH'])
@jwt_required()
@role_required(['EMPLOYEE'])
def update_skills():
    """Allow employees to update their own skills"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        skills = data.get('skills', [])
        
        if not isinstance(skills, list):
            return jsonify({"error": "Skills must be a list"}), 400
        
        # Clean and validate skills
        valid_skills = ['Network', 'Hardware', 'Software', 'Security', 'Account', 'General']
        cleaned = [s.strip() for s in skills if s.strip() in valid_skills]
        
        user = User.objects(id=user_id).first()
        employee = Employee.objects(user=user).first()
        
        if not employee:
            return jsonify({"error": "Employee profile not found"}), 404
        
        employee.skills = cleaned
        employee.save()
        
        return jsonify({
            "message": "Skills updated successfully",
            "skills": cleaned
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
