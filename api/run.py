
import os
import logging
from scheduler_api import create_app

from apscheduler.schedulers.background import BackgroundScheduler

app = create_app()



    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    env = os.getenv("FLASK_ENV", "production")
    use_waitress = env != "development"

    # Use app.logger which is configured inside create_app
    app.logger.info(f"Starting app on {host}:{port} env={env} use_waitress={use_waitress}")

    if use_waitress:
        try:
            from waitress import serve
            serve(app, host=host, port=port)
        except ImportError:
            app.logger.warning("waitress not found; falling back to Flask builtin server")
            app.run(host=host, port=port)
    else:
        app.run(host=host, port=port, debug=True)
