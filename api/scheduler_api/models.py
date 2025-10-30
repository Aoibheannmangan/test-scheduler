from .extensions import db
import uuid

def generate_uuid():
    # Generates a unique UUID string
    return str(uuid.uuid4())

# The following is the schema for the db
class User(db.Model):
    # User model representing the 'users' table in the database.
    __tablename__ = 'users'
    email = db.Column(db.String, primary_key=True) # User's email, serving as primary key
    staff_number = db.Column(db.String, unique=True, nullable=False) # Unique staff identifier
    password_hash = db.Column(db.String, nullable=False) # Hashed password for security

class Booking(db.Model):
    # Booking model representing the 'bookings' table in the database.
    __tablename__ = 'bookings'
    room_id = db.Column(db.String, primary_key=True, default=generate_uuid) # Unique ID for the room booking
    patient_id = db.Column(db.String) # Identifier for the patient
    date = db.Column(db.DateTime, nullable=False) # Date and time of the booking
    blocked = db.Column(db.Boolean, default=False) # Flag if the slot is blocked
    note = db.Column(db.String, nullable=False) # Notes related to the booking
    no_show = db.Column(db.Boolean, default=False) # Flag if the patient was a no-show
    event_id = db.Column(db.String, db.ForeignKey('event.event_id'), nullable=False) # Foreign key to the Event table

class Event(db.Model):
    # Event model representing the 'event' table in the database.
    __tablename__ = 'event'
    event_id = db.Column(db.String, primary_key=True, default=generate_uuid) # Unique ID for the event
    event_type = db.Column(db.Enum('booked', 'window', 'blocked', name='event_type_enum'), nullable=False) # Type of event (e.g., booked, window, blocked)
    visit_num = db.Column(db.Integer, nullable=False) # Visit number for the event
