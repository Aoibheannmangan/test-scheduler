import React, { useState, useEffect } from "react";
import "./AppointView.css";
import { useAppointmentFilters } from "../hooks/useAppointmentFilters";
import "../components/useAppointmentFilters.css";
import {
  generateAimHighAppointments,
  generateCoolPrimeAppointments,
  generateEDIAppointment,
} from "../hooks/windowEventCalc";
import { useData } from "../hooks/DataContext"; // <-- Import the API hook

const Appointments = () => {
  const { data: userList, loading, error } = useData();

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
  } = useAppointmentFilters(userList);
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
          <li key={event.id} className="ID_element">
            <div className="idRow">
              {/*Patient ID Row*/}
              <label
                className="patientRow"
                onClick={() => toggleCollapseIds(event.id)}
              >
                {event.type === "booked" && (
                  <>
                    {event.id} {expandedIds[event.id] ? "-" : "+"}{" "}
                    {/* Functions used to get distance from appointment and display indicator */}
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
                    {/* Make id red to indicate no booking has been made */}
                    <span className="windowTitle">
                      {event.id} {expandedIds[event.id] ? "-" : "+"}{" "}
                    </span>
                  </>
                )}
              </label>

              {/*Display Visit Number*/}
              <span className="visitNumContainer">{event.visitNum}</span>

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
                  const noteContent = event.email; // Always show email as contact

                  // Only show the section if there is actual content
                  if (!noteContent || noteContent.trim() === "") return null;

                  // Tracks id of toggled notes
                  const toggleKey = `${event.id}-notes`;

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
                          <strong>{noteContent}</strong>
                          <br />
                        </div>
                      )}
                    </>
                  );
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
