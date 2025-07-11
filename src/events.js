export function generateAimHighAppointments(birthDate, babyEarly) {
    const addWeeks = (date, weeks) => new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
  
    const events = [
    {
        title: 'AimHigh Visit 2',
        start: addWeeks(birthDate, 15 + babyEarly),
        end: addWeeks(birthDate, 18 + babyEarly),
    },
    {
        title: 'AimHigh Visit 3',
        start: addWeeks(birthDate, 21 + 2 * babyEarly),
        end: addWeeks(birthDate, 34 + 2 * babyEarly),
    },
    
  ];

  return events;
}
