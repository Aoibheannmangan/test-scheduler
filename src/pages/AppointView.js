import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./AppointView.css";
import { useAppointmentFilters } from "../hooks/useAppointmentFilters";
import "../components/useAppointmentFilters.css";
import {
  generateAimHighAppointments,
  generateCoolPrimeAppointments,
  generateEDIAppointment,
} from "../hooks/windowEventCalc";
import { useData } from "../hooks/DataContext";
import axios from "axios";

const Appointments = () => {
  /* Appointment portion */
  // Create array to store booked appointments
  const [bookedEvents, setBookedEvents] = useState([]);

  const { data: apiUserList, loading, error, updatePatient } = useData();
  const [userList, setUserList] = useState([]);

  const [allDisplayEvents, setAllDisplayEvents] = useState([]);

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

      const bookings = response.data.bookings.map((booking) => {
        const room = roomList.find((r) => r.dbId === booking.room_id);

        return {
          ...booking,
          title: booking.title,
          start: new Date(booking.start),
          end: new Date(booking.end),
          room: room ? room.id : null,
          event_type: booking.event_type,
          // Keep both patient_id and id for consistency
          patient_id: booking.patient_id,
          id: booking.patient_id, // Map patient_id to id
        };
      });

      setBookedEvents(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [roomList]);

  // In use effect as it runs when component mounts
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    // Debug line -> console.log("API user list received:", apiUserList);
    if (userList && Array.isArray(apiUserList)) {
      // Map API fields to appointment fields
      const mapped = apiUserList.map((rec) => ({
        id: rec.record_id || "",
        type: rec.type || "window", // All are windows unless you have appointment info
        visitNum: 1, // Defaults as 1
        OutOfArea: rec.nicu_ooa === "1",
        DOB: rec.nicu_dob || "",
        site:
          {
            1: "CUMH",
            2: "Coombe",
            3: "Rotunda",
          }[rec.nicu_dag] || "Unknown",
        Study: ["AIMHIGH"], // Hardcoded as it pulls from the REDCap on AIMHIGH
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

  // make a today and month away var for distance indicators
  const today = new Date();
  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(today.getMonth() + 1);

  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  const isFarAway = (date) => {
    const appointmentDate = new Date(date);
    return appointmentDate > oneMonthFromNow;
  };

  const isMid = (date) => {
    const appointmentDate = new Date(date);
    return (
      appointmentDate <= oneMonthFromNow && appointmentDate > oneWeekFromNow
    );
  };

  const isClose = (date) => {
    const appointmentDate = new Date(date);
    return appointmentDate <= oneWeekFromNow;
  };

  useEffect(() => {
    if (userList.length > 0) {
      const combined = [];
      const patientsCoveredByBookings = new Set();

      // Add all patients from REDCap
      userList.forEach((redcapPatient) => {
        // Find if this patient has a booking
        const patientBooking = bookedEvents.find(
          (booking) => booking.patient_id === redcapPatient.id
        );

        if (patientBooking) {
          // Patient has a booking - show as booked
          combined.push({
            ...patientBooking,
            type: "booked",
            DOB: redcapPatient.DOB,
            Study: redcapPatient.Study,
            site: redcapPatient.site,
            OutOfArea: redcapPatient.OutOfArea,
            email: redcapPatient.email,
            visitNum: patientBooking.visitNum,
            displayId: patientBooking.patient_id,
            // Important: Use patient_id from booking
            id: patientBooking.patient_id,
            patientId: patientBooking.patient_id,
          });
          patientsCoveredByBookings.add(redcapPatient.id);
        } else {
          // Patient doesn't have booking - show as window
          combined.push({
            ...redcapPatient,
            type: "window",
            displayId: redcapPatient.id,
            visitNum: redcapPatient.visitNum || 1,
            patientId: redcapPatient.id,
            id: redcapPatient.id, // Ensure id is consistent
          });
        }
      });

      setAllDisplayEvents(combined);
    } else {
      setAllDisplayEvents([]);
    }
  }, [userList, bookedEvents]);

  //--------------------------------------------------------------------------------------

  // Track collapsed state for IDs
  const [expandedIds, setExpandedIds] = useState({});

  const toggleCollapseIds = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Track collapsed state for notes (same logic from IDs) **TODO: Make modular**
  const [expandedNotes, setExpandedNotes] = useState({});

  // Extracts search and filter-related data and functions from useAppointmentFilters to manage appointment filtering.
  const {
    searchQuery,
    setSearchQuery,
    selectedStudies,
    handleStudyChange,
    filteredAppointments,
  } = useAppointmentFilters(allDisplayEvents);
  // ---------------------------------HTML--------------------------------------
  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error loading appointments: {error.message}</div>;

  return (
    <div className="App">
      <h1>Visit Overview</h1>
      {/*Container for searchbar and filter*/}
      <div className="searchContainer" role="region">
        <label htmlFor="searchInput" className="searchBarTitle">
          Search Patient:
        </label>
        <input
          id="searchInput"
          aria-label="searchBar"
          type="text"
          placeholder="Search ID"
          role="searchbox"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "220px",
            marginBottom: "12px",
            marginLeft: "0px",
          }}
        />

        {/*Filter boxes*/}
        <div className="filterRowBox">
          <div className="filter-checkbox">
            <label>
              <input
                aria-label="AimhighCheck"
                className="AHCheck"
                type="checkbox"
                checked={selectedStudies.includes("AIMHIGH")}
                onChange={() => handleStudyChange("AIMHIGH")}
              />
              AIMHIGH
            </label>
          </div>

          <div className="filter-checkbox">
            <label>
              <input
                aria-label="CoolprimeCheck"
                className="CPCheck"
                type="checkbox"
                checked={selectedStudies.includes("COOLPRIME")}
                onChange={() => handleStudyChange("COOLPRIME")}
              />
              COOLPRIME
            </label>
          </div>

          <div className="filter-checkbox">
            <label>
              <input
                aria-label="EDICheck"
                className="EDICheck"
                type="checkbox"
                checked={selectedStudies.includes("EDI")}
                onChange={() => handleStudyChange("EDI")}
              />
              EDI
            </label>
          </div>
        </div>
      </div>

      <ul className="appointmentList" aria-label="mainTable">
        <li className="headings-row">
          <div className="heading-left">
            <strong>Patient ID</strong>
          </div>
          <div className="heading-center">
            <strong>Visit No.</strong>
          </div>
          <div className="heading-right">
            <strong>Kildare</strong>
          </div>
        </li>

        {filteredAppointments.map((event) => (
          <li key={event.displayId || event.id} className="ID_element">
            <div className="idRow">
              {/*Patient ID Row*/}
              <label
                className="patientRow"
                onClick={() => toggleCollapseIds(event.displayId || event.id)}
              >
                {event.type === "booked" && (
                  <>
                    {event.displayId || event.id}{" "}
                    {expandedIds[event.displayId || event.id] ? "-" : "+"}{" "}
                    {/* Distance indicators */}
                    {event.start && isFarAway(event.start) && (
                      <span
                        className="farNotifier"
                        title="More than a month away"
                      />
                    )}
                    {event.start && isMid(event.start) && (
                      <span
                        className="midNotifier"
                        title="Between a week and a month away"
                      />
                    )}
                    {event.start && isClose(event.start) && (
                      <span className="closeNotifier" title="Within a week" />
                    )}
                  </>
                )}
                {event.type === "window" && (
                  <>
                    <span className="windowTitle">
                      {event.displayId || event.id}{" "}
                      {expandedIds[event.displayId || event.id] ? "-" : "+"}{" "}
                    </span>
                  </>
                )}
              </label>

              {/*Display Visit Number*/}
              <span className="visitNumContainer">
                {event.visitNum || event.visit_num}
              </span>

              {/*Put notifier under OOA - (Out Of Area)*/}
              <div className="dotContainer">
                {event.OutOfArea === true ? (
                  <span className="OoaNotifier" title="Out Of Area" />
                ) : (
                  <span
                    style={{ visibility: "hidden" }}
                    className="OoaNotifier"
                  ></span>
                )}
              </div>
            </div>

            {/*Main Info Body when expanded*/}
            {expandedIds[event.id] && (
              <div className="info">
                {/* NO NAME FIELD
                <strong>Name:</strong> {event.Name}
                <br />*/}
                <strong>Date of Birth: </strong>
                {/*Format date of birth*/}
                {new Date(event.DOB).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
                <br />
                <strong>Location:</strong> {event.site}
                <br />
                <strong>Study:</strong>{" "}
                {Array.isArray(event.Study)
                  ? event.Study.join(", ")
                  : [event.Study]}
                <br />
                {/*Visit window in info if a window patient*/}
                {event.type === "window" &&
                  (() => {
                    const birthDate = new Date(event.DOB || event.dob);
                    const daysEarly = event.DaysEarly ?? event.daysEarly ?? 0;
                    if (
                      !(birthDate instanceof Date) ||
                      isNaN(birthDate.getTime())
                    )
                      return [];

                    const studyWindows = Array.isArray(event.Study)
                      ? event.Study
                      : [event.Study];
                    return (
                      <div>
                        {studyWindows.map((study) => {
                          let windowData = [];
                          if (study === "AIMHIGH") {
                            windowData = generateAimHighAppointments(
                              birthDate,
                              daysEarly,
                              event.visitNum
                            );
                          } else if (study === "COOLPRIME") {
                            windowData = generateCoolPrimeAppointments(
                              birthDate,
                              daysEarly,
                              event.visitNum
                            );
                          } else if (study === "EDI") {
                            windowData = generateEDIAppointment(
                              birthDate,
                              daysEarly,
                              event.visitNum
                            );
                          }

                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          // Look to see ig theres an active/ upcoming window if a window hasnt ended yet

                          const activeWindow = windowData.find(
                            ({ start, end }) => {
                              const windowStart = new Date(start);
                              const windowEnd = new Date(end);

                              windowStart.setHours(0, 0, 0, 0);
                              windowEnd.setHours(23, 59, 59, 999);

                              return windowEnd >= today;
                            }
                          );

                          // If no active window found, check if there are any future windows
                          const futureWindow = windowData.find(({ start }) => {
                            const windowStart = new Date(start);
                            windowStart.setHours(0, 0, 0, 0);
                            return windowStart >= today;
                          });

                          const displayWindow = activeWindow || futureWindow;

                          if (displayWindow) {
                            const { start, end } = displayWindow;
                            const windowStart = new Date(start);
                            const windowEnd = new Date(end);

                            const isCurrentlyActive =
                              windowStart <= today && windowEnd >= today;
                            const statusText = isCurrentlyActive
                              ? "Current"
                              : "Next";

                            return (
                              <div key={study}>
                                <strong>
                                  {statusText} {study} Visit Window:
                                </strong>{" "}
                                {windowStart.toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}{" "}
                                –{" "}
                                {windowEnd.toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                                <br />
                              </div>
                            );
                          } else if (windowData.length === 0) {
                            // No generated windows (possibly due to visitNum too high)
                            return (
                              <div key={study}>
                                <strong>{study} Status:</strong> No visit
                                windows available (Visit #{event.visitNum || 1})
                                <br />
                              </div>
                            );
                          } else {
                            // All possible windows have passed
                            return (
                              <div key={study}>
                                <strong>{study} Status:</strong> All visit
                                windows have passed
                                <br />
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })()}
                {/*Visit window in info if a booked patient
                    Displays date of app and time from and to*/}
                {event.type === "booked" &&
                  (() => {
                    console.log("Rendering event:", event);

                    return (
                      <div>
                        <strong>Appointment Date:</strong>{" "}
                        {event.start
                          ? new Date(event.start).toLocaleDateString()
                          : "N/A"}
                        <br />
                        <strong>Time of Appointment:</strong>{" "}
                        {event.start && event.end
                          ? `${new Date(event.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - ${new Date(event.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "N/A"}
                        <br />
                      </div>
                    );
                  })()}
                {/*Additional Notes Dropdown*/}
                {(() => {
                  // Tracks id of toggled notes
                  const toggleKey = `${event.id}-notes`;

                  if (event.type === "window" && event.email) {
                    const emailContent = event.email; // Always show email as contact
                    return (
                      <>
                        <label
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                          onClick={() =>
                            setExpandedNotes((prev) => ({
                              ...prev,
                              [toggleKey]: !prev[toggleKey],
                            }))
                          }
                        >
                          Contact: {expandedNotes[toggleKey] ? "-" : "+"}
                        </label>

                        {expandedNotes[toggleKey] && (
                          <div className="info">
                            <strong>{emailContent}</strong>
                            <br />
                          </div>
                        )}
                      </>
                    );
                  } else if (event.note && event.type === "booked") {
                    const noteContent = event.note;
                    return (
                      <>
                        <label
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                          onClick={() =>
                            setExpandedNotes((prev) => ({
                              ...prev,
                              [toggleKey]: !prev[toggleKey],
                            }))
                          }
                        >
                          Booking Note: {expandedNotes[toggleKey] ? "-" : "+"}
                        </label>

                        {expandedNotes[toggleKey] && (
                          <div className="info">
                            <strong>{noteContent}</strong>
                            <br />
                          </div>
                        )}
                      </>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            )}
          </li>
        ))}
        {/* If no matches from search */}
        {filteredAppointments.length === 0 && (
          <p> No matching appointments found.</p>
        )}
      </ul>
    </div>
  );
};

export default Appointments;
