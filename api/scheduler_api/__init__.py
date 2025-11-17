from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from .extensions import db, migrate
from .routes import get_data, book_appointment, delete_appointment, get_all_events, update_appointment, add_blocked_date, get_blocked_dates
from .auth import register_user, login
import os
import logging
from .tokenDecorator import token_required

def create_app():
    """Creates and configures the Flask application."""
    import os
    from flask import Flask, send_from_directory

    # Absolute path to the build folder
    build_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../build"))

    app = Flask(__name__, static_folder=build_dir, static_url_path="/")

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key')

    # Load configuration from config.py and instance/config.py
    app.config.from_object('api.config')
    if app.config.get('SECRET_KEY') is None:
        app.config.from_pyfile('config.py', silent=True)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db, directory=app.config['MIGRATION_DIR'])

    with app.app_context():
        from . import models
        db.create_all()

    # Enable CORS
    CORS(app, origins=["https://test-scheduler-2.onrender.com/", "http://localhost:3000"])

    # Import models here to avoid circular imports
    from . import models

    # --- Register Routes ---
    @app.route("/api/data", methods=["GET"])
    def get_data_route():
        return get_data()

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    @app.route("/api/book", methods=["POST"])
    @token_required # Applying decorator
    def book_appointment_route(current_user):
        return book_appointment(current_user)
    
    @app.route("/api/appointment/<event_id>", methods=["DELETE"])
    @token_required
    def delete_appointment_route(current_user, event_id):
        return delete_appointment(current_user, event_id)

    @app.route("/api/appointment/<event_id>", methods=["PUT"])
    @token_required
    def update_appointment_route(current_user, event_id):
        return update_appointment(current_user, event_id)
    
    @app.route("/api/appointments", methods=["GET"])
    @token_required
    def get_all_events_route(current_user):
        return get_all_events(current_user)

    @app.route("/api/register", methods=["POST"])
    def register_route():
        return register_user()

    @app.route("/api/login", methods=["POST"])
    def login_route():
        return login()

    @app.route("/api/block-date", methods=["POST"])
    @token_required
    def add_blocked_date_route(current_user):
        return add_blocked_date(current_user)

    @app.route("/api/blocked-dates", methods=["GET"])
    @token_required
    def get_blocked_dates_route(current_user):
        return get_blocked_dates(current_user)
    
    @app.route("/api/debug/users")
    def debug_users():
        from .models import User
        users = User.query.all()
        return {"users": [u.email for u in users]}

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        return send_from_directory(app.static_folder, "index.html")

    @app.errorhandler(404)
    def not_found(e):
        from flask import request
        if not request.path.startswith("/api/"):
            return send_from_directory(app.static_folder, "index.html")
        return e  # For API routes, return normal 404
    return app
