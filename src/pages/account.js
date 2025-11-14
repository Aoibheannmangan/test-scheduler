import React, { useState, useEffect } from "react";
import "./account.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Alert from "../components/Alert";
import PopUp from "../components/PopUp";
import { useData } from "../hooks/DataContext"; // <-- Import context

const Account = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Use context for patient list
  const { data: apiUserList, loading, error, updatedPatient } = useData();
  const [userList, setUserList] = useState([]);

  // Map API fields to appointment fields (same as AppointView)
  useEffect(() => {
    if (apiUserList && Array.isArray(apiUserList)) {
      const mapped = apiUserList.map((rec) => ({
        id: rec.record_id || "",
        visitNum: rec.visitNum || 1,
        OutOfArea:
          rec.OutOfArea !== undefined ? rec.OutOfArea : rec.nicu_ooa === "1",
        DOB: rec.DOB || rec.nn_dob || "",
        Sex:
          {
            1: "Male",
            2: "Female",
          }[rec.nn_sex] || "Unknown",
        site:
          {
            1: "CUMH",
            2: "Coombe",
            3: "Rotunda",
          }[rec.nicu_dag] || "Unknown",
        DaysEarly: rec.reg_days_early ? Number(rec.reg_days_early) : 0,
        participantGroup:
          {
            1: "High Risk Infant",
            2: "Control",
          }[rec.nicu_participant_group] || "Unknown",
        gestWeeks: rec.reg_gest_age_w,
        gestDays: rec.reg_gest_age_d,
        Study: rec.Study || ["AIMHIGH"], // No info on this (Depends on API eg: this is from an AIMHIGH REDCap)
        notes: rec.notes || rec.reg_email || "", // No info on this
        Info: rec.Info || "", // No info on this
        room: rec.room || "", // No info on this (room requirements??)
      }));
      setUserList(mapped);
    } else {
      setUserList([]);
    }
  }, [apiUserList]);

  console.log(apiUserList);

  // Handle delete (soft delete: mark as deleted)
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
              <strong>Group:</strong> {user.participantGroup}
            </li>
            <li>
              <strong>Study:</strong>{" "}
              {Array.isArray(user.Study) ? user.Study.join(", ") : [user.Study]}
            </li>
            <li>
              <strong>Site:</strong> {user.site}
            </li>
            <li>
              <strong>Gestational Age:</strong> {user.gestWeeks} {"Weeks "}
              {user.gestDays}
              {" Days"}
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
