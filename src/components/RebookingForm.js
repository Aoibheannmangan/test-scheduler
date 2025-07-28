import React, { useState } from 'react';
import './RebookingForm.css';

const RebookingForm = ({ event, onSave, onCancel }) => {
    const [newStart, setNewStart] = useState(event.start);
    const [newEnd, setNewEnd] = useState(event.end);
    const [noShowComment, setNoShowComment] = useState(event.noShowComment || "");

    const handleSubmit = () => {
        const updatedEvent = {
            ...event,
            start: new Date(newStart),
            end: new Date(newEnd),
            noShow: true,
            noShowComment,
        };
        onSave(updatedEvent);
    };

    return ( 
        <div className="modal-overlay">
            <div className = "modal-content">
                <h3>Reschedule Event</h3>
                <p><strong>Title: </strong>{event.title}</p>

                <label>New Start Time:</label>
                <input
                    type="datetime-local"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                />

                <label>New End Time:</label>
                <input 
                    type="datetime-local"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                />

                <label>Reason for Cancellation / No-Show: </label>
                <input 
                    type="text"
                    value={noShowComment}
                    onChange={(e) => setNoShowComment(e.target.value)}
                    placeholder="e.g. Unexpected emergency"
                />

                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Save Changes</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
        
    );
};

export default RebookingForm;