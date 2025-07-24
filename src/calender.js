import React, { useState, useEffect } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments, generateCoolPrimeAppointments, generateEDIAppointment } from './data/windowEventCalc';
import ClickableDateCell from './components/clickableCell';
import { eventPropGetter } from './data/eventPropGetter';
import ToggleAppointment from './components/toggleAppointment';
import './components/useAppointmentFilters.css';
import CustomToolbar from './components/customToolbar';
import Alert from './components/Alert';
import PopUp from './components/PopUp';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [isBookingCollapsed, setIsBookingCollapsed] = useState(true);
  const [searchPatientId, setSearchPatientId] = useState('');
  const [windowEvents, setWindowEvents] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [alert, setAlert] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedInfo, setEditedInfo] = useState("");

  // Map used for styling later
  const studyClassMap = {
  AIMHIGH: 'AHCheck',
  COOLPRIME: 'CPCheck',
  EDI: 'EDICheck',
  };

  // Grab from local storage and in storedList
  useEffect(() => {
    const storedList = localStorage.getItem("userInfoList");
    if (storedList) {
      setUserList(JSON.parse(storedList));
    }
  }, []);

  // Open popup when clicking an event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    // Copy all editable properties into editedInfo state
    setEditedInfo({
      title: event.title || '',
      start: event.start,
      end: event.end,
    });
  };

  // Save when editing event info
  const saveEditedInfo = () => {
    if (!selectedEvent) return;

    // Prepare updated event object
    const updatedEvent = {
      ...selectedEvent,
      title: editedInfo.title,
      start: new Date(editedInfo.start),
      end: new Date(editedInfo.end),
    };

    // Update bookedEvents or windowEvents depending on type
    if (selectedEvent.type === 'booked') {
      const updatedBooked = bookedEvents.map(event =>
        event.id === selectedEvent.id && event.start.getTime() === selectedEvent.start.getTime()
          ? updatedEvent
          : event
      );
      // Set booked events when updated
      setBookedEvents(updatedBooked);
      // Store in local storage
      localStorage.setItem('bookedEvents', JSON.stringify(updatedBooked));
    } else if (selectedEvent.type === 'window') {
      const updatedWindows = windowEvents.map(event =>
        event.id === selectedEvent.id && event.start.getTime() === selectedEvent.start.getTime()
          ? updatedEvent
          : event
      );
      setWindowEvents(updatedWindows);
    }

    closePopup();
  };

  // Close popup
  const closePopup = () => {
    setSelectedEvent(null);
    setEditedInfo("");
  };

  // Search patient by ID
  const handleSearchWindow = () => {
    const patient = userList.find(p => p.id === searchPatientId.trim());

    // If can't find Id
    if (!patient) {
      setAlert({ message: "Patient with that ID not found", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    // If window searching for booked patient this displays
    if (["booked"].includes(patient.type)) {
      setAlert({ message: "This patient's visit is already booked or scheduled.", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    // Set current patient that was searched
    setCurrentPatient(patient);
    const birthDate = new Date(patient.DOB);
    const babyDaysEarly = patient.DaysEarly;
    let studyWindows = [];

    // Calc window based on study
    if (patient.Study === "AIMHIGH") {
      studyWindows = generateAimHighAppointments(birthDate, babyDaysEarly);
    } else if (patient.Study === "COOLPRIME") {
      studyWindows = generateCoolPrimeAppointments(birthDate, babyDaysEarly);
    } else if (patient.Study === "EDI") {
      studyWindows = generateEDIAppointment(birthDate, babyDaysEarly);
    }

    // Filter by window
    const windowEvents = studyWindows
      .filter(event => event.type === "window")
      // mane visit window and initialise start and end dates
      .map(event => ({
        ...event,
        title: 'Visit Window',
        Name: patient.Name,
        id: patient.id,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    // Set window dates
    setWindowEvents(windowEvents);
  };

  // Clear search and window on calender
  const handleClearWindow = () => {
    setWindowEvents([]);
    setSearchPatientId('');
    setCurrentPatient(null);
  };

  // Confirm delete on pop up, append to local storage
  const confirmDeleteEvent = () => {
    if (!eventToDelete?.patientId) {
      console.error("Missing patientId on event", eventToDelete);
      return;
    }

    const updatedEvents = bookedEvents.filter(
      (event) => event.id !== eventToDelete.id || event.start !== eventToDelete.start
    );

    setBookedEvents(updatedEvents);
    localStorage.setItem('bookedEvents', JSON.stringify(updatedEvents));

    // If booking deleted reset visit and type as its now a window again
    const updatedUser = userList.map((p) => {
      if (p.id === eventToDelete.patientId) {
        return {
          ...p,
          type: 'window',
          visitNum: p.visitNum - 1
        };
      }
      return p;
    });

    // Set and store after booking delete
    setUserList(updatedUser);
    localStorage.setItem('userInfoList', JSON.stringify(updatedUser));
    setPopupOpen(false);
  };

  // Store event clicked on and open pop up for delete
  const handleEventClick = (event) => {
    setEventToDelete(event);
    setPopupOpen(true);
  };

  // Create array to store booked appointments
  const [bookedEvents, setBookedEvents] = useState(() => {
    // Place in local storage + make date object to store
    const stored = localStorage.getItem("bookedEvents");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      }// Return error message
       catch (error) {
        console.error('Failed to parse bookedEvents from storage:', error);
        return [];
      }
    }
    return [];
  });

  // Function to add appointment
  const handleAddAppointment = (appointment) => {
    const patientId = appointment.patientId;
    // Find patient Id
    const match = userList.find(p => p.id === patientId);

    // If cant find patient id
    if (!match) {
      setAlert({ message: `Patient ID ${patientId} not found in user list.`, type: "error" });
      return;
    }

    // Add new appointment object structure
    const fullAppointment = {
      ...appointment,
      Study: (appointment.Study || match.Study || "UNKNOWN").toUpperCase(),
      patientId,
      Name: match.Name,
      DOB: match.DOB,
      site: match.site,
      OutOfArea: match.OutOfArea,
      Info: match.Info,
      start: appointment.start.toISOString(), // Make an ISO object for correct parsing
      end: appointment.end.toISOString(), // Make an ISO object for correct parsing
      type: 'booked', // As no longer window
      visitNum: match.visitNum ?? 1, 
      id: patientId,
    };

    const existingBooked = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    const updatedBooked = [...existingBooked, fullAppointment];
    localStorage.setItem("bookedEvents", JSON.stringify(updatedBooked));
    setBookedEvents(updatedBooked);

    // If trying to book another appointment for patient
    if (bookedEvents.some(e => e.patientId === patientId)) {
      setAlert({ message: "This patient already has a booked appointment.", type: "error" });
      return;
    }

    const updatedUsers = userList.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          type: 'booked',
          visitNum: p.visitNum + 1,
          start: appointment.start.toISOString(), // Make an ISO object for correct parsing
          end: appointment.end.toISOString(), // Make an ISO object for correct parsing
        };
      }
      return p;
    });

    // Set updated list to local storage
    localStorage.setItem("userInfoList", JSON.stringify(updatedUsers));
    setUserList(updatedUsers);
    // Tell user appointment is booked
    setAlert({ message: "Appointment booked successfully.", type: "success" });
  };

  // Array of all avents
  const allEvents = [...bookedEvents, ...windowEvents];

  // Selected studies available
  const [selectedStudies, setSelectedStudies] = useState(['AIMHIGH', 'COOLPRIME', 'EDI']);
  const handleStudyChange = (study) => {
    setSelectedStudies(prev =>
      prev.includes(study)
        ? prev.filter(s => s !== study)
        : [...prev, study]
    );
  };

  // Filter for search/ filtering function
  const filteredAppointments = allEvents.filter(event =>
    selectedStudies.includes(event.Study?.toUpperCase())
  );

//-------------------------------------------HTML------------------------------------------------------------------
  return (
    <div> 
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/**CALENDER*/}
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={filteredAppointments}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectSlot={(slotInfo) => {
            setDate(slotInfo.start);
            setView('day');
          }}
          onSelectEvent={handleSelectEvent}
          selectable
          views={['month', 'week', 'day', 'agenda']}
          components={{
            toolbar: CustomToolbar,
            dateCellWrapper: (props) => (
              <ClickableDateCell {...props} onSelectSlot={(slot) => {
                setDate(slot.start);
                setView('day');
              }} />
            ),
          }}
        />
      </div>

      {/**FILTER BOX + WINDOW SEARCH*/}
      <div className="filter-container">
        <h4>Show Event Types</h4>
        <div className="filter-row">
          <div className="windowView">
            <label>
              View Patient Window:
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={searchPatientId}
                onChange={(e) => setSearchPatientId(e.target.value)}
              />
              <div className="button-row">
                <button className="search-button" onClick={handleSearchWindow}>Search Window</button>
                <button className="clear-button" onClick={handleClearWindow}>Clear Window</button>
              </div>
            </label>
            {/**DISPLAYS PATIENT WHEN SEARCHED IN WINDOW*/}
            {currentPatient && (
              <div className="patientInfo">
                <h4>Patient Info</h4>
                <p><b>Name:</b> {currentPatient.Name}</p>
                <p><b>ID:</b> {currentPatient.id}</p>
                <p><b>DOB:</b> {new Date(currentPatient.DOB).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
            )}
          </div>
          {/**COLLAPSABLE FILTER BOX*/}
          <div className="filter-Main">
            <ul className="collapsable">
              <li>
                <div onClick={() => setIsBookingCollapsed(prev => !prev)} style={{ cursor: 'pointer' }}>
                  <b>Study Filter</b>
                </div>
                {/**DISPLAYS FILTERS USING LOOP*/}
                <ul style={{ display: isBookingCollapsed ? 'none' : 'block' }}>
                  {['AIMHIGH', 'COOLPRIME', 'EDI'].map(study => (
                    <li key={study}>
                      <div className="filter-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            className={studyClassMap[study] || ''}
                            checked={selectedStudies.includes(study)}
                            onChange={() => handleStudyChange(study)}
                          />
                          {study}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/**EDIT POPUP*/}
      {selectedEvent && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h3>Edit Event for {selectedEvent.Name || selectedEvent.title}</h3>
              </div>
              <label>
                Title:
                <input
                  type="text"
                  value={editedInfo.title}
                  onChange={e => setEditedInfo(prev => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                Start:
                <input
                  type="datetime-local"
                  value={moment(editedInfo.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={e => setEditedInfo(prev => ({ ...prev, start: new Date(e.target.value) }))}
                  className="date-edit"
                />
              </label>

              <label>
                End:
                <input
                  type="datetime-local"
                  value={moment(editedInfo.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={e => setEditedInfo(prev => ({ ...prev, end: new Date(e.target.value) }))}
                  className="date-edit"
                />
              </label>

              <div className="button-row">
                <button onClick={saveEditedInfo} className="confirm-button">Save</button>
                <button onClick={closePopup} className="cancel-button">Cancel</button>
                <button onClick={() => handleEventClick(selectedEvent)} className="delete-button">Delete Appointment</button>
              </div>

            </div>
          </div>
        )}

      
      {/**DELETE POPUP*/}
      <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={confirmDeleteEvent}
        message={`Delete ${eventToDelete?.title || 'this event'} for ${eventToDelete?.patientId || 'Unknown ID'}?`}
        option1="Confirm"
        option2="Cancel"
      />

      {/**APPOINTMENT BOOKING FORM*/}
      <div className='AppointmentToggle'>
        <h1>Add Appointment</h1>
        <ToggleAppointment onAddAppointment={handleAddAppointment} />
      </div>

    </div>
  );
};

export default MyCalendar;
