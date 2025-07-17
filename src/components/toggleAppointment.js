import React, { useState } from 'react';
import "./toggleAppointment.css";

const ToggleContainer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [patientDOB, setPatientDOB] = useState('');
    const [patientGestAge, setPatientGestAge] = useState('');
    const [patientSex, setPatientSex] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      const userData = {
        FirstName: patientFirstName,
        LastName: patientLastName,
        DOB: patientDOB,
        GestAge: patientGestAge,
        Sex: patientSex,
      };
    }

  return (
    <div>
      <button onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Appointment Booking
      </button>

      {isVisible && (
        <div className='AppointmentToggle'>
          
          <fieldset>
        <div className="form-border">
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              value={patientFirstName}
              onChange={(e) => setPatientFirstName(e.target.value)}
              placeholder="Enter First Name"
              required
            />

            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              value={patientLastName}
              onChange={(e) => setPatientLastName(e.target.value)}
              placeholder="Enter Last Name"
              required
            />

            <label htmlFor="patientDOB">Patient Date of Birth</label>
            <input
              type="date"
              id="patientDOB"
              value={patientDOB}
              onChange={(e) => setPatientDOB(e.target.value)}
              placeholder="Enter the Patient's Date of Birth"
              required
            />

            <label htmlFor="GestAge">Gestational Age in Weeks</label>
            <input
              type="text"
              id="GestAge"
              value={patientGestAge}
              onChange={(e) => setPatientGestAge(e.target.value)}
              placeholder="Enter Gestational Age in weeks"
              required
            />

            <label htmlFor="sex">Patient's Sex</label>
            <select 
                id="sex" 
                name="sex"
                value={patientSex}
                onChange={(e) => setPatientSex(e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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


export default ToggleContainer;
