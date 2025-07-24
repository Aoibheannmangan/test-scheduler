import React, { useState } from 'react';
import './toggleAppointment.css';

// Toggle is not visible by default
const ToggleAppointment = ({ onAddAppointment }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // States vars for appointment booking
  const [appTitle, setAppTitle] = useState('');
  const [appPatID, setAppPatID] = useState('')
  const [appDate, setAppDate] = useState('');
  const [appTimeStart, setAppTimeStart] = useState('');
  const [appTimeEnd, setAppTimeEnd] = useState('');
  const [patientStudy, setPatientStudy] = useState('');

  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();


    const start = new Date(`${appDate}T${appTimeStart}`);
    const end = new Date(`${appDate}T${appTimeEnd}`);

    const newAppointment = {
      title: appTitle,
      patientId: appPatID,
      start,
      end,
      type: 'booked',
      Study: patientStudy.toUpperCase() || '',
    };

    onAddAppointment(newAppointment);
    setAppTitle('');
    setAppPatID('');
    setAppDate('');
    setAppTimeStart('');
    setAppTimeEnd('');
    setPatientStudy('');
    setIsVisible(false);
  };

  return (
    <div>
      <button // Visibility button
      className='hideButton'
      onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Appointment Booking
      </button>

      {isVisible && ( // Shows the form when visible
        <div className='AppointmentToggle'>
          <fieldset>
            <div className="form-border">
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title of Appointment</label>
                <input // Input for title
                  type="text"
                  id="title"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="Enter Title of Appointment"
                  required
                />

                <label htmlFor="patientID">Patient ID</label>
                <input // input for ID
                  type="text"
                  id="patID"
                  value={appPatID}
                  onChange={(e) => setAppPatID(e.target.value)}
                  placeholder="Enter Patient ID"
                  required
                />

                <label htmlFor="date">Appointment Date</label>
                <input // date input for app
                  type="date"
                  id="date"
                  value={appDate}
                  onChange={(e) => setAppDate(e.target.value)}
                  required
                />

                <label htmlFor="startTime">Start Time</label>
                <input // Start time for app. Increments in 15 mins
                  type="time"
                  id="startTime"
                  min="09:00" max="18:00"
                  step={900}
                  value={appTimeStart}
                  onChange={(e) => setAppTimeStart(e.target.value)}
                  required
                />

                <label htmlFor="endTime">End Time</label>
                <input // End time for app. Increments in 15 mins
                  type="time"
                  id="endTime"
                  min="09:00" max="18:00"
                  step={900}
                  value={appTimeEnd}
                  onChange={(e) => setAppTimeEnd(e.target.value)}
                  required
                />
                <br />

                <button // Submit button 
                type="submit">
                  Submit
                  </button>
              </form>
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default ToggleAppointment;
