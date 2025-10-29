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
import {
  generateAimHighAppointments,
  generateCoolPrimeAppointments,
  generateEDIAppointment,
} from "../hooks/windowEventCalc";
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

  const [blockedDates, setBlockedDates] = useState(() => {
    const stored = localStorage.getItem("blockedDates");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [showBlockedDates, setShowBlockedDates] = useState(false);

  const isFirstRender = useRef(true);

  const { data: apiUserList, loading, error, updatePatient } = useData();
  const [userList, setUserList] = useState([]);

  // Grab from local storage and in storedList
  useEffect(() => {
    if (apiUserList && Array.isArray(apiUserList)) {
      const mapped = apiUserList.map((rec) => ({
        id: rec.record_id || "",
        type: "window", // All are windows unless you have appointment info
        visitNum: 1, // If you have visitNum, use it; otherwise default to 1
        OutOfArea: rec.nicu_ooa === "1",
        DOB: rec.nicu_dob || "",
        site:
          {
            1: "CUMH",
            2: "Coombe",
            3: "Rotunda",
          }[rec.nicu_dag] || "Unknown",
        Study: ["AIMHIGH"],
        DaysEarly: rec.nicu_days_early ? Number(rec.nicu_days_early) : 0,
        Info: "", // Any aditional info field to import??**
        notes: rec.nicu_email || "", // Use email as contact OR GET NUMBER?
        email: rec.nicu_email || "",
        participantGroup: rec.nicu_participant_group || "",
      }));
      setUserList(mapped);
    } else {
      setUserList([]);
    }
  }, [apiUserList]);

  useEffect(() => {
    const storedDates = localStorage.getItem("blockedDates");
    if (storedDates) {
      setBlockedDates(JSON.parse(storedDates));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blockedDates", JSON.stringify(blockedDates));
  }, [blockedDates]);

  // Open popup when clicking an event
  const handleSelectEvent = (event) => {
    // So only booked events can be altered
    if (event.type === "booked") {
      setSelectedEvent(event);
      // Copy all editable properties into editedInfo state
      setEditedInfo({
        title: event.title || "",
        start: event.start,
        end: event.end,
        room: event.room || "",
        noShow: event.noShow || false,
        noShowComment: event.noShowComment || "",
      });
    }
  };

  const handleBlockDate = () => {
    if (selectedDate) {
      const startOfDay = moment(selectedDate).startOf("day").toISOString();
      const endOfDay = moment(selectedDate).endOf("day").toISOString();

      const blockedEvent = {
        title: "Blocked",
        start: startOfDay,
        end: endOfDay,
        allDay: true,
        blocked: true,
      };

      setBlockedDates((prev) => {
        const alreadyBlocked = prev.some((evt) =>
          moment(evt.start).isSame(startOfDay, "day")
        );
        if (!alreadyBlocked) {
          const updated = [...prev, blockedEvent];
          localStorage.setItem("blockedDates", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });

      setAlert({
        message: `Blocked ${moment(selectedDate).format("YYYY-MM-DD")}`,
        type: "success",
      });
    } else {
      setAlert({ message: "Please select a date to block", type: "error" });
    }
  };

  const handleUnBlockDate = () => {
  try {
    if (!selectedDate) {
      setAlert({ message: "Please select a date to unblock", type: "error" });
      return;
    }

    const startOfDay = moment(selectedDate).startOf("day");

    setBlockedDates((prev) => {
      // Make sure prev is always an array
      const safePrev = Array.isArray(prev) ? prev : [];

      // Filter out the blocked event that matches the selected date
      const updated = safePrev.filter((evt) => {
        const evtStart = evt?.start ? moment(evt.start) : null;
        return !evtStart?.isSame(startOfDay, "day");
      });

      // Save updated blocked dates to localStorage safely
      try {
        localStorage.setItem("blockedDates", JSON.stringify(updated));
      } catch (e) {
        console.error("Error updating localStorage:", e);
      }

      // Alert user
      if (updated.length !== safePrev.length) {
        setAlert({
          message: `Unblocked ${startOfDay.format("YYYY-MM-DD")}`,
          type: "success",
        });
      } else {
        setAlert({
          message: "Selected date was not blocked",
          type: "warning",
        });
      }

      return updated;
    });
  } catch (error) {
    console.error("Error in handleUnblockDate:", error);
    setAlert({ message: "An error occurred while unblocking", type: "error" });
  }
};


  const handleShowBlockedDates = () => {
    setShowBlockedDates((prev) => !prev);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
    localStorage.setItem("bookedEvents", JSON.stringify(updatedBooked));
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
  const saveEditedInfo = () => {
    if (!selectedEvent || !editedInfo) return;
    // Prepare updated event object
    const updatedEvent = {
      ...selectedEvent,
      title: editedInfo.title,
      start: new Date(editedInfo.start),
      end: new Date(editedInfo.end),
      noShow: editedInfo.noShow || false,
      noShowComment: editedInfo.noShowComment || "",
      room: editedInfo.room,
    };

    // Update bookedEvents or windowEvents depending on type
    if (selectedEvent.type === "booked") {
      const updatedBooked = bookedEvents.map((event) =>
        event.id === selectedEvent.id &&
        new Date(event.start).getTime() ===
          new Date(selectedEvent.start).getTime()
          ? updatedEvent
          : event
      );
      // Set booked events when updated
      setBookedEvents(updatedBooked);
      // Store in local storage
      localStorage.setItem("bookedEvents", JSON.stringify(updatedBooked));
    } else if (selectedEvent.type === "window") {
      const updatedWindows = windowEvents.map((event) =>
        event.id === selectedEvent.id &&
        new Date(event.start).getTime() ===
          new Date(selectedEvent.start).getTime()
          ? updatedEvent
          : event
      );
      setWindowEvents(updatedWindows);
    }

    // If edited info and noshow selected
    if (editedInfo.noShow) {
      setEventToRebook(updatedEvent);
      setRebookPopupOpen(true);
    }

    // Save edited info and close popup
    setEditedInfo((prev) => ({
      ...prev,
      noShow: false,
    }));
    setShowRebookingForm(false);
    closePopup();
  };

  // Close popup
  const closePopup = () => {
    setSelectedEvent(null);
    setEditedInfo("");
  };

  // Search patient by ID
  const handleSearchWindow = () => {
    const patient = userList.find((p) => p.id === searchPatientId.trim());
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

    // Set current patient info
    setCurrentPatient(patient);
    const birthDate = new Date(patient.DOB);
    const babyDaysEarly = patient.DaysEarly;
    const studies = Array.isArray(patient.Study)
      ? patient.Study
      : [patient.Study];
    let studyWindows = [];

    // Loops through studies -> Create visit window
    studies.forEach((study) => {
      let generated = [];

      try {
         if (study === "AIMHIGH") {
          generated = generateAimHighAppointments(birthDate, babyDaysEarly);
        } else if (study === "COOLPRIME") {
          generated = generateCoolPrimeAppointments(birthDate, babyDaysEarly);
        } else if (study === "EDI") {
          generated = generateEDIAppointment(birthDate, babyDaysEarly);
        }
      } catch (error) {
        console.error(`Error generating appointments for study ${study}:`, error);
        generated = [];
      }

      if (!Array.isArray(generated)) generated = [];
     

      // Generate = study windows and display and set them
      const studyEvents = generated
      .filter(
        (event) =>
          event &&
          event.type === "window" &&
          event.start &&
          event.end &&
          !isNaN(new Date(event.start)) &&
          !isNaN(new Date(event.end))
      )
      .map((event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        endDate.setDate(endDate.getDate() + 1); // add one day safely

        return {
          ...event,
          title: `${study} Visit Window`,
          Name: patient.Name,
          id: patient.id,
          start: startDate,
          end: endDate, // Add by one as the calendar is exclusive to the last date
        };
      });


      studyWindows = [...studyWindows, ...studyEvents];
    });

    if (studyWindows.length === 0){
      setAlert({
        message: "No visit windows currently avaliable for this patient",
        type: "info",
      });
      setWindowEvents([]);
      return;
    }

    setWindowEvents(studyWindows);

    // Check if patient has existing booked appointments and navigate to them
    const patientBookedAppointments = bookedEvents.filter(
      (appointment) => appointment.patientId === patient.id
    );

    if (patientBookedAppointments.length > 0) {
      // Sort appointments by date and find the next upcoming appointment or the earliest one
      const now = new Date();
      const sortedAppointments = patientBookedAppointments.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );

      // Try to find next upcoming appointment, otherwise use the first one
      const nextAppointment =
        sortedAppointments.find((apt) => new Date(apt.start) >= now) ||
        sortedAppointments[0];

      // Navigate calendar to the appointment date
      setDate(new Date(nextAppointment.start));
      setView("month");

      setAlert({
        message: `Found patient: ${patient.Name} - Navigated to booked appointment`,
        type: "success",
      });
    } else if (studyWindows.length > 0) {
      // If no booked appointments, navigate to the first visit window
      const sortedWindows = studyWindows.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );
      const firstWindow = sortedWindows[0];

      // Navigate calendar to the window start date
      setDate(new Date(firstWindow.start));
      setView("day"); // Switch to day view to show the window clearly

      setAlert({
        message: `Found patient: - Showing visit window`,
        type: "success",
      });
    }
  };

  // If booking within study window
  const isAppointmentWithinVisitWindow = (appointment, patient) => {
    const birthDate = new Date(patient.DOB);
    const daysEarly = patient.DaysEarly ?? 0;
    const visitNum = patient.visitNum;
    const studies = Array.isArray(patient.Study)
      ? patient.Study
      : [patient.Study];

    // Get the appointment date (ignoring time)
    const appointmentDate = new Date(appointment.start);
    appointmentDate.setHours(0, 0, 0, 0); // Reset to start of day

    for (const study of studies) {
      let windows = [];
      if (study === "AIMHIGH") {
        windows = generateAimHighAppointments(birthDate, daysEarly, visitNum);
      } else if (study === "COOLPRIME") {
        windows = generateCoolPrimeAppointments(birthDate, daysEarly, visitNum);
      } else if (study === "EDI") {
        windows = generateEDIAppointment(birthDate, daysEarly, visitNum);
      }

      for (const window of windows) {
        // Get window start and end dates (ignoring time)
        const windowStart = new Date(window.start);
        windowStart.setHours(0, 0, 0, 0);

        const windowEnd = new Date(window.end);
        windowEnd.setHours(23, 59, 59, 999); // Set to end of day

        // Check if appointment date falls within window date range
        if (appointmentDate >= windowStart && appointmentDate <= windowEnd) {
          console.log(
            `Appointment on ${appointmentDate.toDateString()} is within window: ${windowStart.toDateString()} to ${windowEnd.toDateString()}`
          );
          return true;
        }
      }
    }

    console.log(
      `Appointment on ${appointmentDate.toDateString()} is outside all visit windows`
    );
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

  // Confirm delete on pop up, append to local storage
  const confirmDeleteEvent = () => {
    if (!eventToDelete?.patientId) {
      console.error("Missing patientId on event", eventToDelete);
      return;
    }

    const updatedEvents = bookedEvents.filter(
      (event) =>
        event.id !== eventToDelete.id || event.start !== eventToDelete.start
    );

    setBookedEvents(updatedEvents);
    localStorage.setItem("bookedEvents", JSON.stringify(updatedEvents));

    // If booking deleted then reset visit and type as its now a window again
    const updatedUser = userList.map((p) => {
      if (p.id === eventToDelete.patientId) {
        return {
          ...p,
          type: "window",
          visitNum: Math.max(1, p.visitNum - 1),
        };
      }
      return p;
    });

    // Set and store after booking delete
    setUserList(updatedUser);
    localStorage.setItem("userInfoList", JSON.stringify(updatedUser));
    setPopupOpen(false);

    // Will close edit popup if event is deleted
    closePopup();
    setEventToDelete(null);
    setShowRebookingForm(false);
    setAppOpen(false);
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

  // Create array to store booked appointments
  const [bookedEvents, setBookedEvents] = useState(() => {
    // Place in local storage + make date object to store
    const stored = localStorage.getItem("bookedEvents");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      } catch (error) {
        // Return error message
        console.error("Failed to parse bookedEvents from storage:", error);
        return [];
      }
    }
    return [];
  });

  // Sets current date and time
  const localizer = momentLocalizer(moment);

  // Function to add appointment
  const handleAddAppointment = (appointment, override = false) => {
    const patientId = appointment.patientId;
    // Find patient Id
    const match = userList.find((p) => p.id === patientId);

    const isBlocked = blockedDates.some((blocked) =>
      moment(appointment.start).isSame(blocked.start, "day")
    );

    if (isBlocked) {
      setAlert({
        message: "Cannot book appointment on a blocked date",
        type: "error",
      });
      return;
    }

    // If cant find patient id
    if (!match) {
      setAlert({
        message: `Patient ID ${patientId} not found in user list.`,
        type: "error",
      });
      return;
    }

    if (!override && !isAppointmentWithinVisitWindow(appointment, match)) {
      setPendingAppointment(appointment);
      setOutsideWindowPopupOpen(true);
      return;
    }

     // If trying to book another appointment for patient
    if (bookedEvents.some((e) => e.patientId === patientId)) {
      setAlert({
        message: "This patient already has a booked appointment.",
        type: "error",
      });
      return;
    }

    // Add new appointment object structure
    const fullAppointment = {
      ...appointment,
      title: `${match.Study}| ID: ${patientId}`,
      Study: appointment.Study || match.Study || "UNKNOWN",
      patientId,
      Name: match.Name,
      DOB: match.DOB,
      site: match.site,
      OutOfArea: match.OutOfArea,
      Info: match.Info,
      start: appointment.start, // Make an ISO object for correct parsing
      end: appointment.end, // Make an ISO object for correct parsing
      type: "booked", // As no longer window
      visitNum: match.visitNum ?? 1,
      id: patientId,
      room: appointment.room,
      notes: appointment.notes,
    };

    // Update bookedEvents state including the new appointment
    setBookedEvents(prevBooked => {
      const exists = prevBooked.some(
        evt => evt.id === fullAppointment.patientId && evt.visitNum === fullAppointment.visitNum
      );

      const updatedBooked = exists
        ? prevBooked.map(evt =>
            evt.id === fullAppointment.patientId && evt.visitNum === fullAppointment.visitNum
              ? fullAppointment
              : evt
          )
        : [...prevBooked, fullAppointment];

      // Save to localStorage with conversion to string for dates
      const updatedBookedForStorage = updatedBooked.map((evt) => {
        const start = new Date(evt.start);
        const end = new Date(evt.end);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error("Invalid start or end date:", evt);
          return evt;
        }

        return {
          ...evt,
          start: start.toISOString(),
          end: end.toISOString(),
        };
      });

      localStorage.setItem(
        "bookedEvents",
        JSON.stringify(updatedBookedForStorage)
      );

      return updatedBooked; // this updates the state
    });

    // Context updater
    updatePatient(patientId, {
      title: `${match.Study}| ID: ${patientId}`,
      type: "booked",
      visitNum: (match.visitNum ?? 1) + 1,
      start: appointment.start.toISOString(),
      end: appointment.end.toISOString(),
      notes: appointment.notes,
    });

    // Tell user appointment is booked
    setAlert({ message: "Appointment booked successfully.", type: "success" });

    setAppOpen(false);
  };

  // Selected rooms available
  const roomList = [
    { id: "TeleRoom", label: "Telemetry Room (Room 2.10)" },
    { id: "room1", label: "Assessment Room 1" },
    { id: "room2", label: "Assessment Room 2" },
    { id: "room3", label: "Assessment Room 3" },
    { id: "room4", label: "Assessment Room 4" },
    { id: "devRoom", label: "Developmental Assessment Room (Room 2.07)" },
  ];

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

  const blockedEvents = blockedDates.map((date) => {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);

    return {
      title: "Blocked",
      start,
      end,
      allDay: true,
      blocked: true,
    };
  });

  const cleanupPastAppointments = useCallback(() => {
    const now = new Date();
    let updatedBookedEvents = [...bookedEvents];
    let updatedUserList = [...userList];
    let userListChanged = false;

    updatedUserList = updatedUserList.map((user) => {
      const userAppointments = bookedEvents.filter(
        (e) => e.patientId === user.id
      );
      const latestAppointment = userAppointments.sort(
        (a, b) => new Date(b.end) - new Date(a.end)
      )[0];

      if (latestAppointment && new Date(latestAppointment.end) < now) {
        updatedBookedEvents = updatedBookedEvents.filter(
          (e) => e.id !== latestAppointment.id
        );
        userListChanged = true;

        return {
          ...user,
          type: "window",
          visitNum: (user.visitNum ?? 1) + 1,
        };
      }
      return user;
    });
    // Only update state and localStorage if changes occurred
    if (userListChanged || updatedBookedEvents.length !== bookedEvents.length) {
      setBookedEvents(updatedBookedEvents);
      setUserList(updatedUserList);

      localStorage.setItem("bookedEvents", JSON.stringify(updatedBookedEvents));
      localStorage.setItem("userInfoList", JSON.stringify(updatedUserList));
    }
  }, [bookedEvents, userList]);

  // Run on state changes
  useEffect(() => {
    cleanupPastAppointments();
  }, [cleanupPastAppointments]);

  // Run automatically every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      cleanupPastAppointments();
    }, 15 * 60 * 1000); // 15 mins in ms

    return () => clearInterval(interval); // cleanup on unmount
  }, [cleanupPastAppointments]);

  // Array of all avents
  const allEvents = [...bookedEvents, ...windowEvents, ...blockedEvents];

  const filteredAppointments = useMemo(() => {
    return allEvents.filter((event) => {
      if (event.blocked) return true;
      if (event.type === "window") return true; // Always show windows
      return selectedRooms.includes(event.room); // Filter booked by room
    });
  }, [allEvents, selectedRooms]);

  const dayPropGetter = (date) => {
    const isBlocked = blockedDates.some((evt) => moment(date).isSame(evt.start, "day"));
    if (isBlocked) {
      return {
        style: { backgroundColor: "#ff0015ff" }, 
        className: "blocked-date-cell",
      };
    };

    return{};
  }

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
          dayPropGetter={dayPropGetter}
          blockedDates={blockedDates}
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
                <div style={{ fontSize: 12 }}>
                  <strong>{event.notes}</strong>
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
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
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
                    <button className="block-button" onClick={handleUnBlockDate}>
                      Unblock Date
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

            <label>
              Start:
              <input
                type="datetime-local"
                value={moment(editedInfo.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setEditedInfo((prev) => ({
                    ...prev,
                    start: new Date(e.target.value),
                  }))
                }
                className="date-edit"
              />
            </label>

            <label>
              End:
              <input
                type="datetime-local"
                value={moment(editedInfo.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setEditedInfo((prev) => ({
                    ...prev,
                    end: new Date(e.target.value),
                  }))
                }
                className="date-edit"
              />
            </label>

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
        message={`Delete ${eventToDelete?.title || "this event"} for ${
          eventToDelete?.patientId || "Unknown ID"
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
