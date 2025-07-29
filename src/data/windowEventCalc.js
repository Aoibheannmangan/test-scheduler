
//-------------------------------AIMHIGH-----------------------------------------------------
// AIMHIGH Visit 2: 15 - 18 weeks after corrected due date
export function generateAimHighAppointments(birthDate, babyEarly) {
 const addDays = (date, days) =>
    new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

    // Corrected due date = birthDate + (babyEarly * 7 days)
    const correctedDueDate = addDays(birthDate, babyEarly * 7);

    // 15–18 weeks = 105 to 126 days
    const start = addDays(correctedDueDate, 105);
    const end = addDays(correctedDueDate, 126);

    const events = [
        {
            title: 'AIMHIGH Visit',
            visitNum: 2,
            id: '000-000',
            DOB: birthDate,
            DaysEarly: babyEarly,
            OutOfArea: false,
            start,
            end,
            type: 'window',
            Study: 'AIMHIGH',
        },
    ];

  return events;
}

// ---------------------------------------COOLPRIME---------------------------------------

export function generateCoolPrimeAppointments(birthDate, babyEarly) {
    // COOLPRIME Visit 2: in clinic 3 - 4 mnths

  // Corrected age starts from due date, not birth date
  const dueDate = new Date(birthDate.getTime() + babyEarly * 24 * 60 * 60 * 1000);

  // Calculates start of window from due date
  const startWindow = new Date(dueDate.getTime());
  startWindow.setMonth(startWindow.getMonth() + 3);

  // Calculates end of window from due date
  const endWindow = new Date(dueDate.getTime());
  endWindow.setMonth(endWindow.getMonth() + 4);

  const events = [
        {
      title: 'COOLPRIME Visit',
      visitNum: 2,
      id: '000',
      dob: birthDate,
      daysEarly: babyEarly,
      ooa: true,
      start: startWindow,
      end: endWindow,
      type: 'window',
      Study: 'COOLPRIME',
    },
  ];

  return events;
}
// ---------------------------------------EDI---------------------------------------

export function generateEDIAppointment(birthDate, babyEarly) {
    // EDI Visit 2: in clinic 3 - 4 months

  // Corrected age starts from due date, not birth date
    const dueDate = new Date(birthDate.getTime() + babyEarly * 24 * 60 * 60 * 1000);

    // Calculates start of window from due date
    const startWindow = new Date(dueDate.getTime());
    startWindow.setMonth(startWindow.getMonth() + 3);

    // Calculates start of window from due date
    const endWindow = new Date(dueDate.getTime());
    endWindow.setMonth(endWindow.getMonth() + 4);

    const events = [
        {
            title: 'EDI Visit', 
            visitNum: 2,
            id: '000',
            dob: birthDate,
            daysEarly: babyEarly,
            ooa: false,
            start: startWindow,
            end: endWindow,
            type: 'window',
            Study: 'EDI'
        }
    ]

    return events
}












