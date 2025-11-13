from api.scheduler_api import create_app
from api.scheduler_api.models import db
app = create_app()
with app.app_context():
    db.create_all()

