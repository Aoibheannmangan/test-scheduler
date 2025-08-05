import React from 'react';

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="custom-toolbar">
      <div className="btn-group nav-buttons">
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('PREV')}>Back</button>
        <button onClick={() => onNavigate('NEXT')}>Next</button>
      </div>

      <div className="toolbar-label">{label}</div>

      <div className="btn-group view-buttons">
        <button
          className={view === 'month' ? 'active' : ''}
          onClick={() => onView('month')}
        >
          Month
        </button>
        <button
          className={view === 'week' ? 'active' : ''}
          onClick={() => onView('week')}
        >
          Week
        </button>
        <button
          className={view === 'day' ? 'active' : ''}
          onClick={() => onView('day')}
        >
          Day
        </button>
        <button
          className={view === 'agenda' ? 'active' : ''}
          onClick={() => onView('agenda')}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
