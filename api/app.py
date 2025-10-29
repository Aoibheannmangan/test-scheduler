from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db, migrate
from routes import get_data, book_appointment, delete_appointment
import os
import logging

# Configure logging for the application
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger(__name__)

def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__)

    # Configure the database URI and disable SQLAlchemy event tracking
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///scheduler.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize Flask extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)

    # Import database models to ensure they are registered with SQLAlchemy
    from models import User, Booking, Event

    # Enable Cross-Origin Resource Sharing (CORS) for the app
    CORS(app)

    # Define API routes and link them to their respective functions in routes.py
    @app.route("/api/data", methods=["GET"])
    def get_data_route():
        # Route to fetch data from an external source like REDCap
        return get_data()

    @app.route("/api/health", methods=["GET"])
    def health():
        # Health check endpoint for monitoring
        return jsonify({"status": "ok"}), 200

    # Routes for booking and deleting appointments
    @app.route("/api/book", methods=["POST"])
    def book_appointment_route():
        return book_appointment()

    @app.route("/api/appointment/<event_id>", methods=["DELETE"])
    def delete_appointment_route(event_id):
        return delete_appointment(event_id)

    return app

if __name__ == "__main__":
    app = create_app()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    env = os.getenv("FLASK_ENV", "production")
    # Determine whether to use Waitress for production or Flask's built-in server for development
    use_waitress = env != "development"

    logger.info(f"Starting app on {host}:{port} env={env} use_waitress={use_waitress}")

    if use_waitress:
        # Use Waitress for production deployment if available
        try:
            from waitress import serve
        except Exception:
            logger.warning("waitress not found; falling back to Flask builtin server")
            app.run(host=host, port=port)
        else:
            serve(app, host=host, port=port)
    else:
        # Use Flask's built-in development server
        app.run(host=host, port=port, debug=True)
