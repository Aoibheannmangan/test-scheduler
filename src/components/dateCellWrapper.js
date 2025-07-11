import React from 'react';
import { isDateBooked } from './isDateBooked';

const DateCellWrapper = ({ children, value, bookedAppointments }) => {
  const bookedEvent = bookedAppointments.find(
    (event) => new Date(event.start).toDateString() === new Date(value).toDateString()
  );

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: bookedEvent ? '#f8d7da' : 'transparent',
        opacity: bookedEvent ? 0.6 : 1,
        height: '100%',
        pointerEvents: bookedEvent ? 'none' : 'auto',
        padding: '4px',
      }}
    >
      {children}

      {bookedEvent && (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            right: 4,
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '2px 6px',
            fontSize: '0.75rem',
            borderRadius: '4px',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <strong>{bookedEvent.title}</strong><br />
          {bookedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
          {bookedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default DateCellWrapper;
