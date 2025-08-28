import React, { useState } from "react";
import "./account.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Alert from "../components/Alert";
import PopUp from "../components/PopUp";
import { useData } from "../hooks/DataContext"; // <-- Import context

const Account = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const { editPatient } = useData();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Use context for patient list
  const { data: userList, loading, error, updatedPatient } = useData();

  // Handle delete (soft delete: mark as deleted, or remove from context if you want)
  const handleDelete = (id) => {
    setSelectedUserId(id);
    setPopupOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId === null) return;
    setAlert({ message: "This patient will be deleted", type: "warning" });
    setPopupOpen(false);

    setTimeout(() => {
      // Remove patient from context (or mark as deleted)
      updatedPatient(selectedUserId, { deleted: true }); // You can filter out deleted patients below
      setAlert(null);
      setSelectedUserId(null);
    }, 1000);
  };

  const handleEdit = (user) => {
    localStorage.setItem("editPatient", JSON.stringify(user));
    navigate("/info");
  };

  //------------------------------------------------ HTML ------------------------------------------------------------

  // API loading or error message if encountered
  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error loading appointments: {error.message}</div>;

  // Filter out deleted patients if using soft delete
  const visibleUsers = Array.isArray(userList)
    ? userList.filter((user) => !user.deleted)
    : [];

  if (visibleUsers.length === 0) {
    return (
      <div>
        <p className="small-text">
          <b>No Patient Data</b>
        </p>
        <a href="info" className="edit">
          Add Patient Information
        </a>
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
      <a href="info" className="edit">
        Add Patients
      </a>
      {visibleUsers.map((user) => (
        <div className="display" key={user.id || user.record_id}>
          <div className="card-header">
            <h3>
              <strong>Id: </strong>
              {user.id || user.record_id}
            </h3>
            <h3>
              <strong>Name: </strong>
              {user.Name}
            </h3>
            <div className="icon-actions">
              <button onClick={() => handleEdit(user)} title="Edit">
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(user.id || user.record_id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <hr className="divider" />
          <ul>
            <li>
              <strong>Date of Birth:</strong> {user.DOB}
            </li>
            <li>
              <strong>Days Early:</strong> {user.DaysEarly}
            </li>
            <li>
              <strong>Sex:</strong> {user.Sex}
            </li>
            <li>
              <strong>Group:</strong> {user.Group}
            </li>
            <li>
              <strong>Study:</strong>{" "}
              {Array.isArray(user.Study) ? user.Study.join(", ") : [user.Study]}
            </li>
            <li>
              <strong>Site:</strong> {user.site}
            </li>
            {/* Only show this li if Info is not empty */}
            {user.Info && user.Info.trim() !== "" && (
              <li>
                <strong>Additional Notes:</strong> {user.Info}
              </li>
            )}
          </ul>
        </div>
      ))}
      <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this patient?"
      />
    </div>
  );
};

export default Account;
