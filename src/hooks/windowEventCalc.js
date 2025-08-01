
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

export function generateCoolPrimeAppointments(birthDate, babyEarly, visitNum = null) {
  const dueDate = new Date(birthDate.getTime() + babyEarly * 24 * 60 * 60 * 1000);

  const visitSchedule = {
    2: { startMonth: 3, endMonth: 4 },
    3: { startMonth: 9, endMonth: 12 },
    4: { startMonth: 22, endMonth: 26 },
  };

  const generateVisit = (num) => {
    const visit = visitSchedule[num];
    if (!visit) return null;

    const startWindow = new Date(dueDate);
    startWindow.setMonth(startWindow.getMonth() + visit.startMonth);

    const endWindow = new Date(dueDate);
    endWindow.setMonth(endWindow.getMonth() + visit.endMonth);

    return {
      title: `COOLPRIME Visit ${num}`,
      visitNum: num,
      id: '000-000', 
      dob: birthDate,
      daysEarly: babyEarly,
      start: startWindow,
      end: endWindow,
      type: 'window',
      Study: 'COOLPRIME',
    };
  };

  if (visitNum !== null) {
    const singleVisit = generateVisit(visitNum);
    return singleVisit ? [singleVisit] : [];
  }

  return Object.keys(visitSchedule).map(num => generateVisit(parseInt(num))).filter(Boolean);
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












