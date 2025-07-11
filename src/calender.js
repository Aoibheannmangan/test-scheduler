import React, { useState } from 'react';
import './calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateAimHighAppointments } from './events';

const localizer = momentLocalizer(moment);

  const MyCalendar = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const birthDate = new Date();
  const babyWeeksEarly = 0;

  const events = generateAimHighAppointments(birthDate, babyWeeksEarly);

  console.log("Generated events:", events);

    return (
    <div className="calendar-wrapper">
    <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    view={view}
    onView={setView}
    date={date}
      onNavigate={setDate}
    style={{ height: 600 }}
    />
    </div>
  );
};

export default MyCalendar;
