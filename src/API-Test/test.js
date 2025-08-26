import React from "react";
import { useData } from "../data/DataContext";

const Test = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading record IDs...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Record IDs</h2>
      <ul style={{ textAlign: "center" }}>
        {data.map((record, index) => (
          <li key={index}>{record.record_id}</li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
