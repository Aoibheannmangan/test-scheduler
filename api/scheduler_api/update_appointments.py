
from .extensions import db
from .models import Event, Booking
from datetime import datetime
from flask import current_app

import requests
from .extensions import db
from .models import Event, Booking
from datetime import datetime, timedelta
from flask import current_app
from config import REDCAP_API_URL, API_TOKEN # Import REDCap config

# Helper function to parse date range strings from REDCap
def parse_redcap_date_range(date_range_str):
    if not date_range_str:
        return None, None
    try:
        # Assuming format "YYYY-MM-DD to YYYY-MM-DD" or "YYYY-MM-DD"
        if " to " in date_range_str:
            start_str, end_str = date_range_str.split(" to ")
            start_date = datetime.strptime(start_str.strip(), "%Y-%m-%d")
            end_date = datetime.strptime(end_str.strip(), "%Y-%m-%d")
        else:
            start_date = datetime.strptime(date_range_str.strip(), "%Y-%m-%d")
            end_date = start_date # If only one date, assume it's a single-day window
        return start_date, end_date
    except ValueError:
        current_app.logger.error(f"Could not parse REDCap date range: {date_range_str}")
        return None, None

def update_past_appointments():
    """
    Checks for past booked appointments (not no-show),
    and creates a new 'window' event for the next visit based on REDCap data.
    """
    with current_app.app_context():
        try:
            now = datetime.utcnow()
            # Find past booked events that were not no-shows
            past_booked_events = Event.query.join(Booking).filter(
                Event.event_type == 'booked',
                Event.end_date < now,
                Booking.no_show == False
            ).all()

            for event in past_booked_events:
                booking = Booking.query.filter_by(event_id=event.event_id).first()
                if not booking:
                    current_app.logger.warning(f'Booking not found for event {event.event_id}. Skipping.')
                    continue

                patient_id = booking.patient_id
                completed_visit_num = event.visit_num

                # 1. Fetch REDCap data for the patient
                redcap_payload = {
                    'token': API_TOKEN,
                    'content': 'record',
                    'format': 'json',
                    'type': 'flat',
                    'records[0]': patient_id,
                    'fields[0]': 'record_id',
                    'fields[1]': 'v2_attend',
                    'fields[2]': 'v3_attend',
                    'fields[3]': 'v4_attend',
                    'fields[4]': 'v5_attend',
                    'fields[5]': 'v6_attend',
                    'fields[6]': 'v2_next_visit_range',
                    'fields[7]': 'v3_next_visit_between',
                    'fields[8]': 'v4_next_visit_range',
                    'fields[9]': 'v5_next_visit_range',
                }
                redcap_response = requests.post(REDCAP_API_URL, data=redcap_payload)
                redcap_data = redcap_response.json()

                if not redcap_data or len(redcap_data) == 0:
                    current_app.logger.warning(f"No REDCap data found for patient {patient_id}. Cannot create next window event.")
                    # Mark original event as completed and delete booking, but no new window
                    event.event_type = 'completed'
                    db.session.add(event)
                    db.session.delete(booking)
                    continue

                patient_redcap_record = redcap_data[0]

                # 2. Determine next_visit_num based on vX_attend
                next_visit_num = 2 # Start checking from V2
                for i in range(2, 7): # Check v2_attend to v6_attend
                    if patient_redcap_record.get('v6_attend') == '1':
                        break # as patient is complete
                    
                    elif patient_redcap_record.get(f'v{i}_attend') == '1':
                        next_visit_num = i + 1
                    
                    else:
                        break # Found the first unattended visit, so this is the next window

                # If next_visit_num goes beyond V5, patient might be complete or no more windows
                if next_visit_num > 5: # Assuming V5 is the last visit with a defined range
                    current_app.logger.info(f"Patient {patient_id} has no more defined visit windows (next_visit_num: {next_visit_num}). Marking event as completed and deleting booking.")
                    event.event_type = 'completed'
                    db.session.add(event)
                    db.session.delete(booking)
                    continue

                # 3. Extract and Parse start_date/end_date for the new window
                visit_range_field = None
                if next_visit_num == 2:
                    visit_range_field = 'v2_next_visit_range'
                elif next_visit_num == 3:
                    visit_range_field = 'v3_next_visit_between'
                elif next_visit_num == 4:
                    visit_range_field = 'v4_next_visit_range'
                elif next_visit_num == 5:
                    visit_range_field = 'v5_next_visit_range'
                
                redcap_date_range_str = patient_redcap_record.get(visit_range_field)
                new_window_start, new_window_end = parse_redcap_date_range(redcap_date_range_str)

                if not new_window_start or not new_window_end:
                    current_app.logger.warning(f"Could not determine valid window dates for patient {patient_id}, visit {next_visit_num}. Marking event as completed and deleting booking.")
                    event.event_type = 'completed'
                    db.session.add(event)
                    db.session.delete(booking)
                    continue

                # 4. Mark the original booked event as 'completed'
                event.event_type = 'completed'
                db.session.add(event) # Re-add to session to mark as modified
                current_app.logger.info(f'Marked event {event.event_id} for patient {patient_id} as completed (Visit {completed_visit_num}).')

                # 5. Create a new 'window' event for the next visit
                new_window_event = Event(
                    event_title=f"ID: {patient_id}",
                    start_date=new_window_start,
                    end_date=new_window_end,
                    event_type='window',
                    visit_num=next_visit_num
                )
                db.session.add(new_window_event)
                current_app.logger.info(f'Created new window event for patient {patient_id} (Visit {next_visit_num}).')

                # Delete the booking record associated with the now completed event
                db.session.delete(booking)
                current_app.logger.info(f'Deleted booking record for event {event.event_id}.')

            db.session.commit()
            current_app.logger.info('Successfully processed past appointments.')
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Error processing past appointments: {e}')
