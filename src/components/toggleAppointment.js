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
  const [appDateTimeStart, setAppDateTimeStart] = useState('');
  const [appDateTimeEnd, setAppDateTimeEnd] = useState('');
  const [patientStudy, setPatientStudy] = useState('');

  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();

    // The new appointment info
    const newAppointment = {
      title: appTitle,
      patID: appPatID,
      start: new Date(appDateTimeStart),
      end: new Date(appDateTimeEnd),
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

                <label htmlFor="startDateTime">Start date and time</label>
                <input // datetime input for start app (Replace with one date selector and a time selector as appointments won't stretch a day long)
                  type="datetime-local"
                  id="startDateTime"
                  value={appDateTimeStart}
                  onChange={(e) => setAppDateTimeStart(e.target.value)}
                  required
                />

                <label htmlFor="endDateTime">End date and time</label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  value={appDateTimeEnd}
                  onChange={(e) => setAppDateTimeEnd(e.target.value)}
                  required
                />

                <label htmlFor="study">Study Patient is in</label>
                <select // Dropdown for which study app is for
                  id="study"
                  value={patientStudy}
                  onChange={(e) => setPatientStudy(e.target.value)}
                >
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
