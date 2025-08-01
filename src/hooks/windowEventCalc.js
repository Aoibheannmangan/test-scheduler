
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

export function generateEDIAppointment(birthDate, babyEarly, visitNum = null, isVisitCompleted = false) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const dueDate = new Date(birthDate.getTime() + babyEarly * MS_PER_DAY);
  const events = [];

  const visitWindows = {
    2: { start: 91, end: 122 },
    3: { start: 152, end: 212 },
    4: { start: 274, end: 365 },
    5: { start: 730, end: 791 },
  };

  const addVisit = (num) => {
    const window = visitWindows[num];
    if (!window) return;

    events.push({
      title: `EDI Visit ${num}`,
      visitNum: num,
      id: `00${num}`,
      dob: birthDate,
      daysEarly: babyEarly,
      ooa: false,
      start: new Date(dueDate.getTime() + window.start * MS_PER_DAY),
      end: new Date(dueDate.getTime() + window.end * MS_PER_DAY),
      type: 'window',
      Study: 'EDI',
    });
  };

  if (visitNum === 1) {
    addVisit(2);
  } else if (visitNum === 2 && isVisitCompleted) {
    addVisit(3);
  } else if (visitNum === 3 && isVisitCompleted) {
    addVisit(4);
  } else if (visitNum === 4 && isVisitCompleted) {
    addVisit(5);
  }

  return events;
}
