export function eventPropGetter(event) {
  
  // General style of all events
  let style = {
    borderRadius: '4px',
    border: 'none',
    padding: '2px',
    color: '#fff',
  };

  // Apply base color based on room
  if (event.room === 'TeleRoom') {
    style.backgroundColor = '#9E3C3C'; 
  } 
  else if (event.room === 'room1') {
    style.backgroundColor = '#3C8C42'; 
  } 
  else if (event.room === 'room2') {
    style.backgroundColor = '#0BA7A0'; 
  } 
  else if (event.room === 'room3') {
    style.backgroundColor = '#B6711A'; 
  } 
  else if (event.room === 'room4') {
    style.backgroundColor = '#76148E'; 
  } 
  else if (event.room === 'devRoom') {
    style.backgroundColor = '#0E6C7A'; 
  }


  // Color by study for window events
  if (event.type === 'window') {
    if (event.Study?.includes('AIMHIGH')) {
      style.backgroundColor = '#9da715ff'; // blue
    } else if (event.Study?.includes('COOLPRIME')) {
      style.backgroundColor = '#43a047'; // green
    } else if (event.Study?.includes('EDI')) {
      style.backgroundColor = '#f4511e'; // orange
    }
  }


  return {style};
}