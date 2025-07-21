import React, { useState } from 'react';
import './appoint.css';
import dummyEvents from './data/dummyEvents.json'; // Dummy data needs to be replaced with actual data in proper DB
import { useAppointmentFilters } from './components/useAppointmentFilters';
import './components/useAppointmentFilters.css'

const Appointments = () => {

    // Convert start and end strings to Date objects for proper parsing
    const processedAppointments = dummyEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
    }));

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
    } = useAppointmentFilters(processedAppointments);
  // ---------------------------------HTML--------------------------------------
    return (
        <div className="App">
            <h1>Visit Window Overview</h1>
        
        {/*Container for searchbar and filter*/}
        <div className='searchContainer'>
            <input
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
            {filteredAppointments.map(event => (
            <li key={event.id} className="ID_element">
                
                {/*Patient ID Row*/}
                <label
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => toggleCollapseIds(event.id)}
                >
                Patient ID: {event.id} {expandedIds[event.id] ? '-' : '+'}
                </label>

                {/*Main Info Body when expanded*/}
                {expandedIds[event.id] && (
                <div className="info">
                    <strong>{event.title}</strong><br />
                    Visit Window: {event.start.toDateString()} – {event.end.toDateString()}<br />
                    Name: {event.name}<br />
                    Location: {event.location}<br />
                    Study: {event.study}<br />
                    
                    {/*Additional Notes Dropdown*/}
                    <label
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => toggleCollapseNotes(event.notes)}
                        >
                        Additional Notes: {expandedNotes[event.notes] ? '-' : '+'}
                    </label>

                    {/*Shows notes when expanded*/}
                    {expandedNotes[event.notes] && (
                    <div className="info">
                        <strong>{event.notes}</strong><br />
                    </div>
                )}
                
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