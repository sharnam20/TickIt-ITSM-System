from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Employee, AuditLog
from werkzeug.security import generate_password_hash, check_password_hash
from utils.email_service import send_verification_email, send_reset_email, generate_verification_token
from utils.rbac import role_required
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Basic validation
    if User.objects(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400
        
    hashed_pw = generate_password_hash(data.get('password'))
    verification_token = generate_verification_token()
    
    print(f"[REGISTER] Generated UUID token: {verification_token}")
    
    try:
        user = User(
            name=data.get('name'),
            email=data.get('email'),
            password_hash=hashed_pw,
            role='CUSTOMER', # STRICTLY ENFORCED: Public registration is always CUSTOMER
            is_verified=False,
            verification_token=verification_token
        )
        user.save()
        print(f"[REGISTER] User saved with token: {user.verification_token}")
        
        # Send verification email
        send_verification_email(user.email, user.name, verification_token)
        
        return jsonify({
            "message": "Registration successful! Check your email to verify your account.",
            "user_id": str(user.id)
        }), 201
            
    except Exception as e:
        print(f"[REGISTER] Error: {str(e)}")
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    print(f"[VERIFY] Received token: {token[:20]}...")
    
    user = User.objects(verification_token=token).first()
    
    if not user:
        print(f"[VERIFY] No user found with this token")
        return jsonify({"error": "Invalid or expired verification token"}), 400
    
    print(f"[VERIFY] Found user: {user.email}")
    
    if user.is_verified:
        print(f"[VERIFY] User already verified - creating new token")
    else:
        user.is_verified = True
        user.verification_token = None
        user.save()
        print(f"[VERIFY] User {user.email} verified successfully")
    
    # Create access token for auto-login
    access_token = create_access_token(identity=str(user.id), expires_delta=datetime.timedelta(days=1))
    
    return jsonify({
        "message": "Email verified successfully!",
        "access_token": access_token,
        "role": user.role,
        "name": user.name
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.objects(email=data.get('email')).first()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    if not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create token
    access_token = create_access_token(identity=str(user.id), expires_delta=datetime.timedelta(days=1))
    
    # Audit log
    try:
        AuditLog(
            user=user,
            user_email=user.email,
            action='LOGIN',
            details='User logged in',
            ip_address=request.remote_addr
        ).save()
    except Exception as e:
        print(f"[AUDIT] Failed to log login: {e}")
        
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "name": user.name
    }), 200

@auth_bp.route('/create-staff', methods=['POST'])
@role_required(['MANAGER'])
def create_staff():
    """
    Admin-only route for creating Employee/Manager accounts.
    Bypasses email verification (assumes internal trust).
    """
    data = request.get_json()
    
    target_role = data.get('role')
    if target_role not in ['EMPLOYEE', 'MANAGER']:
        return jsonify({"error": "Invalid role. Only EMPLOYEE or MANAGER allowed."}), 400
        
    if User.objects(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400
        
    hashed_pw = generate_password_hash(data.get('password'))
    
    try:
        # 1. Create User
        user = User(
            name=data.get('name'),
            email=data.get('email'),
            password_hash=hashed_pw,
            role=target_role,
            is_verified=True, # Internal staff are pre-verified
            verification_token=None
        )
        user.save()
        
        # 2. If Employee, create detailed profile
        if target_role == 'EMPLOYEE':
            employee = Employee(
                user=user,
                skills=data.get('skills', []),
                availability_status='OFFLINE'
            )
            employee.save()
            
        print(f"[ADMIN] Created {target_role}: {user.email}")
        
        # Audit Log
        try:
            creator_id = get_jwt_identity()
            creator = User.objects(id=creator_id).first()
            if creator:
                AuditLog(
                    user=creator,
                    user_email=creator.email,
                    action='STAFF_CREATED',
                    details=f"Created {target_role} account for {user.email}",
                    ip_address=request.remote_addr
                ).save()
        except Exception as e:
            print(f"[AUDIT] Failed to log staff creation: {e}")
            
        return jsonify({
            "message": f"{target_role} account created successfully",
            "user_id": str(user.id)
        }), 201
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send a password reset email with a unique token"""
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.objects(email=email).first()
    
    if not user:
        # Return success even if email not found (security: don't reveal if email exists)
        return jsonify({"message": "If that email exists, a reset link has been sent."}), 200
    
    # Generate reset token and set 1-hour expiry
    reset_token = generate_verification_token()
    user.reset_token = reset_token
    user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    user.save()
    
    print(f"[RESET] Generated reset token for {email}: {reset_token[:8]}...")
    
    # Send the reset email
    send_reset_email(user.email, user.name, reset_token)
    
    return jsonify({"message": "If that email exists, a reset link has been sent."}), 200

@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    """Reset the user's password using the token from email"""
    data = request.get_json()
    new_password = data.get('password', '')
    
    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    user = User.objects(reset_token=token).first()
    
    if not user:
        return jsonify({"error": "Invalid or expired reset link"}), 400
    
    # Check expiry
    if user.reset_token_expiry and user.reset_token_expiry < datetime.datetime.utcnow():
        user.reset_token = None
        user.reset_token_expiry = None
        user.save()
        return jsonify({"error": "Reset link has expired. Please request a new one."}), 400
    
    # Update password
    user.password_hash = generate_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    user.save()
    
    print(f"[RESET] Password successfully reset for {user.email}")
    
    return jsonify({"message": "Password reset successful! You can now log in with your new password."}), 200