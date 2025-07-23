import React, { useEffect, useState } from 'react';
import './account.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Alert from './components/Alert';

const Account = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const storedList = localStorage.getItem("userInfoList");
    if (storedList) {
      setUserList(JSON.parse(storedList));
    }
  }, []);

  
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
      setAlert({ message: "This patient will be deleted", type: "warning" });
      setTimeout(() => {
        const updatedList = userList.filter(user => user.id !== id);
        setUserList(updatedList);
        localStorage.setItem("userInfoList", JSON.stringify(updatedList));
        setAlert(null);
      }, 2000);
    }
  };


  const handleEdit = (user) => {
    localStorage.setItem("editPatient", JSON.stringify(user));
    navigate('/info');
  };

  if (userList.length === 0) {
    return (
      <div>
        <p><b>No Patient Data</b></p>
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
            <li><strong>Out of Area: </strong>{user.OutOfArea}</li>
            <li><strong>Additional Notes:</strong> {user.Info}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Account;
