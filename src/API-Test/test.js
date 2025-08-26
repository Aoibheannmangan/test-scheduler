import React from "react";
import { useData } from "../data/DataContext";

const Test = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading participant IDs...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <h2>Participant Records</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>Record ID</th>
            <th>DOB</th>
            <th>OOA?</th>
            <th>Participant Group</th>
            <th>Site</th>
            <th>Contact Email</th>
            <th>Days Early</th>
          </tr>
        </thead>
        <tbody>
          {data.map((participant, index) => (
            // **Must map options from numbers to strings eg 1= CUMH for site**
            <tr key={index}>
              <td>{participant.record_id}</td>
              <td>{participant.nicu_dob}</td>
              <td>{participant.nicu_ooa}</td>
              <td>{participant.nicu_participant_group}</td>
              <td>{participant.nicu_dag}</td>
              <td>{participant.nicu_email}</td>
              <td>{participant.nicu_days_early}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Test;
