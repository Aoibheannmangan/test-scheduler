from flask import Flask, jsonify
from flask_cors import CORS
from .extensions import db, migrate
from .routes import get_data, book_appointment, delete_appointment
from .auth import register_user, login
from .tokenDecorator import token_required
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

    # Configure the database URI to use the instance folder
    db_path = os.path.join(app.instance_path, 'scheduler.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)

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

    @app.route("/api/appointment/<event_id>", methods=["DELETE"])
    def delete_appointment_route(event_id):
        return delete_appointment(event_id)

    @app.route("/api/register", methods=["POST"])
    def register_route():
        return register_user()

    @app.route("/api/login", methods=["POST"])
    def login_route():
        return login()

    return app
