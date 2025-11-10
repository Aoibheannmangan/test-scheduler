import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "./Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ClickableDateCell from "../components/ClickableCell";
import { eventPropGetter } from "../hooks/eventPropGetter";
import ToggleAppointment from "./Appointment";
import "../components/useAppointmentFilters.css";
import CustomToolbar from "../components/CustomToolbar";
import Alert from "../components/Alert";
import PopUp from "../components/PopUp";
import RebookingForm from "../components/RebookingForm";
import { CiCalendar } from "react-icons/ci";
import { useData } from "../hooks/DataContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";

const MyCalendar = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [searchPatientId, setSearchPatientId] = useState("");
  const [windowEvents, setWindowEvents] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [alert, setAlert] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [outsideWindowPopupOpen, setOutsideWindowPopupOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);

  const [appOpen, setAppOpen] = useState(false);

  const [showRebookingForm, setShowRebookingForm] = useState(false);
  const [rebookPopupOpen, setRebookPopupOpen] = useState(false);
  const [eventToRebook, setEventToRebook] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const isFirstRender = useRef(true);

  /* Blocked dates portion */
  // Create array for blocked dates and show blocked dates state
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/blocked-dates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlockedDates(response.data.blockedDates);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    fetchBlockedDates();
  }, []);
  const [showBlockedDates, setShowBlockedDates] = useState(false);

  /* Appointment portion */
  // Create array to store booked appointments
  const [bookedEvents, setBookedEvents] = useState([]);

  const {
    data: apiUserList,
    loading,
    error,
    updatePatient,
    refetchData,
  } = useData();
  const [userList, setUserList] = useState([]);

  // Run whenever apiUserList changes
  useEffect(() => {
    if (apiUserList) {
      setUserList(apiUserList);
    }
  }, [apiUserList]);

  // Selected rooms available
  const roomList = useMemo(
    () => [
      { id: "TeleRoom", label: "Telemetry Room (Room 2.10)", dbId: 1 },
      { id: "room1", label: "Assessment Room 1", dbId: 2 },
      { id: "room2", label: "Assessment Room 2", dbId: 3 },
      { id: "room3", label: "Assessment Room 3", dbId: 4 },
      { id: "room4", label: "Assessment Room 4", dbId: 5 },
      {
        id: "devRoom",
        label: "Developmental Assessment Room (Room 2.07)",
        dbId: 6,
      },
    ],
    []
  );

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const bookings = response.data.events.map((event) => {
        const room = roomList.find((r) => r.dbId === event.room_id);

        return {
          ...event,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          room: room ? room.id : null,
          event_type: event.event_type,
        };
      });
      setBookedEvents(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [roomList, setBookedEvents]);

  // In use effect as it runs when component mounts
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Open popup when clicking an event
  const handleSelectEvent = (event) => {
    console.log("Selected Event:", event); // DEBUG
    // So only booked events can be altered
    if (event.event_type === "booked") {
      setSelectedEvent(event);
      // Copy all editable properties into editedInfo state
      setEditedInfo({
        title: event.title || "",
        start: moment(event.start),
        end: moment(event.end),
        note: event.note || "",
        room: event.room || "",
        noShow: event.noShow || false,
        noShowComment: event.noShowComment || "",
      });
    }
  };

  const handleBlockDate = async () => {
    if (selectedDate) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/block-date",
          { date: selectedDate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Refetch blocked dates to update the calendar
        const response = await axios.get(
          "http://localhost:5000/api/blocked-dates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlockedDates(response.data.blockedDates);

        setAlert({
          message: `Blocked ${moment(selectedDate).format("YYYY-MM-DD")}`,
          type: "success",
        });
      } catch (error) {
        console.error("Error blocking date:", error);
        setAlert({ message: "Error blocking date", type: "error" });
      }
    } else {
      setAlert({ message: "Please select a date to block", type: "error" });
    }
  };

  const handleShowBlockedDates = () => {
    setShowBlockedDates((prev) => !prev);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  const blockedEventGetter = (event) => {
    if (event.blocked) {
      return {
        className: "rbc-event-blocked",
      };
    }
    return {};
  };

  const combinedEventGetter = (event) => {
    const blockedProps = blockedEventGetter(event);
    const styleProps = eventPropGetter(event);

    return {
      ...styleProps,
      ...blockedProps,
    };
  };

  const handleNoShowChange = (e) => {
    const newNoShowStatus = e.target.checked;
    setEditedInfo((prev) => ({
      ...prev,
      noShow: newNoShowStatus,
    }));

    if (newNoShowStatus) {
      setShowRebookingForm(true);
    } else {
      setShowRebookingForm(false);
    }
  };

  const handleUpdateEvent = (updatedEvent) => {
    const updatedBooked = bookedEvents.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setBookedEvents(updatedBooked);
  };

  useEffect(() => {
    if (!editedInfo || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (editedInfo.show) {
      openBookingFormWithPrefill(selectedEvent);
    }
  }, [editedInfo?.noShow, selectedEvent, editedInfo]);

  const openBookingFormWithPrefill = (event) => {
    setSelectedEvent(event);
    setShowRebookingForm(true);
  };

  // Save when editing event info
  const saveEditedInfo = async () => {
    console.log("Saving Edited Info:", editedInfo); // DEBUG
    if (!selectedEvent || !editedInfo) return;

    // Prepare updated event object
    const updatedEvent = {
      ...selectedEvent,
      ...editedInfo,
      start: new Date(editedInfo.start),
      end: new Date(editedInfo.end),
    };

    // Pull slected booking using JWT
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointment/${selectedEvent.event_id}`,
        {
          start: updatedEvent.start.toISOString(),
          end: updatedEvent.end.toISOString(),
          title: updatedEvent.title,
          note: updatedEvent.notes,
          no_show: updatedEvent.noShow,
          roomId: roomList.find((r) => r.id === updatedEvent.room)?.dbId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update event
      const updatedBooked = bookedEvents.map((event) =>
        event.event_id === selectedEvent.event_id ? updatedEvent : event
      );
      setBookedEvents(updatedBooked);
      closePopup();
    } catch (error) {
      console.error("Error updating appointment:", error);
      setAlert({
        message: "Failed to update appointment. Please try again.",
        type: "error",
      });
    }
  };

  // Close popup, reset selected event
  const closePopup = () => {
    setSelectedEvent(null);
    setEditedInfo("");
  };

  // Search patient by ID
  const handleSearchWindow = () => {
    const patient = apiUserList.find(
      (p) => p.record_id === searchPatientId.trim()
    );
    if (!patient) {
      setAlert({ message: "Patient with that ID not found", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    // If trying to book another appointment
    if (["booked"].includes(patient.type)) {
      setAlert({
        message: "This patient's visit is already booked or scheduled.",
        type: "error",
      });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    if (!patient.nicu_dob) {
      setAlert({
        message:
          "Patient has no Date of Birth recorded, cannot generate visit windows.",
        type: "error",
      });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

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

    const getWindowDates = (visit_num) => {
      switch (visit_num) {
        case 2:
          return { start: patient.reg_date1, end: patient.reg_date2 };
        case 3:
          return {
            start: patient.reg_9_month_window,
            end: patient.reg_12_month_window,
          };
        case 4:
          return {
            start: patient.reg_17_month_window,
            end: patient.reg_19_month_window,
          };
        case 5:
          return {
            start: patient.reg_23_month_window,
            end: patient.reg_25_month_window,
          };
        case 6:
          return {
            start: patient.reg_30_month_window,
            end: patient.reg_31_month_window,
          };
        default:
          return null;
      }
    };

    const windowDates = getWindowDates(visit_num);

    if (windowDates) {
      const { start, end } = windowDates;
      const windowStart = new Date(start);
      const windowEnd = new Date(end);

      const studyWindow = {
        title: `Visit ${visit_num} Window`,
        start: windowStart,
        end: windowEnd,
        type: "window",
        id: patient.record_id,
        Name: `Patient ${patient.record_id}`,
      };

      setWindowEvents([studyWindow]);

      // Navigate calendar to the window start date
      setDate(new Date(studyWindow.start));
      setView("month");

      setAlert({
        message: `Found patient: - Showing visit window`,
        type: "success",
      });
    } else {
      setWindowEvents([]);
      setAlert({
        message: "No upcoming visit windows for this patient.",
        type: "info",
      });
    }

    setCurrentPatient({ ...patient, visitNum: visit_num });
  };

  // If booking within study window
  const isAppointmentWithinVisitWindow = (appointment, patient) => {
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

    const getWindowDates = (visit_num) => {
      switch (visit_num) {
        case 2:
          return { start: patient.reg_date1, end: patient.reg_date2 };
        case 3:
          return {
            start: patient.reg_9_month_window,
            end: patient.reg_12_month_window,
          };
        case 4:
          return {
            start: patient.reg_17_month_window,
            end: patient.reg_19_month_window,
          };
        case 5:
          return {
            start: patient.reg_23_month_window,
            end: patient.reg_25_month_window,
          };
        case 6:
          return {
            start: patient.reg_30_month_window,
            end: patient.reg_31_month_window,
          };
        default:
          return null;
      }
    };

    const windowDates = getWindowDates(visit_num);

    if (windowDates) {
      const { start, end } = windowDates;
      const windowStart = new Date(start);
      const windowEnd = new Date(end);
      const appointmentDate = new Date(appointment.start);

      // Set hours to 0 to compare dates only
      windowStart.setHours(0, 0, 0, 0);
      windowEnd.setHours(23, 59, 59, 999);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate >= windowStart && appointmentDate <= windowEnd;
    }

    return false;
  };

  // If confirm on outside study window pop up
  const proceedWithOutOfWindowBooking = () => {
    if (!pendingAppointment) return;
    handleAddAppointment(pendingAppointment, true); // override
    setOutsideWindowPopupOpen(false);
    setPopupOpen(false);
    setPendingAppointment(null);
  };

  // Clear search and window on calender
  const handleClearWindow = () => {
    setWindowEvents([]);
    setSearchPatientId("");
    setCurrentPatient(null);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete?.event_id) {
      console.error("Missing event_id on event", eventToDelete);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/appointment/${eventToDelete.event_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEvents = bookedEvents.filter(
        (event) => event.event_id !== eventToDelete.event_id
      );
      setBookedEvents(updatedEvents);
      setPopupOpen(false);
      setEventToDelete(null);
      closePopup();
      refetchData(); // Re-fetch patient data to update visit windows
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setAlert({
        message: "Failed to delete appointment. Please try again.",
        type: "error",
      });
    }
  };

  // Store event clicked on and open pop up for delete
  const handleEventClick = (event) => {
    setEventToDelete(event);
    setPopupOpen(true);
  };

  // Store event clicked on and open pop up for delete
  const handleEventAdd = () => {
    setAppOpen(true);
  };

  // Sets current date and time
  const localizer = momentLocalizer(moment);

  // Function to add appointment
  const handleAddAppointment = async (appointment, override = false) => {
    const patientId = appointment.patientId;
    const match = userList.find((p) => p.record_id === patientId);

    if (!match) {
      setAlert({ message: "Patient with that ID not found", type: "error" });
      setCurrentPatient(null);
      setWindowEvents([]);
      return;
    }

    // Check if the appointment is within the visit window
    if (!override && !isAppointmentWithinVisitWindow(appointment, match)) {
      setPendingAppointment(appointment);
      setOutsideWindowPopupOpen(true);
      return; // Stop here, wait for user confirmation
    }

    try {
      await axios.post("http://localhost:5000/api/book", appointment, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      await fetchBookings();
      refetchData(); // Re-fetch patient data to update visit windows and visit numbers

      setAlert({ message: "Appointment booked successfully", type: "success" });
    } catch (error) {
      console.error("Error booking appointment: ", error);
      setAlert({ message: "Error booking appointment: ", type: "error" });
    }

    setAppOpen(false);
  };

  // Replace study filter state with rooms filter
  const [selectedRooms, setSelectedRooms] = useState(
    roomList.map((room) => room.id)
  );

  // Handler for room checkbox change
  const handleRoomChange = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((r) => r !== roomId)
        : [...prev, roomId]
    );
  };

  const isDateBlocked = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return blockedDates.some(
      (blockedDate) =>
        moment(blockedDate.start).format("YYYY-MM-DD") === formattedDate
    );
  };

  const isTimeSlotBooked = (date, eventIdToExclude) => {
    const selectedStartTime = moment(date).valueOf();

    return bookedEvents.some((booking) => {
      if (booking.event_id === eventIdToExclude) return false;

      const bookingStartTime = moment(booking.start).valueOf();
      const bookingEndTime = moment(booking.end).valueOf();

      return (
        selectedStartTime >= bookingStartTime &&
        selectedStartTime < bookingEndTime
      );
    });
  };

  const shouldDisableDate = (date) => {
    return isDateBlocked(date);
  };

  const shouldDisableTime = (time, clockType) => {
    if (isTimeSlotBooked(time, selectedEvent?.event_id)) {
      return true;
    }
    return false;
  };

  // Array of all avents
  const allEvents = [...bookedEvents, ...windowEvents, ...blockedDates];

  const filteredAppointments = useMemo(() => {
    return allEvents.filter((event) => {
      if (event.blocked) return true;
      if (event.type === "window") return true; // Always show windows
      return selectedRooms.includes(event.room); // Filter booked by room
    });
  }, [allEvents, selectedRooms]);

  //-------------------------------------------HTML------------------------------------------------------------------

  // API loading or error message if encountered
  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error loading appointments: {error.message}</div>;

  return (
    <div className="CalBody">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/**CALENDER*/}
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={filteredAppointments}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={combinedEventGetter}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectSlot={(slotInfo) => {
            setDate(slotInfo.start);
            setView("day");
          }}
          onSelectEvent={handleSelectEvent}
          selectable
          views={["month", "week", "day", "agenda"]}
          components={{
            event: ({ event }) => (
              <div>
                {event.title}
                {event.event_type === "booked" && (
                  <div style={{ fontSize: 14 }}>
                    <strong>
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>{" "}
                    -{" "}
                    <strong>
                      {new Date(event.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
                  </div>
                )}
                <div style={{ fontSize: 12 }}>
                  <strong>{event.note}</strong>
                </div>{" "}
                {/* Show description here */}
              </div>
            ),
            toolbar: CustomToolbar,
            dateCellWrapper: (props) => (
              <ClickableDateCell
                {...props}
                onSelectSlot={(slot) => {
                  setDate(slot.start);
                  setView("day");
                }}
              />
            ),
          }}
        />
      </div>

      <div className="floatContainer">
        {/**WINDOW SEARCH*/}
        <div className="floatChild">
          <h4>Show Event Types</h4>
          <div className="filter-row">
            <div className="windowView">
              <label>
                View Patient Window:
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  value={searchPatientId}
                  onChange={(e) => setSearchPatientId(e.target.value)}
                />
                <div className="button-row">
                  <button
                    className="search-button"
                    onClick={handleSearchWindow}
                  >
                    Search Window
                  </button>
                  <button className="clear-button" onClick={handleClearWindow}>
                    Clear Window
                  </button>
                </div>
                <div className="blockContainer">
                  <label>
                    Select Date to Block:
                    <DatePicker // date input for app
                      views={["day", "month", "year"]}
                      value={selectedDate}
                      onChange={handleDateChange}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          id: "date",
                          required: true,
                          fullWidth: true,
                        },
                      }}
                    />
                  </label>
                  <div className="button-row">
                    <button onClick={handleBlockDate} className="block-button">
                      {" "}
                      Block Date
                    </button>
                    <button
                      onClick={handleShowBlockedDates}
                      className="block-button"
                    >
                      {showBlockedDates ? "Hide" : "Show"} blocked dates
                    </button>
                  </div>
                  {showBlockedDates && (
                    <ul>
                      {blockedDates.map((date, index) => (
                        <li key={index}>
                          {moment(date.start).format("YYYY-MM-DD")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </label>
              {/**DISPLAYS PATIENT WHEN SEARCHED IN WINDOW*/}
              {currentPatient && (
                <div className="patientInfo">
                  <h4>Patient Info</h4>
                  <p>
                    <b>ID:</b> {currentPatient.id}
                  </p>
                  <p>
                    <b>Visit Number:</b> {currentPatient.visitNum}
                  </p>
                  <p>
                    <b>DOB:</b>{" "}
                    {new Date(currentPatient.DOB).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {/**COLLAPSABLE FILTER BOX*/}
          <div className="floatChild">
            <ul>
              <li>
                <div>
                  <b>Room Filter</b>
                </div>
                {/**DISPLAYS FILTERS USING LOOP*/}
                <ul>
                  {roomList.map((room) => (
                    <li key={room.id}>
                      <div className="filter-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedRooms.includes(room.id)}
                            onChange={() => handleRoomChange(room.id)}
                            className={room.id}
                          />
                          {room.label}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className="floatButton">
          <h4>Book an Appointment</h4>

          <button className="appButton" onClick={handleEventAdd}>
            <CiCalendar className="bookIcon" />
          </button>
          <div className="patientInfo">
            <p>
              <strong>Tip:</strong> Click the calendar icon to add a new
              appointment.
            </p>
            <p>Use the filter to the left to specify room viewings.</p>
            <p>
              And try out the search window or block features to view patient
              visit windows and block dates for your schedule.
            </p>
          </div>
        </div>
      </div>

      {/**EDIT POPUP*/}
      {selectedEvent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>
                Edit Event for {selectedEvent.Name || selectedEvent.title}
              </h3>
            </div>
            <label>
              Title:
              <input
                type="text"
                value={editedInfo.title}
                onChange={(e) =>
                  setEditedInfo((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </label>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Start Time"
                value={editedInfo.start}
                onChange={(newValue) =>
                  setEditedInfo((prev) => ({ ...prev, start: newValue }))
                }
                shouldDisableDate={shouldDisableDate}
                shouldDisableTime={shouldDisableTime}
                ampm={false}
              />
              <DateTimePicker
                label="End Time"
                value={editedInfo.end}
                onChange={(newValue) =>
                  setEditedInfo((prev) => ({ ...prev, end: newValue }))
                }
                shouldDisableDate={shouldDisableDate}
                shouldDisableTime={shouldDisableTime}
                ampm={false}
              />
            </LocalizationProvider>

            <label>
              Room:
              <select
                id="room"
                name="room"
                value={editedInfo.room}
                onChange={(e) =>
                  setEditedInfo((prev) => ({ ...prev, room: e.target.value }))
                }
              >
                <option value="">-- Select Room --</option>
                <option value="TeleRoom">Telemetry Room (Room 2.10)</option>
                <option value="room1">Assessment Room 1</option>
                <option value="room2">Assessment Room 2</option>
                <option value="room3">Assessment Room 3</option>
                <option value="room4">Assessment Room 4</option>
                <option value="devRoom">
                  Developmental Assessment Room (Room 2.07)
                </option>
              </select>
            </label>

            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={editedInfo.noShow}
                onChange={handleNoShowChange}
              />
              <span className="noshow-check"></span>
              Mark as No-Show / Cancelled
            </label>

            {showRebookingForm && selectedEvent && (
              <RebookingForm
                event={selectedEvent}
                onSave={(updatedEvent) => {
                  handleUpdateEvent(updatedEvent);
                  setShowRebookingForm(false);
                }}
                onCancel={() => setShowRebookingForm(false)}
                blockedDates={blockedDates}
                bookedEvents={bookedEvents}
              />
            )}

            <div className="button-row">
              <button onClick={saveEditedInfo} className="confirm-button">
                Save
              </button>
              <button onClick={closePopup} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={() => handleEventClick(selectedEvent)}
                className="delete-button"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/**DELETE POPUP*/}
      <PopUp
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={() => {
          confirmDeleteEvent();
        }}
        message={`Delete ${selectedEvent?.title || "this event"} for ${
          selectedEvent?.patientId || "Unknown ID"
        }?`}
        option1="Confirm"
        option2="Cancel"
      />
      {/*EDIT POPUP*/}
      <PopUp
        isOpen={rebookPopupOpen}
        onClose={() => setRebookPopupOpen(false)}
        onConfirm={() => {
          openBookingFormWithPrefill(eventToRebook);
          setRebookPopupOpen(false);
        }}
        message={`This event was marked as a no-show. Would you like to rebook for ${
          eventToRebook?.patientId || "this patient"
        }?`}
        option1="Yes"
        option2="No"
      />

      {/**APPOINTMENT BOOKING FORM*/}
      <div className="AppointmentToggle">
        <ToggleAppointment
          onAddAppointment={handleAddAppointment}
          isOpen={appOpen}
          onClose={() => setAppOpen(false)}
          bookedEvents={bookedEvents}
          blockedDates={blockedDates}
          roomList={roomList}
        />
      </div>

      {/**Pop up for window booking warning*/}
      <PopUp
        isOpen={outsideWindowPopupOpen}
        onClose={() => setOutsideWindowPopupOpen(false)}
        onConfirm={proceedWithOutOfWindowBooking}
        message={`This event for patient ${pendingAppointment?.patientId} is outside of the visit window. Do you wish to proceed?`}
        option1="Confirm"
        option2="Cancel"
      />
    </div>
  );
};

export default MyCalendar;
