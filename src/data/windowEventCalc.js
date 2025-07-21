export function generateAimHighAppointments(birthDate, babyEarly) { // Generate AIMHIGH appointment window

    // Adds a given number of weeks to a date and returns the new date. 
    const addWeeks = (date, weeks) => new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000); // Date + Weeks + Days + Hours + Seconds + Milliseconds
  
    const events = [
    {
        title: 'AimHigh Visit',
        id: "123",
        start: addWeeks(birthDate, 15 + babyEarly), // Window open date
        end: addWeeks(birthDate, 18 + babyEarly),   //Window close date
        type: 'window',
        study: 'AIMHIGH'
    },
    {
        title: 'COOLPRIME Visit',
        id: "456",
        start: addWeeks(birthDate, 21 + 2 * babyEarly), // Window open date
        end: addWeeks(birthDate, 34 + 2 * babyEarly),   //Window close date
        type: 'window', // Window or booking
        study: 'COOLPRIME' 
    },
    
  ];

  return events;
}
// Type the id in the search bar in the calender to display the window