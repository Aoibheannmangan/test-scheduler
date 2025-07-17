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

  const birthDate = new Date();
  const babyWeeksEarly = 0;

  const visitWindowEvents = generateAimHighAppointments(birthDate, babyWeeksEarly);
  const bookedEvents = getBookedAppointments();

  const allEvents = [...visitWindowEvents, ...bookedEvents]; // When trying to book within window, shows people's bookings so if available

  // filtering event function
  function filterEventsByType(events, selectedTypes) {
    return events.filter(event => selectedTypes.includes(event.type));
  }

  // filtering events 
  const filteredEvents = filterEventsByType(allEvents, selectedTypes);

  // UI for selecting event types
  function handleTypeChange(type) {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
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

    <div className='AppointmentToggle'>
      <h1>Add Appointment</h1>
      <ToggleContainer />
    </div>

    {/* Filter Container BELOW calendar */}
    <div className="filter-container">
      <h4>Show Event Types</h4>
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
      <div className="filter-checkbox">
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes('booked')}
            onChange={() => handleTypeChange('booked')}
          />
          Booked Appointments
        </label>
      </div>
    </div>
  </div>

);

  };

export default MyCalendar;
