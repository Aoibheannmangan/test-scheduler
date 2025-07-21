// Makes it so date can be clicked instead of the small number on the calender

const ClickableDateCell = ({ children, value, onSelectSlot }) => {
  const handleClick = () => {
    if (onSelectSlot) {
      onSelectSlot({ start: value, end: value, action: 'click' });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: 'pointer', height: '100%' }}
    >
      {children}
    </div>
  );
};

export default ClickableDateCell;
