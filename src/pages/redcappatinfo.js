import React from "react";
import { useData } from "../hooks/DataContext";
import "./account.css";

const PatientInfo = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading Participant Information</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="AccountInfo">
      <h1>Participant Information</h1>
      {data.length === 0 ? (
        <p className="small-text"><b>No Patient Data available</b></p>
      ) : (
        data.map((participant, index) => {
          return (
            <div className="display" key={index}>
              <div className="card-header">
                <h3><strong>Patient ID: </strong>{participant.record_id}</h3>
              </div>
              <hr className="divider" />
              <ul>
                <li><strong>Date of Birth: </strong>{participant.nicu_dob}</li>
                <li><strong>Days Early: </strong>{participant.nicu_days_early}</li>
                <li><strong>Out of Area: </strong>{participant.nicu_ooa}</li>
                <li><strong>Group: </strong>{participant.nicu_participant_group}</li>
                <li><strong>Site: </strong>{participant.nicu_dag}</li>
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PatientInfo;
