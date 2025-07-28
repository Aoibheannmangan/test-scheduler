export function eventPropGetter(event) {
  let style = {
    borderRadius: '4px',
    border: 'none',
    padding: '2px',
    color: '#fff',
  };

  // First: apply base color based on Study
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

  return {style};
}