import React, { useState } from "react";
import "./AppointmentForm.css";

// Toggle is not visible by default
const ToggleAppointment = ({ onAddAppointment, isOpen, onClose }) => {
  // States vars for appointment booking
  const [appPatID, setAppPatID] = useState("");
  const [appDate, setAppDate] = useState("");
  const [appTimeStart, setAppTimeStart] = useState("");
  const [appTimeEnd, setAppTimeEnd] = useState("");
  const [patientStudy, setPatientStudy] = useState("");
  const [appRoom, setAppRoom] = useState("select");
  const [appNote, setAppNote] = useState("");

  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(`${appDate}T${appTimeStart}`);
    const end = new Date(`${appDate}T${appTimeEnd}`);
    const appTitle = `${patientStudy.toUpperCase()} | ID: ${appPatID}`;

    const newAppointment = {
      title: appTitle,
      patientId: appPatID,
      start,
      end,
      type: "booked",
      Study: [patientStudy] || "",
      room: appRoom,
      notes: appNote,
    };

    onAddAppointment(newAppointment);
    setAppPatID("");
    setAppDate("");
    setAppTimeStart("");
    setAppTimeEnd("");
    setPatientStudy("");
    setAppRoom("");
    setAppNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="Appointment-overlay">
      <div className="Appointment-content">
        <div className="AppointmentToggle">
          <fieldset>
            <div className="form-border">
              <form onSubmit={handleSubmit} data-testid="appointment-form">
                <label htmlFor="patientID">Patient ID</label>
                <input // input for ID
                  type="text"
                  aria-label="Patient ID"
                  name="patientID"
                  id="patientID"
                  value={appPatID}
                  onChange={(e) => setAppPatID(e.target.value)}
                  placeholder="Enter Patient ID"
                  required
                />

                <label htmlFor="date">Appointment Date</label>
                <input // date input for app
                  type="date"
                  id="date"
                  value={appDate}
                  onChange={(e) => setAppDate(e.target.value)}
                  required
                />

                <label htmlFor="startTime">Start Time</label>
                <input // Start time for app. Increments in 15 mins
                  type="time"
                  id="startTime"
                  min="09:00"
                  max="18:00"
                  step={900}
                  value={appTimeStart}
                  onChange={(e) => setAppTimeStart(e.target.value)}
                  required
                />

                <label htmlFor="endTime">End Time</label>
                <input // End time for app. Increments in 15 mins
                  type="time"
                  id="endTime"
                  min="09:00"
                  max="18:00"
                  step={900}
                  value={appTimeEnd}
                  onChange={(e) => setAppTimeEnd(e.target.value)}
                  required
                />
                <br />

                <label htmlFor="room">Assessment Room:</label>
                <select
                  id="room"
                  name="room"
                  value={appRoom}
                  onChange={(e) => setAppRoom(e.target.value)}
                >
                  <option value="select" disabled>
                    -- Select Room --
                  </option>
                  <option value="TeleRoom">Telemetry Room (Room 2.10)</option>
                  <option value="room1">Assessment Room 1</option>
                  <option value="room2">Assessment Room 2</option>
                  <option value="room3">Assessment Room 3</option>
                  <option value="room4">Assessment Room 4</option>
                  <option value="devRoom">
                    Developmental Assessment Room (Room 2.07)
                  </option>
                </select>

                <label htmlFor="Comments">Visit Note</label>
                <textarea // input for comment
                  type="text"
                  id="Comments"
                  name="Comments"
                  value={appNote}
                  onChange={(e) => setAppNote(e.target.value)}
                  placeholder="Enter notes on visit"
                  required
                />

                <button className="submit-button" type="submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                  aria-label="Close"
                  name="close"
                >
                  Close
                </button>
              </form>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default ToggleAppointment;
