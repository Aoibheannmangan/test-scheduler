import React, { useState } from 'react';
import './appoint.css';
import dummyEvents from './data/dummyEvents.json';

const Appointments = () => {

    // Search Bar queries
    const [searchQuery, setSearchQuery] = useState('');

    // Convert start and end strings to Date objects
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

    // Track collapsed state for notes
    const [expandedNotes, setExpandedNotes] = useState({});

        const toggleCollapseNotes = (notes) => {
        setExpandedNotes((prev) => ({
        ...prev,
        [notes]: !prev[notes],
        }));
    };

    // Filtered appointments by searchbar
    const filteredAppointments = processedAppointments.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
        event.title.toLowerCase().includes(searchLower) ||
        event.id.toLowerCase().includes(searchLower)
    );
    });

  // ---------------------------------HTML--------------------------------------
    return (
        <div className="App">
            <h1>Visit Window Overview</h1>
      
        <div className='searchContainer'>
            <input
            type='text'
            placeholder='Search Title or ID'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', width: '220px', marginBottom: '12px' }}
            />
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

                {/*Main Info Body Dropdown*/}
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