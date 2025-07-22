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

    // Combine date and time so event can process them properly
    const startDateTime = new Date(`${appDate}T${appTimeStart}`);
    const endDateTime = new Date(`${appDate}T${appTimeEnd}`);

    // The new appointment info
    const newAppointment = {
      title: appTitle,
      patID: appPatID,
      start: startDateTime,
      end: endDateTime,
      type: 'booked',
      study: patientStudy.toUpperCase(),
    };

    //console.log("Submitted appointment:", newAppointment); *testing*
    onAddAppointment(newAppointment);
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

                <label htmlFor="study">Study Patient is in</label>
                <select // Dropdown for which study app is for
                  id="study"
                  value={patientStudy}
                  onChange={(e) => setPatientStudy(e.target.value)}
                  required>
                  <option value="AIMHIGH">AIMHIGH</option>
                  <option value="COOLPRIME">COOLPRIME</option>
                  <option value="EDI">EDI</option>
                </select>

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
