import React, { useState } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments, generateCoolPrimeAppointments } from './data/windowEventCalc';
import ClickableDateCell from './components/clickableCell';
import { eventPropGetter } from './data/eventPropGetter';
import ToggleAppointment from './components/toggleAppointment';
import { useAppointmentFilters } from './components/useAppointmentFilters';
import './components/useAppointmentFilters.css';
import dummyEvents from './data/dummyEvents';

// Sets current date and time for calender
const localizer = momentLocalizer(moment);


const MyCalendar = () => {
  const [view, setView] = useState('month'); // View 
  const [date, setDate] = useState(new Date()); // Set date decleration
  const [isBookingCollapsed, setIsBookingCollapsed] = useState(true); // Hides booking form by default
  const [searchPatientId, setSearchPatientId] = useState(''); // Search for ID -  Window view
  const [windowEvents, setWindowEvents] = useState([]); // Sets window view


const handleSearchWindow = () => {
  const patient = dummyEvents.find(patient => patient.id === searchPatientId.trim());

  // Error searching 
  if (!patient) {
    alert("Patient ID not found.");
    return;
  }

  // Skip if already booked or scheduled
  if (["booked"].includes(patient.type)) {
    alert("This patient's visit is already booked or scheduled.");
    return;
  }

  // Sets patient bday and early weeks for calculations
  const birthDate = new Date(patient.dob);
  const babyWeeksEarly = patient.weeksEarly || 0;

  let studyWindows = [];

  // Only generate the window that matches the patient's study
  if (patient.study === "AIMHIGH") {
    studyWindows = generateAimHighAppointments(birthDate, babyWeeksEarly);
  } else if (patient.study === "COOLPRIME") {
    studyWindows = generateCoolPrimeAppointments(birthDate, babyWeeksEarly);
  }

  // Filter only window type (just in case)
  const windowEvents = studyWindows
    .filter(event => event.type === "window")
    .map(event => ({
      ...event,
      name: patient.name,
      id: `${patient.id}-${event.study}-${event.title}`,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

  setWindowEvents(windowEvents);
};

// Clear displaying window and reset search
  const handleClearWindow = () => {
    setWindowEvents([]);
    setSearchPatientId('');
  };
  
  // Booked appointments state
  const [bookedEvents, setBookedEvents] = useState([]);

  // Add new appointment from form
  const handleAddAppointment = (appointment) => {
    setBookedEvents(prev => [...prev, appointment]);
    //console.log(appointment)
  };

  // States all events 
const allEvents = [...windowEvents, ...bookedEvents];

const {
  selectedStudies,
  handleStudyChange,
  filteredAppointments: filteredEvents,
} = useAppointmentFilters(allEvents);


// ----------------------------------------HTML--------------------------------------
  return (
   <div>
    {/* Calendar Container */}
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={filteredEvents}
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
        components={{
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
        <label>View Patient Window:
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
            />
            <button 
            className='Search Button'
            onClick={handleSearchWindow}
            >Search Window
            </button>
            <button
            className='clearButton'
            onClick={handleClearWindow}>
              Clear Window
            </button>
        </label>
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
