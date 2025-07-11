import React, { useState } from 'react';
import './info.css';

const UserInfo = () => {
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let userData = {
      FirstName: patientFirstName,
      LastName: patientLastName,
      DOB: patientDOB,
      Age: patientAge,
      Sex: patientSex,
      Address: patientAddress
    };
    localStorage.setItem("userInfo", JSON.stringify(userData));
    alert("Data recorded successfully!");
    window.location.reload(); // Reload the page to clear the form
  }

  return (
    <div className="App">
      <h1>Patient Info</h1>
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
            type="text"
            id="patientDOB"
            value={patientDOB}
            onChange={(e) => setPatientDOB(e.target.value)}
            placeholder="Enter the Patient's Date of Birth"
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="text"
            id="age"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="Enter Age"
            required
          />

          <label htmlFor="sex">Patient's Sex</label>
          <input
            type="text"
            id="sex"
            value={patientSex}
            onChange={(e) => setPatientSex(e.target.value)}
            placeholder="Enter Sex"
            required
          />

          <label htmlFor="address">Patient's Address</label>
          <input
            type="text"
            id="address"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            placeholder="Enter Address"
            required
          />

          <button type="submit">Submit</button>
        </form> 
        </div>
        
      </fieldset>
    </div>
  );
};

export default UserInfo;
