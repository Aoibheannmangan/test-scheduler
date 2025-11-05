import React, { createContext, useContext, useEffect, useState, useMemo,} from "react";
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
        const response = await axios.get(`${apiUrl}/api/data`, {
          timeout: 20000,
        });
        const processedData = response.data.map((patient) => ({
          ...patient,
          DOB: patient.nicu_dob ? new Date(patient.nicu_dob) : null, // Convert to Date object, handle empty
          DaysEarly: parseInt(patient.nicu_days_early) || 0, // Convert to int, default to 0
          Study: "AIMHIGH", // Hardcode as AIMHIGH
          Name: `Patient ${patient.record_id}`, // Create a display name
          id: patient.record_id, // Map record_id to id for Calendar.js search
        }));
        setData(processedData);
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

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      updatePatient: updatedPatient,
    }),
    [data, loading, error, updatedPatient]
  );

  return (
    // Special component that can pass data down to any component wrapped inside
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
