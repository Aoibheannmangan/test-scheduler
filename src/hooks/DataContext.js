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

  // Use a configurable API base url so the same build can work in Docker/K8s/locally
  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "/api";

  useEffect(() => {
    const fetchData = async () => {
      // Tries to load data from flask where the API stored data
      try {
        const response = await axios.get(`${apiUrl}/data`, { timeout: 20000 });
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

  return (
    // Special component that can pass data down to any component wrapped inside
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        updatePatient: updatedPatient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
