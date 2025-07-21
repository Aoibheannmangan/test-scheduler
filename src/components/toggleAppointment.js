import React, { useState } from 'react';
import './toggleAppointment.css';

const ToggleAppointment = ({ onAddAppointment }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const [appTitle, setAppTitle] = useState('');
  const [appPatID, setAppPatID] = useState('')
  const [appDateTimeStart, setAppDateTimeStart] = useState('');
  const [appDateTimeEnd, setAppDateTimeEnd] = useState('');
  const [patientStudy, setPatientStudy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAppointment = {
      title: appTitle,
      patID: appPatID,
      start: new Date(appDateTimeStart),
      end: new Date(appDateTimeEnd),
      type: 'booked',
      study: patientStudy.toUpperCase(),
    };

    console.log("Submitted appointment:", newAppointment);
    onAddAppointment(newAppointment);
  };

  return (
    <div>
      <button 
      className='hideButton'
      onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Appointment Booking
      </button>

      {isVisible && (
        <div className='AppointmentToggle'>
          <fieldset>
            <div className="form-border">
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title of Appointment</label>
                <input
                  type="text"
                  id="title"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="Enter Title of Appointment"
                  required
                />

                <label htmlFor="patientID">Patient ID</label>
                <input
                  type="text"
                  id="patID"
                  value={appPatID}
                  onChange={(e) => setAppPatID(e.target.value)}
                  placeholder="Enter Patient ID"
                  required
                />

                <label htmlFor="startDateTime">Start date and time</label>
                <input
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
                <select
                  id="study"
                  value={patientStudy}
                  onChange={(e) => setPatientStudy(e.target.value)}
                >
                  <option value="AIMHIGH">AIMHIGH</option>
                  <option value="COOLPRIME">COOLPRIME</option>
                  <option value="EDI">EDI</option>
                </select>

                <button type="submit">Submit</button>
              </form>
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default ToggleAppointment;
