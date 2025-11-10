import React, { useState } from 'react';
import './RebookingForm.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';

const RebookingForm = ({ event, onSave, onCancel, blockedDates = [], bookedEvents = [] }) => {
    const [newStart, setNewStart] = useState(moment(event.start));
    const [newEnd, setNewEnd] = useState(moment(event.end));
    const [noShowComment, setNoShowComment] = useState(event.noShowComment || "");

    const handleSubmit = () => {
        const updatedEvent = {
            ...event,
            start: newStart.toDate(),
            end: newEnd.toDate(),
            noShow: true,
            noShowComment,
        };
        onSave(updatedEvent);
    };

    const isDateBlocked = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return blockedDates.some(blockedDate => moment(blockedDate.start).format('YYYY-MM-DD') === formattedDate);
    };

    const isTimeSlotBooked = (date) => {
        const selectedStartTime = newStart.valueOf();
        const selectedEndTime = newEnd.valueOf();

        return bookedEvents.some(booking => {
            const bookingStartTime = moment(booking.start).valueOf();
            const bookingEndTime = moment(booking.end).valueOf();

            // Check for overlap
            return (
                (selectedStartTime >= bookingStartTime && selectedStartTime < bookingEndTime) ||
                (selectedEndTime > bookingStartTime && selectedEndTime <= bookingEndTime) ||
                (selectedStartTime <= bookingStartTime && selectedEndTime >= bookingEndTime)
            );
        });
    };

    const shouldDisableDate = (date) => {
        return isDateBlocked(date);
    };

    const shouldDisableTime = (time, clockType) => {
        if (isTimeSlotBooked(time)) {
            return true;
        }
        return false;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="title">Reschedule Event</h3>
                <p><strong>Title: </strong>{event.title}</p>

                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        label="New Start Time"
                        value={newStart}
                        onChange={(newValue) => setNewStart(newValue)}
                        shouldDisableDate={shouldDisableDate}
                        shouldDisableTime={shouldDisableTime}
                        ampm={false}
                    />
                    <DateTimePicker
                        label="New End Time"
                        value={newEnd}
                        onChange={(newValue) => setNewEnd(newValue)}
                        shouldDisableDate={shouldDisableDate}
                        shouldDisableTime={shouldDisableTime}
                        ampm={false}
                    />
                </LocalizationProvider>

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