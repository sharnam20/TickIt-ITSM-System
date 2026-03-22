import os
from mongoengine import connect
from dotenv import load_dotenv
import sys

# Add the current directory to path so we can import models
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from models import SLARule

def seed_sla_rules():
    load_dotenv()
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/itsm_db')
    
    print(f"Connecting to {mongo_uri}...")
    connect(host=mongo_uri)
    
    print("Deleting existing SLA rules...")
    SLARule.objects.delete()
    
    rules = [
        SLARule(priority='LOW', resolution_time_hours=72),
        SLARule(priority='MEDIUM', resolution_time_hours=24),
        SLARule(priority='HIGH', resolution_time_hours=8)
    ]
    
    for r in rules:
        r.save()
        print(f"Saved SLA Rule: {r.priority} -> {r.resolution_time_hours}h")
    
    print("SLA rules seeding complete.")

if __name__ == '__main__':
    seed_sla_rules()
