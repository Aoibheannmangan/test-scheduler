import React, { useEffect, useState } from 'react';
import './info.css';
import { useNavigate } from 'react-router-dom';
import Alert from './components/Alert';

const UserInfo = () => {
  const [patientName, setPatientName] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [patientEarly, setPatientEarly] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [patientStudy, setPatientStudy] = useState('');
  const [patientSite, setPatientSite] = useState('');
  const [patientOutOfArea, setPatientOutOfArea] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(true);


  useEffect(() => {
    const editData = localStorage.getItem("editPatient");
    if (editData) {
      const patient = JSON.parse(editData);
      setPatientName(patient.Name);
      setPatientDOB(patient.DOB);
      setPatientEarly(patient.DaysEarly);
      setPatientSex(patient.Sex);
      setPatientCondition(patient.Condition);
      setPatientStudy(patient.Study);
      setPatientSite(patient.site);
      setPatientOutOfArea(patient.OutOfArea);
      setPatientInfo(patient.Info);
      setEditId(patient.id);
      setIsEditing(true);
    }
  }, []);

  const generatePatientID = () => {
    const prefix = '230'; //Will be done in the future to change depending on the site
    const patients = JSON.parse(localStorage.getItem('userInfoList')) || [];
    const numbers = patients
      .map(p => p.id)
      .filter(id => id && id.startsWith(prefix + '-'))
      .map(id => parseInt(id.split('-')[1], 10))
      .filter(num => !isNaN(num));
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const newNumber = maxNumber + 1;

    return `${prefix}-${String(newNumber).padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = {
      id: isEditing ? editId : generatePatientID(),
      Name: patientName,
      DOB: patientDOB,
      DaysEarly: patientEarly,
      Sex: patientSex,
      Condition: patientCondition,
      Study: patientStudy,
      site: patientSite,
      OutOfArea: patientOutOfArea,
      Info: patientInfo,
    };

    let patients = JSON.parse(localStorage.getItem("userInfoList")) || [];

    if (isEditing) {
      patients = patients.map(p => p.id === newPatient.id ? newPatient : p);
      localStorage.removeItem("editPatient");
      setAlert({message: "Are you sure you want to edit?", type: "warning"});
    } else {
      patients.push(newPatient);
      setAlert({message: "Patient Successfully Created", type:"success"});
    }

    localStorage.setItem("userInfoList", JSON.stringify(patients));

    setTimeout(() => {
      navigate('/account');
    }, 2000);
  };

  return (
    <div className="App">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h1>Patient Info</h1>
      <fieldset>
        <div className="form-border">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Patient Name:</label>
            <input
              type="text"
              id="firstname"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter Patient Name"
              autoComplete="off"
              required
            />

            <label htmlFor="patientDOB">Patient Date of Birth:</label>
            <input
              type="date"
              id="patientDOB"
              value={patientDOB}
              onChange={(e) => setPatientDOB(e.target.value)}
              required
            />

            <label htmlFor="early">Amount of Days Early:</label>
            <input
              type="number"
              id="early"
              value={patientEarly}
              onChange={(e) => setPatientEarly(e.target.value)}
              placeholder="Enter the Amount of Days the Patient was Early"
              required
            />

            <label htmlFor="sex">Patient's Sex:</label>
            <select
              id="sex"
              name="sex"
              value={patientSex}
              onChange={(e) => setPatientSex(e.target.value)}
            >
              <option value="">-- Select Sex --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label htmlFor="condition">Patient's Condition:</label>
            <input
              type="text"
              id="condition"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="Enter Patient Condition"
              autoComplete="off"
              required
            />

            <label htmlFor="study">Patient's Study:</label>
            <select
              id="study"
              name="study"
              value={patientStudy}
              onChange={(e) => setPatientStudy(e.target.value)}
            >
              <option value="">-- Select Study --</option>
              <option value="AIMHIGH">AIMHIGH</option>
              <option value="COOLPRIME">COOLPRIME</option>
              <option value="EDI">EDI</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="site">Patient's Site:</label>
            <select
              id="site"
              name="site"
              value={patientSite}
              onChange={(e) => setPatientSite(e.target.value)}
            >
              <option value="">-- Select Site --</option>
              <option value="Cork">Cork</option>
              <option value="Coombe">Coombe</option>
              <option value="NMH">NMH</option>
              <option value="Rotunda">Rotunda</option>
              <option value="UHW">UHW</option>
              <option value="CHI">CHI</option>
            </select>

            <label>Out of Area?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="area"
                  value="Yes"
                  checked={patientOutOfArea === "Yes"}
                  onChange={(e) => setPatientOutOfArea(e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="area"
                  value="No"
                  checked={patientOutOfArea === "No"}
                  onChange={(e) => setPatientOutOfArea(e.target.value)}
                />
                No
              </label>
            </div>

            <label htmlFor="notes">Additional Notes:</label>
            <input
              type="text"
              id="notes"
              value={patientInfo}
              onChange={(e) => setPatientInfo(e.target.value)}
              placeholder="Enter Additional Notes"
              autoComplete="off"
              required
            />

            <button type="submit">{isEditing ? "Update" : "Submit"}</button>
          </form>
        </div>
      </fieldset>
    </div>
  );
};

export default UserInfo;
