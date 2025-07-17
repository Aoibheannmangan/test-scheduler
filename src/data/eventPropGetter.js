export function eventPropGetter(event)  { // Event property getter function. See if its booked, window appointment, etc
  let style = {};

  if (event.type === 'booked') {
    style = {
      backgroundColor: '#dc3545', // red for booked if viewing visit windows
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  } else if (event.type === 'window') {
    style = {
      backgroundColor: '#0d6efd', // blue for visit windows
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  }

  return { style }; 
}
