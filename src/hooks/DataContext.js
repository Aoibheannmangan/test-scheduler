import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DataContext = createContext();

// Create functional component
export const DataProvider = ({ children }) => {
  //Initialise vars

  // Data array is set blank
  const [data, setData] = useState([]);
  // True as data is currently being fetched
  const [loading, setLoading] = useState(true);
  // To store any errors recieved
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Tries to load data from flask where the API stored data
      try {
        // Flask url
        const response = await axios.get("http://127.0.0.1:5000/api/data");
        setData(response.data);
      } catch (err) {
        // Set error if encountered
        setError(err);
      } finally {
        // Set loading to false after error or recieving data
        setLoading(false);
      }
    };

    // Function call
    fetchData();
  }, []);

  // Function to update a patient (e.g., mark as booked)
  const updatedPatient = (record_id, updates) => {
    setData((prev) =>
      prev.map((patient) =>
        patient.record_id === record_id ? { ...patient, ...updates } : patient
      )
    );
  };

  const editPatient = (record_id, updates) => {
    setData((prev) =>
      prev.map((patient) =>
        patient.record_id === record_id ? { ...patient, ...updates } : patient
      )
    );
  };

  return (
    // Special component that can pass data down to any component wrapped inside
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        updatePatient: updatedPatient,
        editPatient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
