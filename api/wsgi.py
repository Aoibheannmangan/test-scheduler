from api.scheduler_api import create_app
from api.scheduler_api.models import db
import os

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host="0.0.0.0", port=port)