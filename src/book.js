import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './book.css';
import 'react-calendar/dist/Calendar.css';

const BookAppointment = () => {

    const [value, onChange] = useState(new Date());

    return (
        <div className="booking">
            <h1>Book an Appointment</h1>
            <div className="Calendar">
                <Calendar
                onChange = {onChange}
                value = {value}
            />
            </div>
        </div>
    );
};

export default BookAppointment;