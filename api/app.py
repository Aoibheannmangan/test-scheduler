from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db, migrate
from routes import get_data
import os
import logging

# Logging
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///instance/scheduler.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)

# Import models
from models import User, Booking, Event

CORS(app)

@app.route("/api/data", methods=["GET"])
def get_data_route():
    return get_data()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    env = os.getenv("FLASK_ENV", "production")
    use_waitress = env != "development"

    logger.info(f"Starting app on {host}:{port} env={env} use_waitress={use_waitress}")

    if use_waitress:
        try:
            from waitress import serve
        except Exception:
            logger.warning("waitress not found; falling back to Flask builtin server")
            app.run(host=host, port=port)
        else:
            serve(app, host=host, port=port)
    else:
        app.run(host=host, port=port, debug=True)
