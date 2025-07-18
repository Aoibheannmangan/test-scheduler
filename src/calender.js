import React, { useState } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments } from './data/windowEventCalc';
import { getBookedAppointments } from './data/bookedAppointments';
import ClickableDateCell from './components/clickableCell';
import { eventPropGetter } from './data/eventPropGetter';
import ToggleContainer from './components/toggleAppointment';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [view, setView] = useState('month'); // View 
  const [date, setDate] = useState(new Date()); // Set date decleration
  const [selectedTypes, setSelectedTypes] = useState(['window', 'booked']) // Types to filter
  const [selectedStudies, setSelectedStudy] = useState(['AIMHIGH' , 'COOLPRIME']) // Studies to filter
  const [generalView, setGeneralView] = useState(false); // General filter
  const [isBookingCollapsed, setIsBookingCollapsed] = useState(true);

  const birthDate = new Date();
  const babyWeeksEarly = 0;

  const visitWindowEvents = generateAimHighAppointments(birthDate, babyWeeksEarly);
  const bookedEvents = getBookedAppointments();

  const allEvents = [...visitWindowEvents, ...bookedEvents]; // When trying to book within window, shows people's bookings so if available

  // Combine filters for both type and study for calender functionality
  const filteredEvents = allEvents.filter(event => {
  // If user selectes general view for bookings
    if (generalView) {
    return selectedTypes.includes(event.type); // Show all studies if general is checked
  }
  // If not then return whatever selected studies
  return selectedTypes.includes(event.type) && selectedStudies.includes(event.study);
});
  

  // UI for selecting event types
  function handleTypeChange(type) {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }

  // UI for selecting event study
  function handleStudyChange(study) {
    setSelectedStudy(prev =>
      prev.includes(study)
        ? prev.filter(t => t !== study)
        : [...prev, study]
    );
  }

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
        style={{ height: 600 }}
      />
    </div>

    {/* Filter Container BELOW calendar */}
    <div className="filter-container">
      <h4>Show Event Types</h4>
      {/* Visit Window Box*/ }
      <div className="filter-checkbox">
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes('window')}
            onChange={() => handleTypeChange('window')}
          />
          Visit Window
        </label>
      </div>
      {/* Booked Appointment Box*/ }
      <div className="filter-checkbox">
        <ul className="collapsable">
          <li>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => setIsBookingCollapsed(prev => !prev)}
              >
              <b>Booked Appointments</b>
            </div>
            {/* Study Filter Box in collapsable*/ }
            <ul style={{ display: isBookingCollapsed ? 'none' : 'block' }}>
              <li>
                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={generalView}
                        onChange={() => setGeneralView(prev => !prev)}
                      />
                      All Booked Studies
                    </label>
                  </div>
                </div>
                
                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStudies.includes('AIMHIGH')}
                        onChange={() => handleStudyChange('AIMHIGH')}
                      />
                      AIMHIGH
                    </label>
                  </div>
                </div>

                <div>
                  <div className="filter-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStudies.includes('COOLPRIME')}
                        onChange={() => handleStudyChange('COOLPRIME')}
                      />
                      COOLPRIME
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>  
      </div>
    </div>

    <div className='AppointmentToggle'>
      <h1>Add Appointment</h1>
      <ToggleContainer />
    </div>

  </div>

);

  };

export default MyCalendar;
