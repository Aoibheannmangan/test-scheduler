import React, { useState, useMemo } from "react";
import "./Appointment.css";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

/**
 * Toggle is not visible by default
 * @returns {void} Does not return a value
 */
// Toggle is not visible by default
const ToggleAppointment = ({
  onAddAppointment,
  isOpen,
  onClose,
  bookedEvents,
}) => {
  // States vars for appointment booking
  const [appPatID, setAppPatID] = useState("");
  const [appDate, setAppDate] = useState("");
  const [appTimeStart, setAppTimeStart] = useState(null); // Changed from "" to null
  const [appTimeEnd, setAppTimeEnd] = useState(null); // Changed from "" to null
  const [patientStudy, setPatientStudy] = useState("");
  const [appRoom, setAppRoom] = useState("");
  const [appNote, setAppNote] = useState("");

  const roomList = {
    TeleRoom: "Telemetry Room (Room 2.10)",
    room1: "Assessment Room 1",
    room2: "Assessment Room 2",
    room3: "Assessment Room 3",
    room4: "Assessment Room 4",
    devRoom: "Developmental Assessment Room (Room 2.07)",
  };

  /**
   * Checks if a room is avaliable at a time
   * @param {string} roomId - The ID of the room
   * @param {Date} startTime - Appointment start time
   * @param {Date} endTime  - Appointment end time
   * @param {Array<Object>} appointments - List of current appointments
   * @returns {Boolean} - Returns true if avaliable, false if not
   */
  // Function to check if room is available at selected time
  const isRoomAvailable = (roomId, startTime, endTime, appointments) => {
    if (!startTime || !endTime) return true; // If no time selected, show all as available

    return !appointments.some((event) => {
      if (event.room !== roomId) return false;
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return startTime < eventEnd && endTime > eventStart;
    });
  };

  /**
 * Calculates the selected start and end times based on the provided date and time.
 * These values are memoized to avoid recalculating unless dependencies change.
 * 
 * @returns {Date|null} The selected start time or `null` if invalid inputs.
 * @returns {Date|null} The selected end time or `null` if invalid inputs.
 */

  // Calculate selected start and end times
  const selectedStart = useMemo(() => {
    if (!appDate || !appTimeStart || !dayjs.isDayjs(appTimeStart)) return null;
    return dayjs(`${appDate}T${appTimeStart.format("HH:mm")}`).toDate();
  }, [appDate, appTimeStart]);

  const selectedEnd = useMemo(() => {
    if (!appDate || !appTimeEnd || !dayjs.isDayjs(appTimeEnd)) return null;
    return dayjs(`${appDate}T${appTimeEnd.format("HH:mm")}`).toDate();
  }, [appDate, appTimeEnd]);

  /**
   * Generates the room options with avaliability based on selected start times
   * 
   * @returns {Array<Object>} - A list of rooms with their avaliabilty status
   */
  const roomOptions = useMemo(() => {
    return Object.entries(roomList).map(([roomId, roomName]) => {
      const available = isRoomAvailable(
        roomId,
        selectedStart,
        selectedEnd,
        bookedEvents
      );
      return {
        id: roomId,
        name: roomName,
        available,
      };
    });
  }, [selectedStart, selectedEnd, bookedEvents]);

  /**
   * Handles form submission for new appointments
   * Validates the start and end times
   * Constructs a new appointment object and calls onAddAppointment
   * Resets form state after submission
   * 
   * @param {Event} e - Event triggered by form submission 
   * @returns {void}
   */
  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation to ensure times are selected
    if (!appTimeStart || !dayjs.isDayjs(appTimeStart)) {
      alert("Please select a start time");
      return;
    }
    if (!appTimeEnd || !dayjs.isDayjs(appTimeEnd)) {
      alert("Please select an end time");
      return;
    }

    const start = dayjs(appDate)
      .set("hour", appTimeStart.hour())
      .set("minute", appTimeStart.minute())
      .set("second", 0)
      .set("millisecond", 0)
      .toDate();

    const end = dayjs(appDate)
      .set("hour", appTimeEnd.hour())
      .set("minute", appTimeEnd.minute())
      .set("second", 0)
      .set("millisecond", 0)
      .toDate();

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

    // Reset form
    setAppPatID("");
    setAppDate("");
    setAppTimeStart(null); // Reset to null instead of ""
    setAppTimeEnd(null); // Reset to null instead of ""
    setPatientStudy("");
    setAppRoom("");
    setAppNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="Appointment-overlay">
      <div className="Appointment-content">
        <fieldset>
          <div className="form-border">
            <form onSubmit={handleSubmit}>
              <label htmlFor="patientID">Patient ID</label>
              <input // input for ID
                type="text"
                id="patID"
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
              <TimePicker
                label="Start Time"
                value={appTimeStart}
                minutesStep={30}
                skipDisabled={true}
                views={["hours", "minutes"]}
                format="HH:mm"
                onChange={(newValue) => {
                  // No need to wrap in dayjs() if newValue is already a dayjs object
                  setAppTimeStart(newValue);
                }}
                slotProps={{
                  textField: {
                    id: "startTime",
                    required: true,
                    fullWidth: true,
                  },
                  digitalClockSectionItem: {
                    sx: {
                      '&[data-mui-seconds="15"], &[data-mui-seconds="45"]': {
                        display: "none",
                      },
                    },
                  },
                }}
              />

              <label htmlFor="endTime">End Time</label>
              <TimePicker
                label="End Time"
                value={appTimeEnd}
                minutesStep={30}
                skipDisabled={true}
                views={["hours", "minutes"]}
                format="HH:mm"
                onChange={(newValue) => {
                  // No need to wrap in dayjs() if newValue is already a dayjs object
                  setAppTimeEnd(newValue);
                }}
                slotProps={{
                  textField: {
                    id: "endTime",
                    required: true,
                    fullWidth: true,
                  },
                  digitalClockSectionItem: {
                    sx: {
                      '&[data-mui-seconds="15"], &[data-mui-seconds="45"]': {
                        display: "none",
                      },
                    },
                  },
                }}
              />
              <br />

              <label htmlFor="room">Assessment Room:</label>
              <select
                id="room"
                name="room"
                value={appRoom}
                onChange={(e) => setAppRoom(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Select Room --
                </option>
                {roomOptions.map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                    disabled={!room.available}
                    style={{
                      color: room.available ? "black" : "#999",
                      backgroundColor: room.available ? "white" : "#f5f5f5",
                    }}
                  >
                    {room.name} {room.available ? "" : "(Unavailable)"}
                  </option>
                ))}
              </select>

              <label htmlFor="Comments">Visit Note</label>
              <textarea // input for comment
                type="text"
                id="comment"
                value={appNote}
                onChange={(e) => setAppNote(e.target.value)}
                placeholder="Enter notes on visit"
              />

              <button className="submit-button" type="submit">
                Submit
              </button>
              <button className="cancel-button" onClick={onClose}>
                Close
              </button>
            </form>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default ToggleAppointment;
