
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
        
        return jsonify({
            "message": f"{target_role} account created successfully",
            "user_id": str(user.id)
        }), 201
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
