import React from "react";
import { useData } from "../data/DataContext";

const Test = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading record IDs...</p>;
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
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            // **Must map options from numbers to strings eg 1= CUMH for site**
            <tr key={index}>
              <td>{record.record_id}</td>
              <td>{record.nicu_dob}</td>
              <td>{record.nicu_ooa}</td>
              <td>{record.nicu_participant_group}</td>
              <td>{record.nicu_dag}</td>
              <td>{record.nicu_email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Test;
