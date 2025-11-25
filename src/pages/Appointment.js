import React, { useState, useMemo, useEffect } from "react";
import "./Appointment.css";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Toggle is not visible by default
const ToggleAppointment = ({
  onAddAppointment,
  isOpen,
  onClose,
  bookedEvents,
  blockedDates,
  roomList,
  userList,
}) => {
  // States vars for appointment booking
  const [appPatID, setAppPatID] = useState("");
  const [appDate, setAppDate] = useState(null);
  const [appTimeStart, setAppTimeStart] = useState(null); // Changed from "" to null
  const [appTimeEnd, setAppTimeEnd] = useState(null); // Changed from "" to null
  const [patientStudy, setPatientStudy] = useState("");
  const [appRoom, setAppRoom] = useState("");
  const [appNote, setAppNote] = useState("");
  const [isEndTimeEditable, setIsEndTimeEditable] = useState(false);

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

  // Calculate time with visit num
  useEffect(() => {
    if (appTimeStart && appPatID && userList && !isEndTimeEditable) {
      const patient = userList.find((p) => p.record_id === appPatID);
      if (!patient) {
        setAppTimeEnd(null);
        return;
      }

      const calculateVisitNum = (patient) => {
        let visit_num = 1;
        if (patient.visit_1_nicu_discharge_complete === "1") {
          visit_num = 2;
          for (let i = 2; i <= 6; i++) {
            if (patient[`v${i}_attend`] === "1") {
              visit_num = i + 1;
            } else {
              break;
            }
          }
        }
        return visit_num;
      };

      const visitNum = calculateVisitNum(patient);
      let defaultDuration = 2; // Default duration

      switch (visitNum) {
        case 2:
          defaultDuration = 3.5;
          break;
        case 3:
          defaultDuration = 2;
          break;
        case 4:
          defaultDuration = 2.5;
          break;
        case 5:
          defaultDuration = 2.5;
          break;
        case 6:
          defaultDuration = 2;
          break;
        default:
          defaultDuration = 2; // Default for visit 1 or others
          break;
      }

      const calculatedEndTime = dayjs(appTimeStart).add(
        defaultDuration,
        "hour"
      );
      setAppTimeEnd(calculatedEndTime);
    }
  }, [appTimeStart, appPatID, userList, isEndTimeEditable]);

  // If start > end time
  useEffect(() => {
    if (appTimeStart && appTimeEnd && appTimeEnd.isBefore(appTimeStart)) {
      // Reset end time if it's before start time
      setAppTimeEnd(dayjs(appTimeStart).add(1, "hour"));
    }
  }, [appTimeStart, appTimeEnd]);

  // Gray out blocked out dates
  const isDateBlocked = (date) => {
    if (!blockedDates) return false;
    const formattedDate = dayjs(date).startOf("day");
    return blockedDates.some((blockedDate) => {
      const start = dayjs(blockedDate.start).startOf("day");
      return formattedDate.isSame(start);
    });
  };

  // Calculate selected start and end times
  const selectedStart = useMemo(() => {
    if (!appDate || !appTimeStart || !dayjs.isDayjs(appTimeStart)) return null;
    return dayjs(
      `${appDate.format("YYYY-MM-DD")}T${appTimeStart.format("HH:mm")}`
    ).toDate();
  }, [appDate, appTimeStart]);

  const selectedEnd = useMemo(() => {
    if (!appDate || !appTimeEnd || !dayjs.isDayjs(appTimeEnd)) return null;
    return dayjs(
      `${appDate.format("YYYY-MM-DD")}T${appTimeEnd.format("HH:mm")}`
    ).toDate();
  }, [appDate, appTimeEnd]);

  // Generate room options with availability
  const roomOptions = useMemo(() => {
    if (!roomList) return [];
    return roomList.map((room) => {
      const available = isRoomAvailable(
        room.id,
        selectedStart,
        selectedEnd,
        bookedEvents
      );
      return {
        ...room,
        available,
      };
    });
  }, [roomList, selectedStart, selectedEnd, bookedEvents]);

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
      .toDate();

    const end = dayjs(appDate)
      .set("hour", appTimeEnd.hour())
      .set("minute", appTimeEnd.minute())
      .toDate();

    const selectedRoom = roomList.find((r) => r.id === appRoom);
    const roomId = selectedRoom ? selectedRoom.dbId : null;

    const newAppointment = {
      patientId: appPatID,
      start: start.toISOString(),
      end: end.toISOString(),
      roomId, // Send the integer roomId to the backend
      notes: appNote,
    };

    onAddAppointment(newAppointment);

    // Reset form
    setAppPatID("");
    setAppDate(null);
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
              <DatePicker // date input for app
                value={appDate}
                onChange={(e) => setAppDate(e)}
                shouldDisableDate={isDateBlocked}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    id: "date",
                    required: true,
                    fullWidth: true,
                  },
                }}
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
                readOnly={!isEndTimeEditable}
                minutesStep={30}
                skipDisabled={true}
                views={["hours", "minutes"]}
                format="HH:mm"
                onChange={(newValue) => {
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
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    className="override-checkbox"
                    checked={isEndTimeEditable}
                    onChange={(e) => setIsEndTimeEditable(e.target.checked)}
                  />
                  Override calculated end time
                </label>
              </div>

              <label htmlFor="room">Assessment Room:</label>
              <select
                id="room"
                name="room"
                value={appRoom}
                onChange={(e) => setAppRoom(e.target.value)}
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
                    {room.label} {room.available ? "" : "(Unavailable)"}
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
                required
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
