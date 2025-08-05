// Makes it so date can be clicked instead of the small number on the calender

// children = content displayed
// value = date cell represents
// onSelectedSlot = Callback function when cell is clicked

const ClickableDateCell = ({ children, value, onSelectSlot }) => {
  
  const handleClick = () => {
    if (onSelectSlot) {
      // If slot is selected on click
      onSelectSlot({ start: value, end: value, action: 'click' });
    }
  };

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
