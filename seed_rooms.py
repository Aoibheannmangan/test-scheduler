from api.scheduler_api import create_app
from api.scheduler_api import db
from api.scheduler_api.models import Room

def seed_rooms():
    app = create_app()
    with app.app_context():
        rooms = [
            {"room_id": 1, "name": "TeleRoom"},
            {"room_id": 2, "name": "room1"},
            {"room_id": 3, "name": "room2"},
            {"room_id": 4, "name": "room3"},
            {"room_id": 5, "name": "room4"},
            {"room_id": 6, "name": "devRoom"},
        ]

        for r in rooms:
            existing_room = Room.query.filter_by(room_id=r["room_id"]).first()
            if not existing_room:
                new_room = Room(room_id=r["room_id"], name=r["name"])
                db.session.add(new_room)

            db.session.commit()

if __name__ == "__main__":
    seed_rooms()