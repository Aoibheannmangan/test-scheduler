// Makes it so date can be clicked instead of the small number on the calender

// children = content displayed
// value = date cell represents
// onSelectedSlot = Callback function when cell is clicked
import moment from 'moment';

const ClickableDateCell = ({ children, value, onSelectSlot, blockedDates }) => {
  const isBlocked = blockedDates.some((evt) => moment(value).isSame(evt.start, "day"));

  const handleClick = () => {
    if (isBlocked) return;

    if (onSelectSlot) {
      // If slot is selected on click
      onSelectSlot({ start: value, end: value, action: 'click' });
    }
  };

  const cellStyle = {
    cursor: isBlocked ? 'not-allowed' : 'pointer',
    height: '100%',
    backgroundColor: isBlocked ? '#ff0000ff' : 'transparent',
    borderRadius: "6px",
    opacity: isBlocked ? 0.6 : 1,
  }

  return (
    <div
    // Calls handleClick when clicked  
      onClick={handleClick}
      style={{ cursor: 'pointer', height: '100%' }}
    >
     {/* Displays content inside date*/}
      {children}
    </div>
  );
};

export default ClickableDateCell;
