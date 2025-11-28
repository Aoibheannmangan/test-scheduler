from .extensions import db
import uuid

def generate_uuid():
    """
    Generate a unique universally unique identifier (UUID).

    Returns:
        str: A randomly generated UUID as a string, ensuring uniqueness across database records.

    Note:
        - Uses Python's uuid4 method, which generates a random UUID
        - Suitable for primary key generation in database models
    """
    return str(uuid.uuid4())

class Room(db.Model):
    """
    Represents an assessment room or location in the database.

    Attributes:
        room_id (int): Unique primary key identifier for the room.
        name (str): Unique name of the room, cannot be null.

    Database Table:
        - Table Name: 'rooms'
        - Constraints: 
            * room_id is the primary key
            * name must be unique and cannot be null

    Example:
        room = Room(name="Assessment Room 1")
    """
    __tablename__ = 'rooms'
    room_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

class User(db.Model):
    """
    Represents a user of the scheduler.

    Attributes:
        user_id (str): Unique primary key identifier for the user.
        email (str): User's email
        staff_number (str): Unique staff identifier
        password_hash (str): Hashed password for security.

    Database Table:
        - Table Name: 'user'
        - Constraints: 
            * room_id is the primary key
            * name must be unique and cannot be null

    Database Table:
        - Table Name: 'users'
        - Constraints:
            * user_id is the primary key, generated as a UUID
            * email must be unique and cannot be null
            * staff_number must be unique and cannot be null
            * password_hash cannot be null

    Security Notes:
        - Stores password as a hash, not plain text
        - Uses UUID for user identification to enhance security

    Example:
        user = User(  
            email="john.doe@example.com",   
            staff_number="12345",  
            password_hash=hash_password("securepassword")  
        )
    """
    __tablename__ = 'users'
    user_id = db.Column(db.String, primary_key=True, default=generate_uuid) # User Id serving as primary key
    email = db.Column(db.String, unique=True, nullable=False) # User's email
    staff_number = db.Column(db.String, unique=True, nullable=False) # Unique staff identifier
    password_hash = db.Column(db.String, nullable=False) # Hashed password for security

class Booking(db.Model):
    """
    Represents a booking or reservation in the system.

    Attributes:
        booking_id (str): Unique primary key identifier, auto-generated using UUID.
        patient_id (str): Identifier for the patient associated with the booking.
        blocked (bool): Indicates if the booking slot is blocked.
        note (str, optional): Additional notes related to the booking.
        no_show (bool): Indicates if the patient did not attend the booking.
        out_of_window (bool): Indicates if the booking is outside the recommended visit window.
        event_id (str): Foreign key linking to the corresponding Event.
        room_id (int): Foreign key linking to the Room where the booking takes place.

    Database Table:
        - Table Name: 'bookings'
        - Constraints:
            * booking_id is the primary key, generated as a UUID
            * event_id is a required foreign key to the Event table
            * room_id is a required foreign key to the Rooms table

    Relationships:
        - Many-to-One with Event table
        - Many-to-One with Rooms table

    Example:
        booking = Booking(  
            patient_id="230-135",  
            blocked=False,  
            note="EEG Required",  
            no_show=False,  
            out_of_window=False,  
            event_id="event_uuid",  
            room_id=1  
        )
    """
    __tablename__ = 'bookings'
    booking_id = db.Column(db.String, primary_key=True, default=generate_uuid) # Unique ID for the room booking
    patient_id = db.Column(db.String) # Identifier for the patient
    blocked = db.Column(db.Boolean, default=False) # Flag if the slot is blocked (In case date is blocked after booking)
    note = db.Column(db.String, nullable=True) # Notes related to the booking
    no_show = db.Column(db.Boolean, default=False) # Flag if the patient was a no-show
    out_of_window = db.Column(db.Boolean, default=False) # Flag if the patient was booked outside of visit window
    event_id = db.Column(db.String, db.ForeignKey('event.event_id'), nullable=False) # Foreign key to the Event table
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.room_id'), nullable=False) # Foreign key to the Rooms table

class Event(db.Model):
    """
    Represents a booking or reservation in the system.

    Attributes:
        event_id (str): Unique primary key identifier, auto-generated using UUID.
        event_title (str): Title of the event to be displayed on the calendar.
        start_date (datetime): ISO date time for the beginning of the event
        end_date (datetime): ISO date time for the end of the event
        event_type (enum): Specifies the type of event. Can be a 'window', 'booked', 'blocked', etc ...
        visit_num (int): The visit number that the patient is on for this event. 
         
    Database Table:
        - Table Name: 'event'
        - Constraints:
            * event_id is the primary key, generated as a UUID
            * event_type is a required Enum value
            
    Example:
        event = Event(  
            event_id=f47ac10b-58cc-4372-a567-0e02b2c3d479,  
            event_title="ID: 230136 | Visit: 3",  
            start_date=2025-11-28T14:30:00+00:00,  
            end_date=2025-11-28T17:30:00+00:00,  
            event_type="booked",  
            visit_num=3  
        )
    """
    __tablename__ = 'event'
    event_id = db.Column(db.String, primary_key=True, default=generate_uuid) # Unique ID for the event
    event_title = db.Column(db.String, nullable=False) # Booking title for calendar
    start_date = db.Column(db.DateTime, nullable=False) # Date and time of the booking
    end_date = db.Column(db.DateTime, nullable=False) # Date and time of end of the booking
    event_type = db.Column(db.Enum('booked', 'window', 'blocked', 'completed', 'leave',  name='event_type_enum'), nullable=False) # Type of event (e.g., booked, window, blocked, completed)
    visit_num = db.Column(db.Integer, nullable=True) # Visit number for the event
