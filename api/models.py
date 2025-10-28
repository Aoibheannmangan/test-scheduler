from extensions import db
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    email = db.Column(db.String, primary_key=True)
    staff_number = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

class Booking(db.Model):
    __tablename__ = 'bookings'
    room_id = db.Column(db.String, primary_key=True, default=generate_uuid)
    patient_id = db.Column(db.String)
    date = db.Column(db.DateTime, nullable=False)
    blocked = db.Column(db.Boolean, default=False)
    note = db.Column(db.String, nullable=False)
    no_show = db.Column(db.Boolean, default=False)
    event_id = db.Column(db.String, db.ForeignKey('event.event_id'), nullable=False)

class Event(db.Model):
    __tablename__ = 'event'
    event_id = db.Column(db.String, primary_key=True, default=generate_uuid)
    event_type = db.Column(db.Enum('booked', 'window', 'blocked', name='event_type_enum'), nullable=False)
    visit_num = db.Column(db.Integer, nullable=False)
