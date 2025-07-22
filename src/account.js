import React, { useEffect, useState } from 'react';
import './account.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Account = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedList = localStorage.getItem("userInfoList");
    if (storedList) {
      setUserList(JSON.parse(storedList));
    }
  }, []);

  const handleDelete = (id) => {
    const updatedList = userList.filter(user => user.id !== id);
    setUserList(updatedList);
    localStorage.setItem("userInfoList", JSON.stringify(updatedList));
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
      <h1>My Patient Information</h1>
      <a href="info" className="edit">Add Patients</a>
      <a href="login" className="logout">Log Out</a>
      {userList.map((user) => (
        <div className="display" key={user.id}>
          <div className="card-header">
            <h3>{user.Name}</h3>
            <div className="icon-actions">
              <button onClick={() => handleEdit(user)} title="Edit">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(user.id)} title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>
          <ul>
            <li><strong>Date of Birth:</strong> {user.DOB}</li>
            <li><strong>Days Early:</strong> {user.Early}</li>
            <li><strong>Sex:</strong> {user.Sex}</li>
            <li><strong>Condition:</strong> {user.Condition}</li>
            <li><strong>Study:</strong> {user.Study}</li>
            <li><strong>Site:</strong> {user.Site}</li>
            <li><strong>Additional Notes:</strong> {user.Info}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Account;
