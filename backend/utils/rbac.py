from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps
from models import User

def role_required(allowed_roles):
    """
    Decorator to enforce role-based access control.
    :param allowed_roles: List of allowed roles or single string
    """
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.objects(id=user_id).first()
            
            if not user:
                 return {"error": "User not found"}, 404
                 
            if user.role not in allowed_roles:
                 return {"error": "Access Forbidden: Insufficient Permissions"}, 403
                 
            return fn(*args, **kwargs)
        return wrapper
    return decorator
