from flask import Flask, jsonify, current_app, request
from flask_cors import CORS
import requests
from config import REDCAP_API_URL, API_TOKEN
import logging
import os
from .extensions import db
from .models import Booking, Event, Room
from datetime import datetime
from .tokenDecorator import token_required

logger = logging.getLogger(__name__)

# API func
def get_data():
    # Fetches data from the REDCap API and returns it as JSON
    
    # Fetch records from REDCap API. Uses API_TOKEN and REDCAP_API_URL from config.py.
    # Returns JSON or an error response suitable for the frontend.
    
    # Basic validation
    token = API_TOKEN
    url = REDCAP_API_URL
    if not token or token.strip() == "":
        logger.error("API_TOKEN is missing")
        return jsonify({"error": "Server configuration error: API token missing"}), 500
    if not url:
        logger.error("REDCAP_API_URL is missing")
        return jsonify({"error": "Server configuration error: API url missing"}), 500

    payload = {
        'token': API_TOKEN,
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'fields[0]': 'record_id', # Record id
        'fields[1]': 'nicu_ooa', # Kildare?
        'fields[2]': 'nicu_participant_group', # Part group
        'fields[3]': 'nicu_dob', # Dat of birth
        'fields[4]': 'nicu_dag', # Site
        'fields[5]': 'nicu_email',# Contact email
        'fields[6]': 'nicu_days_early',# Days early
        'fields[7]': 'nicu_sex',# Sex of patient
        'fields[9]': 'nicu_gest_age_w',# Weeks of gestation
        'fields[10]': 'nicu_gest_age_d',# Days of gestation (Additional days of gestation)
        'fields[11]': 'v2_next_visit_range', # visit 2 window
        'fields[12]': 'v3_next_visit_between', # visit 3 window
        'fields[13]': 'v4_next_visit_range', # visit 4 window
        'fields[14]': 'v5_next_visit_range', # visit 5 window
    }
    
    # Make the POST request to the REDCap API
    response = requests.post(REDCAP_API_URL, data=payload)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse the JSON response
        return jsonify(data)  # Return the data as a JSON response
        
    else:
        return jsonify({'error': 'Failed to fetch data', 'status_code': response.status_code}), response.status_code
    
