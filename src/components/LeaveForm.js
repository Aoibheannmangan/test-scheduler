import React, { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const LeaveForm = ({ onSave, onClose }) => {
  const [leaveName, setLeaveName] = useState("");
  const [leaveStart, setLeaveStart] = useState(null);
  const [leaveEnd, setLeaveEnd] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!leaveStart || !leaveEnd) {
      return alert("Please select both start and end time.");
    }
    if (leaveEnd.isSameOrBefore(leaveStart)) {
      return alert("End must be after start.");
    }

    const leaveEvent = {
      title: `Leave - ${leaveName}`,
      start: leaveStart.toISOString(),
      end: leaveEnd.toISOString(),
      leave: true,
      event_type: "leave",
      name: leaveName
    };

    onSave(leaveEvent);
  };

  return (
    <div className="Leave-overlay">
      <div className="Leave-content">
        <form onSubmit={handleSubmit}>
          <label>
            Staff Name:
            <input
              type="text"
              value={leaveName}
              onChange={(e) => setLeaveName(e.target.value)}
              required
            />
          </label>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <label>
              Start:
              <DateTimePicker
                value={leaveStart}
                onChange={(v) => setLeaveStart(v)}
                ampm={false}
              />
            </label>

            <label>
              End:
              <DateTimePicker
                value={leaveEnd}
                onChange={(v) => setLeaveEnd(v)}
                ampm={false}
              />
            </label>
          </LocalizationProvider>

          <button type="submit">Save Leave</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
