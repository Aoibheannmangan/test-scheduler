from sqlalchemy import text
from api.scheduler_api import db

def fix_db():
    try:
        db.session.execute(text("ALTER TYPE event_type_enum ADD VALUE 'leave';"))
    except Exception as e:
        print("Enum already exists", e)

    try:
        db.session.execute(text(
            "ALTER TABLE booking ADD COLUMN IF NOT EXISTS out_of_window BOOLEAN DEFAULT FALSE;"
        ))
    except Exception as e:
        print("Column already exists", e)

    db.session.commit()