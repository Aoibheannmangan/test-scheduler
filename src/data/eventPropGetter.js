export function eventPropGetter(event)  {
  let style = {};

  if (event.status === 'booked') {
    style = {
      backgroundColor: '#dc3545', // red for booked if viewing visit windows
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  } else {
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
