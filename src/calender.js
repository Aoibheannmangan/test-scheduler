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
      setBookedEvents(updatedBooked);
      localStorage.setItem('bookedEvents', JSON.stringify(updatedBooked));
    } else if (selectedEvent.type === 'window') {
      const updatedWindows = windowEvents.map(event =>
        event.id === selectedEvent.id && event.start.getTime() === selectedEvent.start.getTime()
          ? updatedEvent
          : event
      );
      setWindowEvents(updatedWindows);
      // Optionally update localStorage if you store windowEvents persistently
    }

    closePopup();
  };

  // Close popup
  const closePopup = () => {
    setSelectedEvent(null);
    setEditedInfo("");
  };

  const handleSearchWindow = () => {
    const patient = userList.find(p => p.id === searchPatientId.trim());

    if (!patient) {
      setAlert({ message: "Patient with that ID not found", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    if (["booked"].includes(patient.type)) {
      setAlert({ message: "This patient's visit is already booked or scheduled.", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    setCurrentPatient(patient);
    const birthDate = new Date(patient.DOB);
    const babyDaysEarly = patient.DaysEarly;
    let studyWindows = [];

    if (patient.Study === "AIMHIGH") {
      studyWindows = generateAimHighAppointments(birthDate, babyDaysEarly);
    } else if (patient.Study === "COOLPRIME") {
      studyWindows = generateCoolPrimeAppointments(birthDate, babyDaysEarly);
    } else if (patient.Study === "EDI") {
      studyWindows = generateEDIAppointment(birthDate, babyDaysEarly);
    }

    const windowEvents = studyWindows
      .filter(event => event.type === "window")
      .map(event => ({
        ...event,
        title: 'Visit Window',
        Name: patient.Name,
        id: patient.id,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

    setWindowEvents(windowEvents);
  };

  const handleClearWindow = () => {
    setWindowEvents([]);
    setSearchPatientId('');
    setCurrentPatient(null);
  };

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

    setUserList(updatedUser);
    localStorage.setItem('userInfoList', JSON.stringify(updatedUser));
    setPopupOpen(false);
  };

  const handleEventClick = (event) => {
    setEventToDelete(event);
    setPopupOpen(true);
  };

  const [bookedEvents, setBookedEvents] = useState(() => {
    const stored = localStorage.getItem("bookedEvents");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      } catch (error) {
        console.error('Failed to parse bookedEvents from storage:', error);
        return [];
      }
    }
    return [];
  });

  const handleAddAppointment = (appointment) => {
    const patientId = appointment.patientId;
    const match = userList.find(p => p.id === patientId);

    if (!match) {
      setAlert({ message: `Patient ID ${patientId} not found in user list.`, type: "error" });
      return;
    }

    const fullAppointment = {
      ...appointment,
      Study: (appointment.Study || match.Study || "UNKNOWN").toUpperCase(),
      patientId,
      Name: match.Name,
      DOB: match.DOB,
      site: match.site,
      OutOfArea: match.OutOfArea,
      Info: match.Info,
      start: appointment.start.toISOString(),
      end: appointment.end.toISOString(),
      type: 'booked',
      visitNum: match.visitNum ?? 1,
      id: patientId,
    };

    const existingBooked = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    const updatedBooked = [...existingBooked, fullAppointment];
    localStorage.setItem("bookedEvents", JSON.stringify(updatedBooked));
    setBookedEvents(updatedBooked);

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
          start: appointment.start.toISOString(),
          end: appointment.end.toISOString(),
        };
      }
      return p;
    });
    localStorage.setItem("userInfoList", JSON.stringify(updatedUsers));
    setUserList(updatedUsers);
    setAlert({ message: "Appointment booked successfully.", type: "success" });
  };

  const allEvents = [...bookedEvents, ...windowEvents];

  const [selectedStudies, setSelectedStudies] = useState(['AIMHIGH', 'COOLPRIME', 'EDI']);
  const handleStudyChange = (study) => {
    setSelectedStudies(prev =>
      prev.includes(study)
        ? prev.filter(s => s !== study)
        : [...prev, study]
    );
  };

  const filteredAppointments = allEvents.filter(event =>
    selectedStudies.includes(event.Study?.toUpperCase())
  );

  return (
    <div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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

          <div className="filter-Main">
            <ul className="collapsable">
              <li>
                <div onClick={() => setIsBookingCollapsed(prev => !prev)} style={{ cursor: 'pointer' }}>
                  <b>Study Filter</b>
                </div>
                <ul style={{ display: isBookingCollapsed ? 'none' : 'block' }}>
                  {['AIMHIGH', 'COOLPRIME', 'EDI'].map(study => (
                    <li key={study}>
                      <div className="filter-checkbox">
                        <label>
                          <input
                            type="checkbox"
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

    {selectedEvent && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Edit Event for {selectedEvent.Name || selectedEvent.title}</h3>

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
                />
              </label>

              <label>
                End:
                <input
                  type="datetime-local"
                  value={moment(editedInfo.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={e => setEditedInfo(prev => ({ ...prev, end: new Date(e.target.value) }))}
                />
              </label>

              <div>
                <button onClick={saveEditedInfo}>Save</button>
                <button onClick={closePopup}>Cancel</button>
              </div>

              <div>
                <button onClick={() => handleEventClick(selectedEvent)}>Delete Appointment</button>
              </div>
            </div>
          </div>
        )}

      <div className='AppointmentToggle'>
        <h1>Add Appointment</h1>
        <ToggleAppointment onAddAppointment={handleAddAppointment} />
      </div>

      
                    {/*() => setPopupOpen(false)*/}
      <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={confirmDeleteEvent}
        message={`Delete ${eventToDelete?.title || 'this event'} for ${eventToDelete?.patientId || 'Unknown ID'}?`}
        option1="Confirm"
        option2="Cancel"
      />


    </div>
  );
};

export default MyCalendar;