# Booking funcs
def book_appointment(current_user):
    """Handles the booking of a new appointment."""
    logger.info(f"Appointment booking request by user: {current_user.email}")
    data = request.get_json()
    patient_id = data.get('patientId')
    title = f"ID: {patient_id}"
    start_str = data.get('start')
    end_str = data.get('end')
    notes = data.get('notes', '')
    room_id = data.get('roomId')

    # Validate required input fields
    if not all([patient_id, start_str, end_str, room_id]):
        return jsonify({"error": "Missing patientId, start date, or roomId"}), 400

    try:
        # Convert date string to datetime object, handling UTC 'Z' suffix
        start_obj = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
        end_obj = datetime.fromisoformat(end_str.replace('Z', '+00:00'))

        # Check for overlapping blocked events
        conflicting_blocked_event = Event.query.filter(
            Event.event_type == 'blocked',
            Event.start_date < end_obj,
            Event.end_date > start_obj
        ).first()

        if conflicting_blocked_event:
            return jsonify({"error": "The selected time slot is blocked."}), 409

        # Create a new Event entry
        new_event = Event(
            event_title=title,
            start_date=start_obj,
            end_date=end_obj,
            event_type='booked', 
            visit_num=1 # Default visit_num to 1 for new bookings
        )
        db.session.add(new_event)
        db.session.flush() # Flush to get the event_id before committing

        # Create a new Booking entry linked to the event
        new_booking = Booking(
            patient_id=patient_id,
            blocked=False,
            note=notes,
            no_show=False,
            event_id=new_event.event_id,
            room_id=room_id
        )
        db.session.add(new_booking)
        db.session.commit() # Commit both event and booking to the database
        return jsonify({"ok": True, "eventId": new_event.event_id}), 201
    except Exception as e:
        # Rollback in case of error and log the exception
        db.session.rollback()
        logger.error(f"Error booking appointment: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


def get_all_bookings(current_user):
    """Retrieves all bookings from the database"""
    logger.info(f"Fetching all bookings for users: {current_user.email}")
    bookings = db.session.query(Booking, Event).join(Event).all()
    
    # Serialise bookings to a list of dicts
    booking_list = []
    for booking, event in bookings:
        booking_list.append({
            "booking_id": booking.booking_id,
            "title": event.event_title,
            "patient_id": booking.patient_id,
            "start": event.start_date.isoformat(), # Convert date to ISO string
            "end": event.end_date.isoformat(),
            "blocked": booking.blocked,
            "note": booking.note,
            "no_show": booking.no_show,
            "event_id": booking.event_id,
            "event_type": event.event_type,
            "room_id": booking.room_id
        })
    return jsonify({"bookings": booking_list}), 200


def delete_appointment(current_user, event_id):
    """Handles the deletion of an appointment by event_id."""
    logger.info(f"Appointment deletion requested by {current_user.email} for event {event_id}")
    
    try:
        # Find the booking and event associated with the given event_id
        booking_to_delete = Booking.query.filter_by(event_id=event_id).first()
        event_to_update = Event.query.filter_by(event_id=event_id).first()
        
        # Return 404 if appointment not found
        if not booking_to_delete or not event_to_update:
            return jsonify({"error": "Appointment not found"}), 404

        # Delete the booking and update the event type to 'window'
        db.session.delete(booking_to_delete)
        event_to_update.event_type = 'window'
        db.session.commit() # Commit changes to the database
        return jsonify({"ok": True}), 200

    except Exception as e:
        # Rollback in case of error and log the exception
        db.session.rollback()
        logger.error(f"Error deleting appointment: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


def update_appointment(current_user, event_id):
    """Handles the updating of an appointment by event_id."""
    logger.info(f"Appointment update requested by {current_user.email} for event {event_id}")
    data = request.get_json()

    try:
        booking_to_update = Booking.query.filter_by(event_id=event_id).first()
        event_to_update = Event.query.filter_by(event_id=event_id).first()
        
        if not booking_to_update or not event_to_update:
            return jsonify({"error": "Appointment not found"}), 404

        if 'start' in data:
            event_to_update.start_date = datetime.fromisoformat(data['start'].replace('Z', '+00:00'))
        
        if 'end' in data:
            event_to_update.end_date = datetime.fromisoformat(data['end'].replace('Z', '+00:00'))
            
        if 'title' in data:
            event_to_update.event_title = data['title']

        if 'note' in data:
            booking_to_update.note = data['note']

        if 'no_show' in data:
            booking_to_update.no_show = data['no_show']

        if 'roomId' in data:
            booking_to_update.room_id = data['roomId']

        db.session.commit()
        return jsonify({"ok": True}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating appointment: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

# Blocking funcs

def add_blocked_date(current_user):
    """Handles the blocking of a date."""
    logger.info(f"Blocked date request by user: {current_user.email}")
    data = request.get_json()
    date_str = data.get('date')
    title = "Blocked"

    if not date_str:
        return jsonify({"error": "Missing date"}), 400

    try:
        # For a full-day event, use the start of the day for both start and end
        start_of_day = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(hour=23, minute=59, second=59, microsecond=999999)

        new_event = Event(
            event_title='Blocked',
            start_date=start_of_day,
            end_date=end_of_day,
            event_type='blocked',
            visit_num=None
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"ok": True, "eventId": new_event.event_id}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error blocking date: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

def get_blocked_dates(current_user):
    """Retrieves all blocked dates from the database."""
    logger.info(f"Fetching all blocked dates for user: {current_user.email}")
    blocked_events = Event.query.filter_by(event_type='blocked').all()

    blocked_dates_list = []
    for event in blocked_events:
        blocked_dates_list.append({
            "eventId": event.event_id,
            "title": event.event_title,
            "start": event.start_date.isoformat(),
            "end": event.end_date.isoformat(),
            "allDay": True,
            "blocked": True,
            "event_type": event.event_type
        })
    
    return jsonify({"blockedDates": blocked_dates_list}), 200