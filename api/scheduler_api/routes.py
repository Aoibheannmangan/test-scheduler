from flask import Flask, jsonify, current_app, request, Response
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
def get_data() -> Response:
    """
    Data Retrieval Route  
    Fetches data from the REDCap API and returns it as JSON.

    This endpoint sends a POST request to the REDCap API using the `API_TOKEN` 
    and `REDCap URL` provided in `config.py`. It retrieves fields such as site, 
    date of birth, and gestational age.

    Request:
        Method: GET  
        Endpoint: /api/data  
        No request parameters required.

    Behavior:
        - If REDCAP_API_URL or API_TOKEN are missing, returns a 500 error.
        - Constructs a payload specifying which REDCap fields to retrieve.
        - Makes a POST request to the REDCap API.
        - Returns the data as JSON on success.
        - Returns 500 on API failure.

    Returns:
        200 OK: JSON array of REDCap records.  
        500 Internal Server Error: JSON error message.

    Example Response:
        ```json
        [
            {
                "record_id": "001",
                "nicu_dob": "2020-05-12",
                "nicu_sex": "F",
                "v2_next_visit_range": "2021-06-01 to 2021-06-15"
            }
        ]
        ```
    """

    
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
        # general info on infant
        'fields[0]': 'record_id', # Record id
        'fields[1]': 'reg_ooa', # Kildare?
        'fields[2]': 'reg_participant_group', # Part group
        'fields[3]': 'nn_dob', # Dat of birth
        'fields[4]': 'reg_dag', # Site
        'fields[5]': 'nicu_email',# Contact email
        'fields[6]': 'reg_days_early',
        'fields[7]': 'nn_sex',
        # gest days/ weeks
        'fields[8]': 'reg_gest_age_w',
        'fields[9]': 'reg_gest_age_d',
        # visit x range (for window range)
        
        'fields[10]':'reg_date1', #v2 window dates
        'fields[11]':'reg_date2',
        
        'fields[12]':'reg_9_month_window', #v3 window date, and so on...
        'fields[13]':'reg_12_month_window',

        'fields[14]':'reg_17_month_window',
        'fields[15]':'reg_19_month_window',

        'fields[16]':'reg_23_month_window',
        'fields[17]':'reg_25_month_window',

        'fields[18]':'reg_30_month_window',
        'fields[19]':'reg_31_month_window',
        
        # visit x attended? (Used for visit num)
        'fields[20]': 'visit_1_nicu_discharge_complete', # completed visit 1
        'fields[21]': 'v2_attend', # completed visit 2, and so on.. 
        'fields[22]': 'v3_attend',
        'fields[23]': 'v4_attend',
        'fields[24]': 'v5_attend',
        'fields[25]': 'v6_attend',
    }
    
    # Make the POST request to the REDCap API
    response = requests.post(REDCAP_API_URL, data=payload, verify=False)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse the JSON response
        return jsonify(data)  # Return the data as a JSON response
        
    else:
        logger.error(f"Failed to fetch data from REDCap. Status Code: {response.status_code}, Response: {response.text}")
        return jsonify({'error': 'Failed to fetch data', 'status_code': response.status_code}), response.status_code
    
# Helper functions
def fetch_visit_data(patient_id: str) -> dict:
    """This is a helper function which retrieves boolean fields from REDCap.  
    These fields determine whether the participant has attended a certain visit. 
    After these are retrieved, a loop is initialised and it loops through all the fields to see which visit was not attended. For every loop, a counter for the visit number is being incremented.  
    When there is a `field == 0`, the loop terminates and the `visit_num` is returned.  

    Args:
        patient_id (str):
            The REDCap record ID for which visit attendance fields should be
            retrieved.
            
    Example Response: 
        ```json
        [
            {
                'visit_1_nicu_discharge_complete': '1'
                'v2_attend': '1'
                'v3_attend': '1'
                'v4_attend': '1'
                'v5_attend': '0'
                'v6_attend': '0'
            }
        ]
        ```

    Returns:
        dict:
            A dictionary containing attendance fields for the specified patient.
            If the REDCap request fails or returns no data, an empty dictionary
            is returned.
    """

    payload = {
        'token': API_TOKEN,
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'records[0]': patient_id,
        'fields[0]': 'visit_1_nicu_discharge_complete',
        'fields[1]': 'v2_attend',
        'fields[2]': 'v3_attend',
        'fields[3]': 'v4_attend',
        'fields[4]': 'v5_attend',
        'fields[5]': 'v6_attend',
    }
    response = requests.post(REDCAP_API_URL, data=payload, verify=False)
    if response.status_code == 200:
        data = response.json()
        if data:
            return data[0]  # return first record
    return {}

def calculate_visit_num(patient_data: dict) -> int:
    """Determine the next visit number based on REDCap attendance fields.

    The first visit (`visit_1_nicu_discharge_complete`) is checked. If it is
    completed, the function iterates through visits 2-6 and increments the visit counter for each completed visit.
    The loop stops at the first missing ("0") visit.

    Args:
        patient_data (dict):
            A dictionary of visit attendance fields returned from
            `fetch_visit_data`.

    Returns:
        int:
            The next expected visit number for the participant.
            Defaults to 1 if no data is provided.
    """

    if not patient_data:
        return 1
    
    visit_num = 1
    if patient_data.get("visit_1_nicu_discharge_complete") == "1":
        visit_num = 2
        for i in range(2, 7):
            if patient_data.get(f"v{i}_attend") == "1":
                visit_num = i + 1
            else:
                break
    return visit_num
    
