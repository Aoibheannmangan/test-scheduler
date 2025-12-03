from flask import Flask, jsonify, request
from flask_cors import CORS
from .extensions import db, migrate
from .routes import get_data, book_appointment, delete_appointment, get_all_events, update_appointment, add_blocked_date, get_blocked_dates, add_leave, get_leave, unblock_date, fetch_patient_birthdays
from .auth import register_user, login
import os
import logging
from .tokenDecorator import token_required

def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Load configuration from config.py and instance/config.py
    app.config.from_object('config')
    if app.config.get('SECRET_KEY') is None:
        app.config.from_pyfile('config.py', silent=True)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db, directory=app.config['MIGRATION_DIR'])

    with app.app_context():
        db.create_all()
    # Enable CORS
    CORS(app)

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
    
    @app.route("/api/birthdays", methods=["GET"])
    @token_required
    def get_all_patient_birthdays_route(current_user):
        birthdays = fetch_patient_birthdays()
        return jsonify({"birthdays": birthdays}), 200

    
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

    @app.route("/api/leave", methods=["POST"])
    @token_required
    def add_leave_route(current_user):
        return add_leave(current_user)

    @app.route("/api/leave", methods=["GET"])
    @token_required
    def get_leave_route(current_user):
        return get_leave(current_user)

    @app.route("/api/unblock", methods=["POST"])
    @token_required
    def unblock_dates_route(current_user):
        data = request.get_json()
        start = data.get("start")
        end = data.get("end")

        if not start or not end:
            return jsonify({"error": "Start and End required"}), 400

        return unblock_date(current_user, start, end)


    return app


