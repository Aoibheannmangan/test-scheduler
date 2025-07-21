export function generateAimHighAppointments(birthDate, babyEarly) { // Generate AIMHIGH appointment window

    const addWeeks = (date, weeks) => new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
  
    const events = [
    {
        title: 'AimHigh Visit',
        id: "123",
        start: addWeeks(birthDate, 15 + babyEarly),
        end: addWeeks(birthDate, 18 + babyEarly),
        type: 'window',
        study: 'AIMHIGH'
    },
    {
        title: 'COOLPRIME Visit',
        id: "456",
        start: addWeeks(birthDate, 21 + 2 * babyEarly),
        end: addWeeks(birthDate, 34 + 2 * babyEarly),
        type: 'window',
        study: 'COOLPRIME'
    },
    
  ];

  return events;
}

//Study number maybe date of birth for patient identification