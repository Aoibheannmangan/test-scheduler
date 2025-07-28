import React, { useState, useEffect, useRef} from 'react';
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
import RebookingForm from './components/RebookingForm';

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
  const [editedInfo, setEditedInfo] = useState(null);
  const [showRebookingForm, setShowRebookingForm] = useState(false);

  const isFirstRender = useRef(true);

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
      room: event.room || '',
      noShow: event.noShow || false,
      noShowComment: event.noShowComment || '',
    });
  };

  const handleNoShowChange = (e) => {
    const newNoShowStatus = e.target.checked;
    setEditedInfo((prev) => ({
      ...prev,
      noShow: newNoShowStatus,
    }));

    if (newNoShowStatus) {
      setShowRebookingForm(true);
    } else {
      setShowRebookingForm(false);
    }
  };

  const handleUpdateEvent = (updatedEvent) => { 
    const updatedBooked = bookedEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event ); 
    setBookedEvents(updatedBooked); 
    localStorage.setItem('bookedEvents', JSON.stringify(updatedBooked));
  };

  useEffect(() => {
    if (!editedInfo || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (editedInfo.show) {
      openBookingFormWithPrefill(selectedEvent);
    }
  }, [editedInfo?.noShow]);

  const openBookingFormWithPrefill = (event) => {
    setSelectedEvent(event);
    setShowRebookingForm(true);
  };

  // Save when editing event info
  const saveEditedInfo = () => {
    if (!selectedEvent || !editedInfo) return;

    // Prepare updated event object
    const updatedEvent = {
      ...selectedEvent,
      title: editedInfo.title,
      start: new Date(editedInfo.start),
      end: new Date(editedInfo.end),
      noShow: editedInfo.noShow || false, 
      noShowComment: editedInfo.noShowComment || "", 
    };


    // Update bookedEvents or windowEvents depending on type
    if (selectedEvent.type === 'booked') {
      const updatedBooked = bookedEvents.map(event =>
        event.id === selectedEvent.id && new Date(event.start).getTime() === new Date(selectedEvent.start).getTime()
          ? updatedEvent
          : event
      );
      // Set booked events when updated
      setBookedEvents(updatedBooked);
      // Store in local storage
      localStorage.setItem('bookedEvents', JSON.stringify(updatedBooked));
    } else if (selectedEvent.type === 'window') {
      const updatedWindows = windowEvents.map(event =>
        event.id === selectedEvent.id && new Date(event.start).getTime() === new Date(selectedEvent.start).getTime()
          ? updatedEvent
          : event
      );
      setWindowEvents(updatedWindows);
    }

    if (editedInfo.noShow) {
      const confirmRebook = window.confirm("This event was marked as a no-show. Would you like to create a new booking?");
      if (confirmRebook) {
        openBookingFormWithPrefill(updatedEvent);
      }
    }

    setEditedInfo((prev) => ({
      ...prev,
      noShow: false,
    }));
    setShowRebookingForm(false);
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
      // make visit window and initialise start and end dates
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
      title: `Study: ${match.Study}| ID: ${patientId}` ,
      Study: (appointment.Study || match.Study || "UNKNOWN").toUpperCase(),
      patientId,
      Name: match.Name,
      DOB: match.DOB,
      site: match.site,
      OutOfArea: match.OutOfArea,
      Info: match.Info,
      start: appointment.start, // Make an ISO object for correct parsing
      end: appointment.end,// Make an ISO object for correct parsing
      type: 'booked', // As no longer window
      visitNum: match.visitNum ?? 1, 
      id: patientId,
      room: appointment.room,
      notes: appointment.notes
    };

    console.log(fullAppointment);

  // Update bookedEvents state including the new appointment
  const existingBooked = bookedEvents;
  const updatedBooked = [...existingBooked, fullAppointment];
  setBookedEvents(updatedBooked);

  // Save to localStorage with conversion to string for dates
  const updatedBookedForStorage = updatedBooked.map(evt => ({
    ...evt,
    start: evt.start.toISOString(),
    end: evt.end.toISOString(),
  }));
  localStorage.setItem("bookedEvents", JSON.stringify(updatedBookedForStorage));


    // If trying to book another appointment for patient
    if (bookedEvents.some(e => e.patientId === patientId)) {
      setAlert({ message: "This patient already has a booked appointment.", type: "error" });
      return;
    }

    const updatedUsers = userList.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          title: `Study: ${match.study}| ID: ${patientId}` ,
          type: 'booked',
          visitNum: p.visitNum + 1,
          start: appointment.start.toISOString(), // Make an ISO object for correct parsing
          end: appointment.end.toISOString(), // Make an ISO object for correct parsing
          notes: appointment.notes,
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

  // Selected rooms available
  const roomList = [
  { id: "TeleRoom", label: "Telemetry Room (Room 2.10)" },
  { id: "room1", label: "Assessment Room 1" },
  { id: "room2", label: "Assessment Room 2" },
  { id: "room3", label: "Assessment Room 3" },
  { id: "room4", label: "Assessment Room 4" },
  { id: "devRoom", label: "Developmental Assessment Room (Room 2.07)" },
];


  // Replace study filter state with rooms filter
  const [selectedRooms, setSelectedRooms] = useState(roomList.map(room => room.id));

  // Handler for room checkbox change
  const handleRoomChange = (roomId) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(r => r !== roomId)
        : [...prev, roomId]
    );
  };

  const filteredAppointments = allEvents.filter(event => {
    if (event.type === 'window') return true; // Always show windows
    return selectedRooms.includes(event.room); // Filter booked by room
  });


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
            event: ({ event }) => (
              <div>
                {event.title}
                <div style={{ fontSize: 10 }}><strong>{event.notes}</strong></div> {/* Show description here */}
              </div>
            ),
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
                  <b>Room Filter</b>
                </div>
                {/**DISPLAYS FILTERS USING LOOP*/}
                <ul style={{ display: isBookingCollapsed ? 'none' : 'block' }}>
                  {roomList.map(room => (
                    <li key={room.id}>
                      <div className="filter-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedRooms.includes(room.id)}
                            onChange={() => handleRoomChange(room.id)}
                          />
                          {room.label}
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

                <label>
                  Room:
                  <select
                    id="room"
                    name="room"
                    value={editedInfo.room}
                    onChange={(e) => setEditedInfo(prev => ({ ...prev, room:e.target.value}))}
                  >
                    <option value="">-- Select Room --</option>
                    <option value="TeleRoom">Telemetry Room (Room 2.10)</option>
                    <option value="room1">Assessment Room 1</option>
                    <option value="room2">Assessment Room 2</option>
                    <option value="room3">Assessment Room 3</option>
                    <option value="room4">Assessment Room 4</option>
                    <option value="devRoom">Developmental Assessment Room (Room 2.07)</option>
                  </select>
              </label>

               

              <label className="checkbox-container"> 
                <input  
                  type="checkbox" 
                  checked={editedInfo.noShow} 
                  onChange={handleNoShowChange} 
                />             
                <span className="noshow-check"></span> 
                Mark as No-Show / Cancelled 
              </label> 

              {showRebookingForm && selectedEvent && (
                <RebookingForm 
                  event={selectedEvent}
                  onSave={(updatedEvent) => {
                    handleUpdateEvent(updatedEvent);
                    setShowRebookingForm(false);
                  }}
                  onCancel={() => setShowRebookingForm(false)}
                />
              )}

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