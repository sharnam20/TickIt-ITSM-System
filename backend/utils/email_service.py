from flask_mail import Mail, Message
from flask import current_app, url_for
import uuid

mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with app config"""
    mail.init_app(app)

def generate_verification_token():
    """Generate a URL-safe verification token using UUID"""
    return str(uuid.uuid4())

def _can_send_email():
    """Check if SMTP credentials are properly configured"""
    password = current_app.config.get('MAIL_PASSWORD')
    return password is not None and password.strip() != ''

def send_verification_email(user_email, user_name, token):
    """Send verification email to user"""
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        verification_link = f"{frontend_url}/verify-email?token={token}"
        
        print(f"\n{'='*60}")
        print(f"[EMAIL] Verification email for: {user_email}")
        print(f"[EMAIL] Token: {token}")
        print(f"[EMAIL] Link: {verification_link}")
        print(f"{'='*60}\n")
        
        if not _can_send_email():
            print(f"[EMAIL] ⚠ MAIL_PASSWORD not set — email NOT sent.")
            print(f"[EMAIL] ✅ Use the link above to verify manually.\n")
            return True  # Return True so the flow continues
        
        msg = Message(
            subject="Verify Your Email - ITSM Platform",
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user_email]
        )
        
        msg.html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3b82f6;">Welcome to ITSM Platform!</h2>
                    <p>Hi {user_name},</p>
                    <p>Thank you for registering. Please verify your email address to activate your account.</p>
                    <div style="margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background: linear-gradient(to right, #3b82f6, #06b6d4); 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Or copy and paste this link in your browser:<br>
                        <a href="{verification_link}">{verification_link}</a>
                    </p>
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        If you didn't create this account, please ignore this email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        mail.send(msg)
        print(f"[EMAIL] ✅ Verification email SENT to {user_email}")
        return True
    except Exception as e:
        print(f"[EMAIL] ❌ Error sending email: {str(e)}")
        print(f"[EMAIL] ✅ Use the console link above to verify manually.\n")
        return True  # Still return True so user flow doesn't break

def send_reset_email(user_email, user_name, token):
    """Send password reset email to user"""
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?token={token}"
        
        print(f"\n{'='*60}")
        print(f"[RESET] Password reset email for: {user_email}")
        print(f"[RESET] Token: {token[:16]}...")
        print(f"[RESET] 🔗 RESET LINK: {reset_link}")
        print(f"{'='*60}\n")
        
        if not _can_send_email():
            print(f"[RESET] ⚠ MAIL_PASSWORD not set — email NOT sent.")
            print(f"[RESET] ✅ Copy the RESET LINK above and open it in your browser.\n")
            return True  # Return True so the flow continues
        
        msg = Message(
            subject="Reset Your Password - ITSM Platform",
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user_email]
        )
        
        msg.html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3b82f6;">Password Reset Request</h2>
                    <p>Hi {user_name},</p>
                    <p>We received a request to reset your password. Click the button below to set a new password.</p>
                    <div style="margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background: linear-gradient(to right, #3b82f6, #06b6d4); 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Or copy and paste this link in your browser:<br>
                        <a href="{reset_link}">{reset_link}</a>
                    </p>
                    <p style="color: #e74c3c; font-size: 14px; margin-top: 20px;">
                        ⚠ This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        mail.send(msg)
        print(f"[RESET] ✅ Reset email SENT to {user_email}")
        return True
    except Exception as e:
        print(f"[RESET] ❌ Error sending email: {str(e)}")
        print(f"[RESET] ✅ Copy the RESET LINK from the console above.\n")
        return True  # Still return True so user flow doesn't break


def send_ticket_update_email(user_email, user_name, ticket_id, status_or_action):
    """Send an email notification about ticket updates"""
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        ticket_link = f"{frontend_url}/dashboard"
        
        print(f"\n{'='*60}")
        print(f"[NOTIFICATION] Ticket update email for: {user_email}")
        print(f"[NOTIFICATION] Ticket: #{ticket_id[-6:]} - Action: {status_or_action}")
        print(f"{'='*60}\n")
        
        if not _can_send_email():
            print(f"[NOTIFICATION] ⚠ MAIL_PASSWORD not set — email NOT sent.")
            return True
            
        msg = Message(
            subject=f"Ticket Update: #{ticket_id[-6:]}",
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user_email]
        )
        
        msg.html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3b82f6;">Ticket Update Notification</h2>
                    <p>Hi {user_name},</p>
                    <p>There has been an update on ticket <strong>#{ticket_id[-6:]}</strong>:</p>
                    <p style="padding: 10px; background-color: #f3f4f6; border-left: 4px solid #3b82f6; font-weight: bold;">
                        {status_or_action}
                    </p>
                    <div style="margin: 30px 0;">
                        <a href="{ticket_link}" 
                           style="background: linear-gradient(to right, #3b82f6, #06b6d4); 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  display: inline-block;">
                            View Ticket Dashboard
                        </a>
                    </div>
                </div>
            </body>
        </html>
        """
        
        mail.send(msg)
        print(f"[NOTIFICATION] ✅ Update email SENT to {user_email}")
        return True
    except Exception as e:
        print(f"[NOTIFICATION] ❌ Error sending update email: {str(e)}")
        return True
