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
        const apiData = response.data;

        // Transform API data to your existing format
        const transformedData = apiData.map((rec) => ({
          id: rec.record_id || "",
          type: "window", // Default to window unless overridden
          visitNum: 1,
          OutOfArea: rec.nicu_ooa === "1",
          DOB: rec.nicu_dob || "",
          Sex:
            {
              1: "Male",
              2: "Female",
            }[rec.nicu_sex] || "Unknown",
          site:
            {
              1: "CUMH",
              2: "Coombe",
              3: "Rotunda",
            }[rec.nicu_dag] || "Unknown",
          Study: ["AIMHIGH"], // Default study
          DaysEarly: rec.nicu_days_early ? Number(rec.nicu_days_early) : 0,
          email: rec.nicu_email || "",
          participantGroup:
            {
              1: "High Risk Infant",
              2: "Control",
            }[rec.nicu_participant_group] || "Unknown",
          // Local-only fields
          Name: "",
          Info: "",
          notes: rec.nicu_email || "", // Use email as contact
          room: "",
        }));

        // Load any local modifications from localStorage
        const localModifications = JSON.parse(
          localStorage.getItem("patientModifications") || "{}"
        );
        const localPatients = JSON.parse(
          localStorage.getItem("userInfoList") || "[]"
        );

        // Merge API data with local modifications
        const mergedData = transformedData.map((patient) => {
          const localMod = localModifications[patient.id] || {};
          return { ...patient, ...localMod };
        });

        // Add any completely local patients
        const localOnlyPatients = localPatients.filter(
          (local) => !transformedData.some((api) => api.id === local.id)
        );

        const finalData = [...mergedData, ...localOnlyPatients];
        setData(finalData);
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
    setData((prev) => {
      const updated = prev.map((patient) =>
        patient.record_id === record_id || patient.id === record_id
          ? { ...patient, ...updates }
          : patient
      );

      // Save to localStorage
      localStorage.setItem("userInfoList", JSON.stringify(updated));

      // Also save modifications separately for API patients
      const modifications = JSON.parse(
        localStorage.getItem("patientModifications") || "{}"
      );
      if (updates) {
        modifications[record_id] = { ...modifications[record_id], ...updates };
        localStorage.setItem(
          "patientModifications",
          JSON.stringify(modifications)
        );
      }

      return updated;
    });
  };

  const editPatient = (record_id, updates) => {
    setData((prev) => {
      const updated = prev.map((patient) =>
        patient.record_id === record_id || patient.id === record_id
          ? { ...patient, ...updates }
          : patient
      );

      // Save to localStorage
      localStorage.setItem("userInfoList", JSON.stringify(updated));
      return updated;
    });
  };

  // Add new patient function
  const addPatient = (newPatient) => {
    setData((prev) => {
      const updated = [...prev, newPatient];
      localStorage.setItem("userInfoList", JSON.stringify(updated));
      return updated;
    });
  };

  // Delete patient function
  const deletePatient = (patientId) => {
    updatedPatient(patientId, { deleted: true });
  };

  return (
    // Special component that can pass data down to any component wrapped inside
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        updatedPatient,
        editPatient,
        addPatient,
        deletePatient,
        updatePatient: updatedPatient, // Alias for consistency
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
