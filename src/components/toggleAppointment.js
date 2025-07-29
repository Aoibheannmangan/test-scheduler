import React, { useState } from 'react';
import './toggleAppointment.css';

// Toggle is not visible by default
const ToggleAppointment = ({ onAddAppointment }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // States vars for appointment booking
  const [appPatID, setAppPatID] = useState('')
  const [appDate, setAppDate] = useState('');
  const [appTimeStart, setAppTimeStart] = useState('');
  const [appTimeEnd, setAppTimeEnd] = useState('');
  const [patientStudy, setPatientStudy] = useState('');
  const [appRoom, setAppRoom] = useState('');
  const [appNote, setAppNote] = useState('');

  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();


    const start = new Date(`${appDate}T${appTimeStart}`);
    const end = new Date(`${appDate}T${appTimeEnd}`);
    const appTitle = `${patientStudy.toUpperCase()} | ID: ${appPatID}`

    const newAppointment = {
      title: appTitle,
      patientId: appPatID,
      start,
      end,
      type: 'booked',
      Study: [patientStudy.toUpperCase()] || '',
      room: appRoom,
      notes: appNote,
    };

    onAddAppointment(newAppointment);
    setAppPatID('');
    setAppDate('');
    setAppTimeStart('');
    setAppTimeEnd('');
    setPatientStudy('');
    setIsVisible(false);
    setAppRoom('');
    setAppNote('');
  };

  return (
    <div>
      <button // Visibility button
      className='hide-button'
      onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Appointment Booking
      </button>

      {isVisible && ( // Shows the form when visible
        <div className='AppointmentToggle'>
          <fieldset>
            <div className="form-border">
              <form onSubmit={handleSubmit}>

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

                <label htmlFor="room">Assessment Room:</label>
                <select
                  id="room"
                  name="room"
                  value={appRoom}
                  onChange={(e) => setAppRoom(e.target.value)}
                >
                  <option value=""disabled selected>-- Select Room --</option>
                  <option value="TeleRoom">Telemetry Room (Room 2.10)</option>
                  <option value="room1">Assessment Room 1</option>
                  <option value="room2">Assessment Room 2</option>
                  <option value="room3">Assessment Room 3</option>
                  <option value="room4">Assessment Room 4</option>
                  <option value="devRoom">Developmental Assessment Room (Room 2.07)</option>
                </select>

                <label htmlFor="Comments">Visit Note</label>
                <textarea // input for comment
                  type="text"
                  id="comment"
                  value={appNote}
                  onChange={(e) => setAppNote(e.target.value)}
                  placeholder="Enter notes on visit"
                  required
                />

                <button // Submit button 
                type="submit" className='submit-button'> 
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