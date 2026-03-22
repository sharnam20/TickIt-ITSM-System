import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the backend directory
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key_change_in_prod'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/itsm_db'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt_secret_key_change_in_prod'
    MONGODB_SETTINGS = {
        'host': MONGO_URI
    }
    
    # Email Configuration (Gmail SMTP)
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'sharnamshah2006@gmail.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')  # App password required
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'sharnamshah2006@gmail.com'
    FRONTEND_URL = os.environ.get('FRONTEND_URL') or 'http://localhost:5173'