# Booking funcs
def book_appointment(current_user):
    """Handles the booking of a new appointment.
    
    Grabs all the information the user input on the appointment form and does simple operations such as concatinating the patient id and the visit number and setting it as a title.  
    Performs checks such as overlapping visits and blocked dates. This function utilises other functions such as `calculate_visit_num` and `fetch_visit_data` to pass the visit number of that patient.
    
    Args:
        current_user (object):
            The user requesting the booking. Must have an `email` attribute
            for logging and auditing purposes.

    Returns:
      Response: 
        - 201 Created: JSON object containing `ok: True` and `eventId` on
          successful booking.
        - 400 Bad Request: JSON object with `error` if required fields are
        missing.
        - 409 Conflict: JSON object with `error` if the selected time slot
          is blocked.            
        - 500 Internal Server Error: JSON object with `ok: False` and `error
        message if an exception occurs.
    """
    
    logger.info(f"Appointment booking request by user: {current_user.email}")
    data = request.get_json()
    patient_id = data.get('patientId')
    start_str = data.get('start')
    end_str = data.get('end')
    notes = data.get('notes', '')
    room_id = data.get('roomId')
    out_of_window = data.get('out_of_window', False)

    # Calculate visit number using REDCap data
    visit_data = fetch_visit_data(patient_id) 
    visit_num = calculate_visit_num(visit_data)

    # Build title with correct visit number
    title = f"ID: {patient_id} | Visit: {visit_num}"

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
            visit_num=visit_num # Use calculated visit_num
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
            room_id=room_id,
            out_of_window=out_of_window
        )
        db.session.add(new_booking)
        db.session.commit() # Commit both event and booking to the database
        return jsonify({"ok": True, "eventId": new_event.event_id}), 201
    except Exception as e:
        # Rollback in case of error and log the exception
        db.session.rollback()
        logger.error(f"Error booking appointment: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


def get_all_events(current_user):
    """Retrieves all events from the database with prioritization."""
    logger.info(f"Fetching all events for user: {current_user.email}")
    events = Event.query.all()

    # Group events by patient_id
    patient_events_map = {}
    for event in events:
        patient_id = None
        if event.event_type == 'booked':
            booking = Booking.query.filter_by(event_id=event.event_id).first()
            if booking:
                patient_id = booking.patient_id
        elif event.event_type == 'window':
            try:
                if event.event_title and event.event_title.startswith("ID: "):
                    patient_id = event.event_title.split(': ')[1]
            except IndexError:
                patient_id = None

        if patient_id:
            if patient_id not in patient_events_map:
                patient_events_map[patient_id] = []
            patient_events_map[patient_id].append(event)

    final_event_list = []
    for patient_id, events_for_patient in patient_events_map.items():
        # Step 1: Prioritize 'booked' events with the highest visit_num
        booked_candidates = [e for e in events_for_patient if e.event_type == 'booked']
        highest_visit_booked_event = None
        if booked_candidates:
            highest_visit_booked_event = max(booked_candidates, key=lambda e: e.visit_num if e.visit_num is not None else -1)

        # Step 2: If no 'booked' event, then prioritize 'window' events with the highest visit_num
        selected_event = None
        if highest_visit_booked_event:
            selected_event = highest_visit_booked_event
        else:
            window_candidates = [e for e in events_for_patient if e.event_type == 'window']
            if window_candidates:
                selected_event = max(window_candidates, key=lambda e: e.visit_num if e.visit_num is not None else -1)
        
        # Step 3: If a relevant event is selected, add its data to the final list
        if selected_event:
            event_data = {
                "event_id": selected_event.event_id,
                "title": selected_event.event_title,
                "start": selected_event.start_date.isoformat(),
                "end": selected_event.end_date.isoformat(),
                "event_type": selected_event.event_type,
                "visit_num": selected_event.visit_num,
            }

            if selected_event.event_type == 'booked':
                booking = Booking.query.filter_by(event_id=selected_event.event_id).first()
                if booking:
                    event_data["patient_id"] = booking.patient_id
                    event_data["note"] = booking.note
                    event_data["no_show"] = booking.no_show
                    event_data["out_of_window"] = booking.out_of_window
                    event_data["room_id"] = booking.room_id
            elif selected_event.event_type == 'window':
                event_data["patient_id"] = patient_id # Already extracted

            final_event_list.append(event_data)

    return jsonify({"events": final_event_list}), 200


def delete_appointment(current_user, event_id):
    """
    Handles the deletion of an appointment by event_id.
    
    Args:
        current_user (object): The user requesting the booking. Must have an email attribute for logging and auditing purposes.  
        event_id (uuid): This unique id is used to identify which event to delete from the database.
    
    Returns:
        Response (HTTP Status Code):
            - 200 Success: Creates a JSON containing `ok: True` and the `eventId` on deletion.
            - 404 Not Found: Creates a JSON object with `error: Appointment not found` if the eventId is incorrect.
            - 500 internal Server Error: JSON object with ok: False and performs a rollback on the database.
    """
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
            
        if 'out_of_window' in data:
            booking_to_update.out_of_window = data['out_of_window']

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
            "allDay": False,
            "blocked": True,
            "event_type": event.event_type
        })
    
    return jsonify({"blockedDates": blocked_dates_list}), 200