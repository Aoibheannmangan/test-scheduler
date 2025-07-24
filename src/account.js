import React, { useEffect, useState } from 'react';
import './account.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Alert from './components/Alert';
import PopUp from './components/PopUp';

const Account = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const storedList = localStorage.getItem("userInfoList");
    if (storedList) {
      setUserList(JSON.parse(storedList));
    }
  }, []);

  
  const handleDelete = (id) => {
    setSelectedUserId(id);
    setPopupOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId === null) return;
    setAlert({message: "This patient will be delted", type: "warning"});
    setPopupOpen(false);

    setTimeout(() => {
      const updatedList = userList.filter(user => user.id !== selectedUserId);
      setUserList(updatedList);
      localStorage.setItem("userInfoList", JSON.stringify(updatedList));
      setAlert(null);
      setSelectedUserId(null);
    }, 1000);
  };


  const handleEdit = (user) => {
    localStorage.setItem("editPatient", JSON.stringify(user));
    navigate('/info');
  };

  if (userList.length === 0) {
    return (
      <div>
        <p className="small-text"><b>No Patient Data</b></p>
        <a href="info" className="edit">Add Patient Information</a>
      </div>
    );
  }

  return (
    <div className="AccountInfo">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h1>My Patient Information</h1>
      <a href="info" className="edit">Add Patients</a>
      {userList.map((user) => (
        <div className="display" key={user.id}>
          <div className="card-header">
            <h3><strong>Id: </strong>{user.id}</h3>
            <h3><strong>Name: </strong>{user.Name}</h3>
            <div className="icon-actions">
              <button onClick={() => handleEdit(user)} title="Edit">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(user.id)} title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>
          <hr className="divider" /> 
          <ul>
            <li><strong>Date of Birth:</strong> {user.DOB}</li>
            <li><strong>Days Early:</strong> {user.DaysEarly}</li>
            <li><strong>Sex:</strong> {user.Sex}</li>
            <li><strong>Condition:</strong> {user.Condition}</li>
            <li><strong>Study:</strong> {user.Study}</li>
            <li><strong>Site:</strong> {user.site}</li>
            <li><strong>Additional Notes:</strong> {user.Info}</li>
          </ul>
        </div>
      ))}
      <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this patient"
      />
    </div>
  );
};

export default Account;
