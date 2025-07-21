export function eventPropGetter(event)  { // Event study getter function. See if AIMHIGH, COOLPRIME OR EDI
  let style = {};

  if (event.study === 'AIMHIGH') {
    style = {
      backgroundColor: '#af4c4c', // Color for AIMHIGH
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  } else if (event.study === 'COOLPRIME') {
    style = {
      backgroundColor: '#614caf', // Color for COOLPRIME
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  }
    else{
    style = {
      backgroundColor: '#afa04c', // Color for EDI
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      padding: '2px',
    };
  }

  return { style }; 
}
