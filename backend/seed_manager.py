from app import create_app
from models import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    email = "23cs089@charusat.edu.in"
    
    # Check if exists
    if User.objects(email=email).first():
        print(f"User {email} already exists. Deleting to recreate as MANAGER...")
        User.objects(email=email).delete()

    print(f"Creating Manager Account: {email}")
    
    hashed_pw = generate_password_hash("admin123")
    
    user = User(
        name="System Admin",
        email=email,
        password_hash=hashed_pw,
        role="MANAGER",
        is_verified=True,     # Managers are pre-verified by system definition
        verification_token=None
    )
    user.save()
    
    print("SUCCESS: Manager account created!")
    print(f"Login with -> Email: {email} | Password: admin123")
