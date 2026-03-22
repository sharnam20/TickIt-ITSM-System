from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Extensions
    CORS(app)
    from database import init_db
    init_db(app)

    from flask_jwt_extended import JWTManager
    JWTManager(app)
    
    from utils.email_service import init_mail
    init_mail(app)

    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from routes.tickets import tickets_bp
    app.register_blueprint(tickets_bp, url_prefix='/api/tickets')

    from routes.stats import stats_bp
    app.register_blueprint(stats_bp, url_prefix='/api/stats')

    from routes.solutions import solutions_bp
    app.register_blueprint(solutions_bp, url_prefix='/api/solutions')

    from routes.notifications import notifications_bp
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')

    from routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    from routes.customer_actions import customer_bp
    app.register_blueprint(customer_bp, url_prefix='/api/cx')

    from routes.teams import teams_bp
    app.register_blueprint(teams_bp, url_prefix='/api/teams')

    @app.route('/')
    def index():
        return jsonify({
            "status": "success",
            "message": "ITSM Intelligent Ticket Backend is Running",
            "version": "1.0.0"
        })

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
