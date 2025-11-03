import React, { useState } from 'react';
import './RebookingForm.css';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

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
                <h3 className="title">Reschedule Event</h3>
                <p><strong>Title: </strong>{event.title}</p>

                <label>New Start Time:</label>
                <TimePicker
                    label="New Start Time"
                    minutesStep={30}
                    skipDisabled={true}
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    type="datetime-local"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    slotProps={{
                        textField: {
                            id: "newStartTime",
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
                    <button onClick={handleSubmit} className="resubmit-button">Save</button>
                    <button onClick={onCancel} className="recancel-button">Cancel</button>
                </div>
            </div>
        </div>
        
    );
};

export default RebookingForm;