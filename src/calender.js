import React, { useState } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments } from './data/windowEventCalc';
import { getBookedAppointments } from './data/bookedAppointments';
import ClickableDateCell from './components/clickableCell';
import { eventPropGetter } from './data/eventPropGetter';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const birthDate = new Date();
  const babyWeeksEarly = 0;

  const visitWindowEvents = generateAimHighAppointments(birthDate, babyWeeksEarly);
  const bookedEvents = getBookedAppointments();

  const allEvents = [...visitWindowEvents, ...bookedEvents]; // When trying to book within window, shows people's bookings so if available

  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={allEvents}
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
  );
  };

export default MyCalendar;
