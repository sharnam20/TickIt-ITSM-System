from database import db
import datetime

class User(db.Document):
    name = db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    role = db.StringField(required=True, choices=('CUSTOMER', 'EMPLOYEE', 'MANAGER'))
    is_verified = db.BooleanField(default=False)
    verification_token = db.StringField()
    reset_token = db.StringField()
    reset_token_expiry = db.DateTimeField()
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)

class Employee(db.Document):
    user = db.ReferenceField(User, required=True, reverse_delete_rule=db.CASCADE)
    skills = db.ListField(db.StringField())
    availability_status = db.StringField(choices=('AVAILABLE', 'ON_LEAVE', 'OFFLINE'), default='OFFLINE')
    current_ticket_load = db.IntField(default=0)
    failed_sla_tickets = db.IntField(default=0)
    shift_start = db.StringField()
    shift_end = db.StringField()

class Team(db.Document):
    name = db.StringField(required=True, unique=True)
    description = db.StringField()
    lead = db.ReferenceField(User)  # Team lead (Employee or Manager)
    members = db.ListField(db.ReferenceField(User))
    skills = db.ListField(db.StringField())  # E.g. ['Software', 'Network']
    created_by = db.ReferenceField(User, required=True)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)

class Ticket(db.Document):
    title = db.StringField(required=True)
    description = db.StringField(required=True)
    category = db.StringField()
    priority = db.StringField(required=True, choices=('LOW', 'MEDIUM', 'HIGH'))
    status = db.StringField(required=True, default='OPEN', choices=('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
    
    created_by = db.ReferenceField(User, required=True)
    assigned_to = db.ReferenceField(User) # Employee
    
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.datetime.utcnow)
    
    # SLA Fields
    sla_due_at = db.DateTimeField()
    sla_status = db.StringField(default='ON_TRACK', choices=('ON_TRACK', 'AT_RISK', 'BREACHED'))
    breach_acknowledged = db.BooleanField(default=False)

    # Feedback & Escalation
    rating = db.IntField(min_value=1, max_value=5)
    feedback_comment = db.StringField()
    is_escalated = db.BooleanField(default=False)

class TicketHistory(db.Document):
    ticket = db.ReferenceField(Ticket, required=True, reverse_delete_rule=db.CASCADE)
    action = db.StringField(required=True)
    performed_by = db.ReferenceField(User)
    timestamp = db.DateTimeField(default=datetime.datetime.utcnow)
    details = db.StringField()

class SLARule(db.Document):
    priority = db.StringField(required=True, unique=True, choices=('LOW', 'MEDIUM', 'HIGH'))
    resolution_time_hours = db.IntField(required=True)

class Notification(db.Document):
    recipient = db.ReferenceField(User, required=True, reverse_delete_rule=db.CASCADE)
    title = db.StringField(required=True)
    message = db.StringField(required=True)
    link = db.StringField()
    is_read = db.BooleanField(default=False)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)

class Comment(db.Document):
    ticket = db.ReferenceField('Ticket', required=True, reverse_delete_rule=db.CASCADE)
    author = db.ReferenceField(User, required=True)
    content = db.StringField(required=True)
    is_internal = db.BooleanField(default=False)  # Internal notes visible only to staff
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)

class Article(db.Document):
    title = db.StringField(required=True)
    content = db.StringField(required=True)  # Markdown content
    category = db.StringField(default='General')
    tags = db.ListField(db.StringField())  # For keyword search
    author = db.ReferenceField(User, required=True)
    is_published = db.BooleanField(default=False)
    views = db.IntField(default=0)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.datetime.utcnow)

class AuditLog(db.Document):
    """Security audit log for tracking user actions"""
    user = db.ReferenceField(User)
    user_email = db.StringField()  # Store email separately in case user is deleted
    action = db.StringField(required=True)  # LOGIN, LOGOUT, CREATE_STAFF, DELETE_TICKET, etc.
    details = db.StringField()
    ip_address = db.StringField()
    timestamp = db.DateTimeField(default=datetime.datetime.utcnow)
    
    meta = {'ordering': ['-timestamp']}
