// AIMHIGH Visit 2: 15 - 18 weeks after corrected due date
export function generateAimHighAppointments(birthDate, babyEarly) {
  const addWeeks = (date, weeks) =>
    new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);

  // Corrected due date: birth + weeksEarly
  const correctedDueDate = new Date(birthDate.getTime() + babyEarly * 7 * 24 * 60 * 60 * 1000);

  const events = [
    {
      title: 'AIMHIGH Visit 2',
      id: '000',
      dob: birthDate,
      weeksEarly: babyEarly,
      start: addWeeks(correctedDueDate, 15),
      end: addWeeks(correctedDueDate, 18),
      type: 'window',
      study: 'AIMHIGH',
    },
  ];

  return events;
}



export function generateCoolPrimeAppointments(birthDate, babyEarly) {
    // COOLPRIME Visit 2: in clinic 3 - 4 mnths

  // Corrected age starts from due date, not birth date
  const dueDate = new Date(birthDate.getTime() + babyEarly * 7 * 24 * 60 * 60 * 1000);

  // Calculates start of window from due date
  const startWindow = new Date(dueDate.getTime());
  startWindow.setMonth(startWindow.getMonth() + 3);

  // Calculates end of window from due date
  const endWindow = new Date(dueDate.getTime());
  endWindow.setMonth(endWindow.getMonth() + 4);

  const events = [
        {
      title: 'COOLPRIME Visit 2',
      id: '000',
      dob: birthDate,
      weeksEarly: babyEarly,
      start: startWindow,
      end: endWindow,
      type: 'window',
      study: 'COOLPRIME',
    },
  ];

  return events;
}