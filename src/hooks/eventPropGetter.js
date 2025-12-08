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
    style.backgroundColor = '#af4c4c'; 
  } 
  else if (event.room === 'room1') {
    style.backgroundColor = '#4caf50'; 
  } 
  else if (event.room === 'room2') {
    style.backgroundColor = '#09ccc2a4'; 
  } 
  else if (event.room === 'room3') {
    style.backgroundColor = '#cc8821c0'; 
  } 
  else if (event.room === 'room4') {
    style.backgroundColor = '#8c14a1cb'; 
  } 
  else if (event.room === 'devRoom') {
    style.backgroundColor = '#138392c9'; 
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

  if (event.event_type === "leave") {
    return {
      style: {
        backgroundColor: "#FFA500",
        border: "1px solid #cc8400",
        color: "white",
      }
    };
  }

  return {style};
}