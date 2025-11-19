import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./AppointView.css";
import { useAppointmentFilters } from "../hooks/useAppointmentFilters";
import "../components/useAppointmentFilters.css";
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

      const events = response.data.events.map((event) => {
        return {
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          id: event.patient_id, // Map patient_id to id
        };
      });

      setBookedEvents(events);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  // In use effect as it runs when component mounts
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    // Debug line -> console.log("API user list received:", apiUserList);
    if (userList && Array.isArray(apiUserList)) {
      // Map API fields to appointment fields
      const mapped = apiUserList.map((rec) => {
        let visit_num = 1;
        if (rec.visit_1_nicu_discharge_complete === "1") {
          visit_num = 2;
          for (let i = 2; i <= 6; i++) {
            if (rec[`v${i}_attend`] === "1") {
              visit_num = i + 1;
            } else {
              break;
            }
          }
        }
        return {
          id: rec.record_id || "",
          type: rec.type || "window", // All are windows unless you have appointment info
          visit_num: visit_num,
          OutOfArea: rec.reg_ooa === "1",
          DOB: rec.nn_dob || "",
          site:
            {
              1: "CUMH",
              2: "Coombe",
              3: "Rotunda",
            }[rec.reg_dag] || "Unknown",
          Study: ["AIMHIGH"], // Hardcoded as it pulls from the REDCap on AIMHIGH
          DaysEarly: rec.reg_days_early ? Number(rec.reg_days_early) : 0,
          Info: "", // Any aditional info field to import??**
          notes: rec.nicu_email || "", // Use email as contact OR GET NUMBER?
          email: rec.nicu_email || "",
          participantGroup: rec.reg_participant_group || "",
          reg_date1: rec.reg_date1,
          reg_date2: rec.reg_date2,
          reg_9_month_window: rec.reg_9_month_window,
          reg_12_month_window: rec.reg_12_month_window,
          reg_17_month_window: rec.reg_17_month_window,
          reg_19_month_window: rec.reg_19_month_window,
          reg_23_month_window: rec.reg_23_month_window,
          reg_25_month_window: rec.reg_25_month_window,
          reg_30_month_window: rec.reg_30_month_window,
          reg_31_month_window: rec.reg_31_month_window,
        };
      });
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
    console.log(
      "AppointView: userList or bookedEvents changed. userList:",
      userList,
      "bookedEvents:",
      bookedEvents
    );
    if (userList.length > 0) {
      const combined = [];
      userList.forEach((redcapPatient) => {
        const patientBookedEvents = bookedEvents.filter(
          (event) => event.patient_id === redcapPatient.id
        );

        let eventToDisplay = null;

        const today = new Date();
        const bookedEvent = patientBookedEvents.find(
          (event) => event.event_type === "booked" && event.end >= today
        );
        if (bookedEvent) {
          eventToDisplay = bookedEvent;
        } else {
          // If no 'booked' event, look for a 'window' event
          const windowEvent = patientBookedEvents.find(
            (event) => event.event_type === "window"
          );
          if (windowEvent) {
            eventToDisplay = windowEvent;
          }
        }

        if (eventToDisplay) {
          combined.push({
            ...redcapPatient,
            ...eventToDisplay,
            type: eventToDisplay.event_type,
            visit_num: redcapPatient.visit_num,
            displayId: redcapPatient.id,
          });
        } else {
          combined.push({
            ...redcapPatient,
            type: "window",
            displayId: redcapPatient.id,
            visit_num: redcapPatient.visit_num, // Use redcapPatient's visit_num even if no booking
          });
        }
      });

      console.log("AppointView: Combined events:", combined);
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
              {/* Transition visit num if window */}

              {event.type === "window" &&
                (event.visit_num <= 6 ? (
                  <>
                    <span className="visitNumContainer">
                      {event.visit_num - 1}
                      {" → "}
                      {event.visit_num}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="visitNumContainer">
                      <strong>Complete</strong>
                    </span>
                  </>
                ))}

              {/* Solid visit num for booked */}
              {event.type === "booked" && (
                <>
                  <span className="visitNumContainer">{event.visit_num}</span>
                </>
              )}

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
                  month: "long",
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
                    if (event.visit_num > 6) {
                      return (
                        <div>
                          <strong>Status:</strong> Participant is complete
                        </div>
                      );
                    } else if (event.visit_num === 1) {
                      return (
                        <div>
                          <strong>Status:</strong> Participant is still in NICU
                        </div>
                      );
                    }

                    const getWindowDates = (visit_num) => {
                      switch (visit_num) {
                        case 2:
                          return {
                            start: event.reg_date1,
                            end: event.reg_date2,
                          };
                        case 3:
                          return {
                            start: event.reg_9_month_window,
                            end: event.reg_12_month_window,
                          };
                        case 4:
                          return {
                            start: event.reg_17_month_window,
                            end: event.reg_19_month_window,
                          };
                        case 5:
                          return {
                            start: event.reg_23_month_window,
                            end: event.reg_25_month_window,
                          };
                        case 6:
                          return {
                            start: event.reg_30_month_window,
                            end: event.reg_31_month_window,
                          };
                        default:
                          return null;
                      }
                    };

                    const windowDates = getWindowDates(event.visit_num);

                    if (windowDates) {
                      const { start, end } = windowDates;
                      const windowStart = new Date(start);
                      const windowEnd = new Date(end);

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const isCurrentlyActive =
                        windowStart <= today && windowEnd >= today;
                      const statusText = isCurrentlyActive ? "Current" : "Next";

                      return (
                        <div>
                          <strong>{statusText} Visit Window:</strong>{" "}
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
                    } else {
                      return (
                        <div>
                          <strong>Status:</strong> No visit windows available
                          <br />
                        </div>
                      );
                    }
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
                          ? new Date(event.start).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
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
