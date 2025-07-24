import React, { useState, useEffect } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments, generateCoolPrimeAppointments, generateEDIAppointment } from './data/windowEventCalc';
import ClickableDateCell from './components/clickableCell';
import { eventPropGetter } from './data/eventPropGetter';
import ToggleAppointment from './components/toggleAppointment';
import { useAppointmentFilters } from './components/useAppointmentFilters';
import './components/useAppointmentFilters.css';
import CustomToolbar from './components/customToolbar'

// Sets current date and time for calender
const localizer = momentLocalizer(moment);


const MyCalendar = () => {
  const [view, setView] = useState('month'); // View 
  const [date, setDate] = useState(new Date()); // Set date decleration
  const [isBookingCollapsed, setIsBookingCollapsed] = useState(true); // Hides booking form by default
  const [searchPatientId, setSearchPatientId] = useState(''); // Search for ID -  Window view
  const [windowEvents, setWindowEvents] = useState([]); // Sets window view
  const [currentPatient, setCurrentPatient] = useState(null); // Stores current patient in look up


  //Local storage grab
  const [userList, setUserList] = useState([]);

  useEffect(() => {
      const storedList = localStorage.getItem("userInfoList");
      if (storedList) {
      setUserList(JSON.parse(storedList));
      }
  }, []);

 const handleSearchWindow = () => {
  const patient = userList.find(patient => patient.id === searchPatientId.trim());

  if (!patient) {
    alert("Patient ID not found.");
    setCurrentPatient(null);
    setWindowEvents([]);
    return;
  }

  if (["booked"].includes(patient.type)) {
    alert("This patient's visit is already booked or scheduled.");
    setCurrentPatient(null);
    setWindowEvents([]);
    return;
  }

  // ave current patient info to display
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

  // Filter only window type (just in case)
  const windowEvents = studyWindows
    .filter(event => event.type === "window")
    .map(event => ({
      ...event,
      title: 'Window',
      Name: patient.Name,
      id: patient.id,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

  setWindowEvents(windowEvents);
};


// Clear displaying window and reset search
const handleClearWindow = () => {
  setWindowEvents([]);
  setSearchPatientId('');
  setCurrentPatient(null);
};

const deleteEvent = (eventToDelete) => {

  // Clause to protect if ID is missing 
  if (!eventToDelete.patientId) {
    console.error('Missing patientId on event', eventToDelete)
    return;
  }

  // Filter out deleted events
  const updatedEvents = bookedEvents.filter(
    (event) => event.id !== eventToDelete.id || event.start !== eventToDelete.start
  );

  // Update state + local storage
  setBookedEvents(updatedEvents);
  localStorage.setItem('bookedEvents',JSON.stringify(updatedEvents));

  // Update user back to window
  const updatedUser = userList.map((p) => {
    if (p.id === eventToDelete.patientId) {
      return {
        ...p,
        type: 'window',
        visitNum: p.visitNum -1
      };
    }
    return p;
  });
  setUserList(updatedUser);
  localStorage.setItem('userInfoList', JSON.stringify(updatedUser));
};
  
const handleEventClick = (event) => {
  const shouldDelete = window.confirm('Delete ${event.title} for ${patientId}?')
  if (shouldDelete) {
    deleteEvent(event);
  }
}

  // Booked appointments state
const [bookedEvents, setBookedEvents] = useState(() => {
  const stored = localStorage.getItem("bookedEvents");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // convert start and end back to Date objects
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


  // Add new appointment from form
  const handleAddAppointment = (appointment) => {
  const patientId = appointment.patientId;
  const match = userList.find(p => p.id === patientId);

  if (!match) {
    alert(`Patient ID ${patientId} not found in user list.`);
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
    start: new Date(appointment.start),
    end: new Date(appointment.end),
    type: 'booked',
    visitNum: match.visitNum ?? 1,
    id: patientId, 
  };

  // 1. Save to localStorage (bookedEvents)
  const existingBooked = JSON.parse(localStorage.getItem("bookedEvents")) || [];
  const updatedBooked = [...existingBooked, fullAppointment];
  localStorage.setItem("bookedEvents", JSON.stringify(updatedBooked));
  setBookedEvents(updatedBooked); // update state so calendar rerenders

  // Check if patient is already booked
  if (bookedEvents.some(e => e.patientId === patientId)) {
  alert("This patient already has a booked appointment.");
  return;
}

  // 2. Update patient type in userInfoList
  const updatedUsers = userList.map(p => {
    if (p.id === patientId) {
      return {
        ...p,
        type: 'booked',
        visitNum: p.visitNum + 1,
      };
    }
    return p;
  });
  localStorage.setItem("userInfoList", JSON.stringify(updatedUsers));
  setUserList(updatedUsers); // update in-memory state

  alert("Appointment booked successfully.");
};


const allEvents = [...bookedEvents, ...windowEvents];

// Define selectedStudies and handleStudyChange here or via your hook (see Error 4)
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

// ----------------------------------------HTML--------------------------------------
  return (
   <div>
    {/* Calendar Container */}
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
        onSelectEvent={handleEventClick}
        selectable
        views={['month', 'week', 'day', 'agenda']}
        components={{
          toolbar: CustomToolbar,
          dateCellWrapper: (props) => (
            <ClickableDateCell {...props} onSelectSlot={(slot) => {
              setDate(slot.start);
              setView('day');
            }} 
            />
          ),
        }}
        
      />
    </div>

    {/* Filter Container BELOW calendar */}
    <div className="filter-container">
      <h4>Show Event Types</h4>

    {/* Flex Container to look pretty*/}
    <div className="filter-row">

      {/* Visit Window Box*/ }
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
            {/* add any other fields you'd like */}
          </div>
        )}
      </div>

      {/* Booked Appointment Box*/ }
      <div className="filter-Main">
        <ul className="collapsable">
          <li>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => setIsBookingCollapsed(prev => !prev)}
              >
              <b>Study Filter</b>
            </div>
            {/* Study Filter Box in collapsable*/ }
            <ul style={{ display: isBookingCollapsed ? 'none' : 'block' }}>
              <li>
                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input type="checkbox" className="AHCheck"
                      checked={selectedStudies.includes('AIMHIGH')}
                      onChange={() => handleStudyChange('AIMHIGH')}
                      />
                      <label>
                        AIMHIGH
                      </label>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input
                        type="checkbox" className="CPCheck"
                        checked={selectedStudies.includes('COOLPRIME')}
                        onChange={() => handleStudyChange('COOLPRIME')}
                      />
                      COOLPRIME
                    </label>
                  </div>
                </div>

                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input
                        type="checkbox" className="EDICheck"
                        checked={selectedStudies.includes('EDI')}
                        onChange={() => handleStudyChange('EDI')}
                      />
                      EDI
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>  
      </div>
    </div>
  </div>

 
    <div className='AppointmentToggle'>
      <h1>Add Appointment</h1>
      <ToggleAppointment onAddAppointment={handleAddAppointment} />
    </div>
  </div>

);

  };

export default MyCalendar;
