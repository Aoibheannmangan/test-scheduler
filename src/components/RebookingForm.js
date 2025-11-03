import React, { useState, useMemo } from 'react';
import './RebookingForm.css';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const RebookingForm = ({ event, onSave, onCancel }) => {
    const [newDate, setNewDate] = useState(dayjs(event.start).format("YYYY-MM-DD"));
    const [newStart, setNewStart] = useState(dayjs(event.start));
    const [newEnd, setNewEnd] = useState(dayjs(event.end));
    const [noShowComment, setNoShowComment] = useState(event.noShowComment || "");

     const start = useMemo(() => {
        if (!newDate || !newStart || !dayjs.isDayjs(newStart)) return null;
        return dayjs(`${newDate}T${newStart.format("HH:mm")}`).toDate();
      }, [newDate, newStart]);
    
      const end = useMemo(() => {
        if (!newDate || !newEnd || !dayjs.isDayjs(newEnd)) return null;
        return dayjs(`${newDate}T${newEnd.format("HH:mm")}`).toDate();
      }, [newDate, newEnd]);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newStart || !dayjs.isDayjs(newStart)) {
            alert("Please select a start time");
            return;
        }
        if (!newEnd || !dayjs.isDayjs(newEnd)) {
            alert("Please select an end time");
            return;
        }

        const start = dayjs(newDate)
            .set("hour", newStart.hour())
            .set("minute", newStart.minute())
            .set("second", 0)
            .set("millisecond", 0)
            .toDate();
        
        const end = dayjs(newDate)
            .set("hour", newEnd.hour())
            .set("minute", newEnd.minute())
            .set("second", 0)
            .set("millisecond", 0)
            .toDate();

        const updatedEvent = {
            ...event,
            start,
            end,
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
                <input
                    type="datetime-local"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                />
                <TimePicker
                    label="New Start Time"
                    value={newStart}
                    minutesStep={30}
                    skipDisabled={true}
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    onChange={(newValue) => {setNewStart(newValue)}}
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
                <TimePicker 
                    label="New End Time"
                    value={newEnd}
                    minutesStep={30}
                    skipDisabled={true} 
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    onChange={(newValue) => { setNewEnd(newValue)}}
                    slotProps = {{
                        textField: {
                            id: "newEndTime",
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
                <br />

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