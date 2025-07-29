import React, { useState, useEffect } from 'react';
import './appoint.css';
import { useAppointmentFilters } from './components/useAppointmentFilters';
import './components/useAppointmentFilters.css'
import { generateAimHighAppointments, generateCoolPrimeAppointments, generateEDIAppointment } from './data/windowEventCalc';

const Appointments = () => {

    //Local storage grab
    const [userList, setUserList] = useState([]);

     useEffect(() => {
        const storedList = localStorage.getItem("userInfoList");
        if (storedList) {
            const parsedList = JSON.parse(storedList);

            // Hydrate dates only for booked events
            const hydrated = parsedList.map(event => {
            if (event.type === 'booked') {
                return {
                ...event,
                start: new Date(event.start).toISOString(), //force to ISO/ UTC format
                end: new Date(event.end).toISOString(), //force to ISO/ UTC format
                };
            }
            return event;
            });
            setUserList(hydrated);
        }
    }, []);

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
        return appointmentDate <= oneMonthFromNow && appointmentDate > oneWeekFromNow;
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

        const toggleCollapseNotes = (notes) => {
        setExpandedNotes((prev) => ({
        ...prev,
        [notes]: !prev[notes],
        }));
    };

    // Extracts search and filter-related data and functions from useAppointmentFilters to manage appointment filtering.
    const {
    searchQuery,
    setSearchQuery,
    selectedStudies,
    handleStudyChange,
    filteredAppointments
    } = useAppointmentFilters(userList);
  // ---------------------------------HTML--------------------------------------
    return (
        <div className="App">
            <h1>Visit Overview</h1>
        {/*Container for searchbar and filter*/}
        <div className='searchContainer'>
            <input
            className='searchBar'
            type='text'
            placeholder='Search Title or ID'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', width: '220px', marginBottom: '12px' }}
            />
            
            {/*Filter boxes*/}
            <div className="filterRowBox">
                <div className="filter-checkbox">
                    <label>
                    <input 
                        className='AHCheck'
                        type="checkbox"
                        checked={selectedStudies.includes('AIMHIGH')}
                        onChange={() => handleStudyChange('AIMHIGH')}
                    />
                    AIMHIGH
                    </label>
                </div>

                <div className="filter-checkbox">
                    <label>
                    <input 
                        className='CPCheck'
                        type="checkbox"
                        checked={selectedStudies.includes('COOLPRIME')}
                        onChange={() => handleStudyChange('COOLPRIME')}
                    />
                    COOLPRIME
                    </label>
                </div>

                <div className="filter-checkbox">
                    <label>
                    <input 
                        className='EDICheck'
                        type="checkbox"
                        checked={selectedStudies.includes('EDI')}
                        onChange={() => handleStudyChange('EDI')}
                    />
                    EDI
                    </label>
                </div>
                </div>
            
        </div>

        <ul className="appointmentList">
            <li className='headings-row'>
            <div className='heading-left'><strong>Patient ID</strong></div>
            <div className='heading-center'><strong>Visit No.</strong></div>
            <div className='heading-right'><strong>Kildare</strong></div>
            </li>

            {filteredAppointments.map((event) => (
            <li key={event.id} className="ID_element">
                <div 
                className='idRow'>
                    {/*Patient ID Row*/}
                    <label
                    className='patientRow'
                    onClick={() => toggleCollapseIds(event.id)}
                    >
                        {event.type === 'booked' && (
                            <>
                                {event.id} {expandedIds[event.id] ? '-' : '+'} {' '}
                                {/* Functions used to get distance from appointment and display indicator */}
                                {event.start && isFarAway(event.start) && (
                                    <span className='farNotifier' title='More than a month away' />
                                )}
                                {event.start && isMid(event.start) && (
                                    <span className='midNotifier' title='Between a week and a month away' />
                                )}
                                {event.start && isClose(event.start) && (
                                    <span className='closeNotifier' title='Within a week' />
                                )}
                            </>   
                        )}
                        {event.type === 'window' && (
                            <>
                                {/* Make id red to indicate no booking has been made */}
                                <span className='windowTitle'>{event.id} {expandedIds[event.id] ? '-' : '+'} {' '}</span>
                            </>   
                        )}
                    </label>
                            
                    {/*Display Visit Number*/}
                    <span className='visitNumContainer'>
                        {event.visitNum}
                    </span>
                                

                    {/*Put notifier under OOA - (Out Of Area)*/}
                    <div 
                    className='dotContainer'>
                    {event.OutOfArea === true ? (
                        <span className='OoaNotifier' title='Out Of Area' />
                    ) : (
                        <span style={{ visibility: 'hidden' }} className='OoaNotifier'></span>
                    )}
                    </div>
                </div>

                {/*Main Info Body when expanded*/}
                {expandedIds[event.id] && (
                <div className="info">
                    <strong>{event.Study}{'| '}{event.id}</strong><br />
                    <strong>Name:</strong> {event.Name}<br />
                    <strong>Date of Birth: </strong>

                    {/*Format date of birth*/}
                    {new Date(event.DOB).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    <br />

                    <strong>Location:</strong> {event.site}<br />
                    <strong>Study:</strong> {event.Study}<br />

                    {/*Visit window in info if a window patient*/}
                    {event.type === "window" && (() => {
                    const birthDate = new Date(event.DOB);
                    const daysEarly = event.DaysEarly || 0;
                    let windowData = [];

                    if (event.Study === 'AIMHIGH') {
                        windowData = generateAimHighAppointments(birthDate, daysEarly);
                    } else if (event.Study === 'COOLPRIME') {
                        windowData = generateCoolPrimeAppointments(birthDate, daysEarly);
                    } else if (event.Study === 'EDI') {
                        windowData = generateEDIAppointment(birthDate, daysEarly)
                    }

                    const { start, end } = windowData[0];

                    return (
                        <div>
                        <strong>Visit Window:</strong>{' '}
                        {new Date(start).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}{' '}
                        –{' '}
                        {new Date(end).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                        <br />
                        </div>
                    );
                    })()}

                    
                    {/*Visit window in info if a booked patient
                    Displays date of app and time from and to*/}
                    {event.type === "booked" && (() => {

                    console.log("Rendering event:", event);


                    return (
                        <div>
                        <strong>Appointment Date:</strong>{' '}
                        {event.start ? new Date(event.start).toLocaleDateString() : 'N/A'}
                        <br />
                        <strong>Time of Appointment:</strong>{' '}
                        {event.start && event.end
                            ? `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : 'N/A'}
                        <br />
                        </div>
                    );
                    })()}


                    {/*Additional Notes Dropdown*/}
                    {(() => {
                        const noteContent = event.type === 'booked' ? event.notes : event.Info; // If the event is booked switch between notes (appointment notes) and Info (Info made at regestration... will update between visits)

                        // Only show the section if there is actual content
                        if (!noteContent || noteContent.trim() === '') return null;

                        // Tracks id of toggled notes
                        const toggleKey = `${event.id}-notes`;

                        return (
                            <>
                                <label
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() =>
                                        setExpandedNotes(prev => ({
                                            ...prev,
                                            [toggleKey]: !prev[toggleKey]
                                        }))
                                    }
                                >
                                    Additional Notes: {expandedNotes[toggleKey] ? '-' : '+'}
                                </label>

                                
                                {expandedNotes[toggleKey] && (
                                    <div className="info">
                                        <strong>{noteContent}</strong><br />
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