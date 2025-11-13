import React from 'react';

/**
 * Custom toolbar for navigation of the Calendar
 * Allows user to toggle between different calendar views (Month, Week, Day, Agenda)
 * @param {Object} param0 - The Props object
 * @param {string} param0.label - The label to display in the toolbar
 * @param {Function} param0.onNavigate - Callback function to navigate to different time periods (Today, previous, next)
 * @param {Function} param0.onView - Callback function to change calendar view (Month, Day, Week, Agenda)
 * @param {string} param0.view - The current calendar view
 * @returns {JSX.Element} The rendered toolbar with navigation and view buttons
 */
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
