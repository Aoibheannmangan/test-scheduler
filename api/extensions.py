from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize SQLAlchemy for database operations
db = SQLAlchemy()
# Initialize Flask-Migrate for database migrations
migrate = Migrate()
