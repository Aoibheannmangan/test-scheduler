import React from 'react';
import Navbar from './Navbar';
import Events from './events';
import './calender.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ events }) => (
<div className="calendar-wrapper">
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    style={{ height: 800 }}
  />
</div>

);

const events = [
  {
    title: 'Patient1 Appointment',
    start: new Date(2025, 7, 11, 10, 0),
    end: new Date(2025, 7, 11, 11, 0),
  },
  {
    title: 'Patient2 Appointment',
    start: new Date(2025, 7, 12, 12, 30),
    end: new Date(2025, 7, 12, 13, 30),
  },
];

export default MyCalendar
