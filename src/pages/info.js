import React, { useEffect, useState } from 'react';
import './info.css';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import PopUp from '../components/PopUp';

const UserInfo = () => {
  const [patientName, setPatientName] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [patientEarly, setPatientEarly] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [patientStudy, setPatientStudy] = useState([]);
  const [patientSite, setPatientSite] = useState('');
  const [patientOutOfArea, setPatientOutOfArea] = useState(false);
  const [patientInfo, setPatientInfo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [windowType, setWindowType] = useState('');
  const [visitNum, setVisitNum] = useState(Number);
  const [patientRoom, setRoom] = useState('')
  const [patientNotes, setNotes] = useState('');

  const [popupOpen, setPopupOpen] = useState(false);

  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

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
      setPatientOutOfArea(Boolean(patient.OutOfArea)); 
      setPatientInfo(patient.Info);
      setEditId(patient.id);
      setIsEditing(true);
      setVisitNum(patient.visitNum);
      setWindowType(patient.type)
      setRoom(patient.room)
      setNotes(patientNotes)
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

    const id = isEditing ? editId : generatePatientID();
    const type = isEditing ? windowType : 'window';
    const visit = isEditing ? visitNum : 1;

    const newPatient = {
      id,
      Name: patientName,
      DOB: patientDOB,
      DaysEarly: patientEarly,
      Sex: patientSex,
      Condition: patientCondition,
      Study: patientStudy,
      site: patientSite,
      OutOfArea: patientOutOfArea,
      Info: patientInfo,
      type,
      visitNum: visit,
      room: patientRoom,
      notes: patientNotes,
    };

    let patients = JSON.parse(localStorage.getItem("userInfoList")) || [];

    let updatedPatients;

     if (isEditing) {
      updatedPatients = patients.map(p => p.id === newPatient.id ? newPatient : p);
      localStorage.removeItem('editPatient');
      setAlert({message: "Patient successfully updated", type: "success"});
    } else {
      updatedPatients = [...patients, newPatient];
      setAlert({message: "Patient successfully created", type: "success"})
    }
    localStorage.setItem("userInfoList", JSON.stringify(updatedPatients));

    setTimeout(() => {
      navigate("/account");
    }, 2000);

  };

  const confirmEdit = () => {
    setPopupOpen(false);
    handleSubmit();
  }

    

  return (
    <div className="App">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h1 className='heading-text'>Patient Info</h1>
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

            <label htmlFor="early">Days born before due date:</label>
            <input
              type="number"
              id="early"
              value={patientEarly}
              onChange={(e) => setPatientEarly(e.target.value)}
              placeholder="Amount of days the patient was born before their due date"
              required
            />

            <label htmlFor="sex">Patient's Sex:</label>
            <select
              id="sex"
              name="sex"
              value={patientSex}
              onChange={(e) => setPatientSex(e.target.value)}
            >
              <option value=""disabled selected>-- Select Sex --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label htmlFor="condition">Case Condition:</label>
             <select
              id="condition"
              name="condition"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
            >
              <option value="" disabled selected>-- Select Case --</option>
              <option value="Control">Control</option>
              <option value="Case">Case</option>
            </select>

            <label>Patient's Studies:</label>
            <div className="radio-group">
              {['AIMHIGH', 'COOLPRIME', 'EDI'].map((study) => (
                <label key={study}>
                  <input
                    type="checkbox"
                    value={study}
                    checked={patientStudy.includes(study)}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setPatientStudy((prev) =>
                        prev.includes(selected)
                          ? prev.filter((s) => s !== selected)
                          : [...prev, selected]
                      );
                    }}
                  />
                  {study}
                </label>
              ))}
            </div>


            <label htmlFor="site">Patient's Site:</label>
            <select
              id="site"
              name="site"
              value={patientSite}
              onChange={(e) => setPatientSite(e.target.value)}
            >
              <option value=""disabled selected>-- Select Site --</option>
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
                  id='Out'
                  type="radio"
                  name="area"
                  value="true"
                  checked={patientOutOfArea === true}
                  onChange={() => setPatientOutOfArea(true)}
                />
                Yes
              </label>

              <label>
                <input
                  id='NotOut'
                  type="radio"
                  name="area"
                  value="false"
                  checked={patientOutOfArea === false}
                  onChange={() => setPatientOutOfArea(false)}
                />
                No
              </label>

            </div>

            <label htmlFor="notes">Additional Info On Patient:</label>
            <input
              type="text"
              id="info"
              value={patientInfo}
              onChange={(e) => setPatientInfo(e.target.value)}
              placeholder="Enter Additional Notes"
              autoComplete="off"
            />
            <div >
              <button type="submit" className="submit-button">{isEditing ? "Update" : "Submit"}</button>
            </div>
          </form>
        </div>
      </fieldset>
       <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={confirmEdit}
        message="Are you sure you want to edit this patient"
      />
    </div>
  );
};

export default UserInfo;
