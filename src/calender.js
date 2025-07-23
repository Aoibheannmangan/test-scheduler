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

  setCurrentPatient(patient); // <-- save patient info to display

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
      id: `${patient.id}-${event.Study}-${event.Info}`,
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

  
  // Booked appointments state
  const [bookedEvents, setBookedEvents] = useState(() => {
    const stored = localStorage.getItem("bookedEvents");
    return stored ? JSON.parse(stored) : [];
  });


  // Add new appointment from form
const handleAddAppointment = (appointment) => {
  // Add the new appointment to bookedEvents
  const updatedEvents = [...bookedEvents, appointment];
  setBookedEvents(updatedEvents);
  localStorage.setItem("bookedEvents", JSON.stringify(updatedEvents));

  // Update the patient's type from "window" to "booked"
  // Find patient by id (assuming appointment.patientId or appointment.id matches patient.id)
  setUserList(prevUsers => {
    const updatedUsers = prevUsers.map(patient => {
      if (patient.id === appointment.patientId) { // or appointment.id depending on your appointment object
        return {
          ...patient,
          type: 'booked'
        };
      }
      return patient;
    });

    // Save updated patients to localStorage
    localStorage.setItem("userInfoList", JSON.stringify(updatedUsers));

    return updatedUsers;
  });
};

  // States all events 
const allEvents = [...windowEvents, ...bookedEvents];

const {
  selectedStudies,
  handleStudyChange,
  filteredAppointments,
} = useAppointmentFilters(allEvents);


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
          <button className="Search Button" onClick={handleSearchWindow}>Search Window</button>
          <button className="clearButton" onClick={handleClearWindow}>Clear Window</button>
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
