import React, { useState, useMemo } from 'react';
import './Appointment.css';

// Toggle is not visible by default
const ToggleAppointment = ({ onAddAppointment, isOpen, onClose, bookedEvents }) => {

  // States vars for appointment booking
  const [appPatID, setAppPatID] = useState('')
  const [appDate, setAppDate] = useState('');
  const [appTimeStart, setAppTimeStart] = useState('');
  const [appTimeEnd, setAppTimeEnd] = useState('');
  const [patientStudy, setPatientStudy] = useState('');
  const [appRoom, setAppRoom] = useState('');
  const [appNote, setAppNote] = useState('');

  const roomList = {
    "TeleRoom": "Telemetry Room (Room 2.10)",
    "room1": "Assessment Room 1",
    "room2": "Assessment Room 2",
    "room3": "Assessment Room 3",
    "room4": "Assessment Room 4",
    "devRoom": "Developmental Assessment Room (Room 2.07)"
  }


  // Function to check if room is available at selected time
  const isRoomAvailable = (roomId, startTime, endTime, appointments) => {
    if (!startTime || !endTime) return true; // If no time selected, show all as available
    
    return !appointments.some(event => {
      if (event.room !== roomId) return false;
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (startTime < eventEnd) && (endTime > eventStart);
    });
  };

  // Calculate selected start and end times
  const selectedStart = useMemo(() => {
    if (!appDate || !appTimeStart) return null;
    return new Date(`${appDate}T${appTimeStart}`);
  }, [appDate, appTimeStart]);

  const selectedEnd = useMemo(() => {
    if (!appDate || !appTimeEnd) return null;
    return new Date(`${appDate}T${appTimeEnd}`);
  }, [appDate, appTimeEnd]);

  // Generate room options with availability
  const roomOptions = useMemo(() => {
    return Object.entries(roomList).map(([roomId, roomName]) => {
      const available = isRoomAvailable(roomId, selectedStart, selectedEnd, bookedEvents);
      return {
        id: roomId,
        name: roomName,
        available
      };
    });
  }, [selectedStart, selectedEnd, bookedEvents]);

  // Handles putting in a booking
  const handleSubmit = (e) => {
    e.preventDefault();


    const start = new Date(`${appDate}T${appTimeStart}`);
    const end = new Date(`${appDate}T${appTimeEnd}`);
    const appTitle = `${patientStudy.toUpperCase()} | ID: ${appPatID}`

    const newAppointment = {
      title: appTitle,
      patientId: appPatID,
      start,
      end,
      type: 'booked',
      Study: [patientStudy] || '',
      room: appRoom,
      notes: appNote,
    };

    onAddAppointment(newAppointment);
    setAppPatID('');
    setAppDate('');
    setAppTimeStart('');
    setAppTimeEnd('');
    setPatientStudy('');
    setAppRoom('');
    setAppNote('');
  };

    if (!isOpen) return null;

    return (
    <div className='Appointment-overlay'>
      <div className='Appointment-content'>

          <fieldset>
            <div className="form-border">
              <form onSubmit={handleSubmit}>

                <label htmlFor="patientID">Patient ID</label>
                <input // input for ID
                  type="text"
                  id="patID"
                  value={appPatID}
                  onChange={(e) => setAppPatID(e.target.value)}
                  placeholder="Enter Patient ID"
                  required
                />

                <label htmlFor="date">Appointment Date</label>
                <input // date input for app
                  type="date"
                  id="date"
                  value={appDate}
                  onChange={(e) => setAppDate(e.target.value)}
                  required
                />

                <label htmlFor="startTime">Start Time</label>
                <input // Start time for app. Increments in 15 mins
                  type="time"
                  id="startTime"
                  min="09:00" max="18:00"
                  step={900}
                  value={appTimeStart}
                  onChange={(e) => setAppTimeStart(e.target.value)}
                  required
                />

                <label htmlFor="endTime">End Time</label>
                <input // End time for app. Increments in 15 mins
                  type="time"
                  id="endTime"
                  min="09:00" max="18:00"
                  step={900}
                  value={appTimeEnd}
                  onChange={(e) => setAppTimeEnd(e.target.value)}
                  required
                />
                <br />

                <label htmlFor="room">Assessment Room:</label>
                <select
                  id="room"
                  name="room"
                  value={appRoom}
                  onChange={(e) => setAppRoom(e.target.value)}
                >
                <option value="" disabled>-- Select Room --</option>
                {roomOptions.map(room => (
                  <option 
                    key={room.id} 
                    value={room.id} 
                    disabled={!room.available}
                    style={{ 
                      color: room.available ? 'black' : '#999',
                      backgroundColor: room.available ? 'white' : '#f5f5f5'
                    }}
                  >
                    {room.name} {room.available ? '' : '(Unavailable)'}
                  </option>
                ))};
                </select>

                <label htmlFor="Comments">Visit Note</label>
                <textarea // input for comment
                  type="text"
                  id="comment"
                  value={appNote}
                  onChange={(e) => setAppNote(e.target.value)}
                  placeholder="Enter notes on visit"
                  required
                />

                <button className="submit-button" type='submit'>Submit</button>
                <button className="cancel-button" onClick={onClose}>Close</button>

              </form>
            </div>
          </fieldset>
        </div>
      </ div>

  );
};

export default ToggleAppointment;