//-------------------------------AIMHIGH-----------------------------------------------------
// AIMHIGH Visits
// **After corrected age
// 2: 15 - 18 weeks
// 3: 9-12 months
// 4: 18 +-1 months
// 5: 24 +-1 months
// 6: 30 +-1 months
export function generateAimHighAppointments(
  birthDate,
  babyEarly,
  visitNum = null
) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const correctedDueDate = new Date(
    birthDate.getTime() + babyEarly * MS_PER_DAY
  );
  const events = [];

  const visitWindows = {
    2: { startDay: 105, endDay: 126 },
    3: { startDay: 274, endDay: 365 },
    4: { startDay: 487, endDay: 548 },
    5: { startDay: 700, endDay: 761 },
    6: { startDay: 914, endDay: 975 },
  };

  const addVisit = (num) => {
    const visit = visitWindows[num];
    if (!visit) return null;

    const startWindow = new Date(
      correctedDueDate.getTime() + visit.startDay * MS_PER_DAY
    );
    const endWindow = new Date(
      correctedDueDate.getTime() + visit.endDay * MS_PER_DAY
    );

    events.push({
      title: `AIMHIGH Visit ${num}`,
      visitNum: num,
      id: "000-000",
      DOB: birthDate,
      DaysEarly: babyEarly,
      OutOfArea: false,
      start: startWindow,
      end: endWindow,
      type: "window",
      Study: "AIMHIGH",
    });
  };

  if (visitNum === 1) {
    addVisit(2);
  } else if (visitNum === 2) {
    addVisit(3);
  } else if (visitNum === 3) {
    addVisit(4);
  } else if (visitNum === 4) {
    addVisit(5);
  }

  if (visitNum !== null) {
    addVisit(visitNum);
  } else {
    Object.keys(visitWindows).forEach((num) => addVisit(parseInt(num)));
  }

  return events;
}

// ---------------------------------------COOLPRIME---------------------------------------
// COOLPRIME Visits
// **After corrected age
// 2: 3-4 months
// 3:
// 4:
// 5:

export function generateCoolPrimeAppointments(
  birthDate,
  babyEarly,
  visitNum = null
) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const correctedDueDate = new Date(
    birthDate.getTime() + babyEarly * MS_PER_DAY
  );
  const events = [];

  const visitWindows = {
    2: { startDay: 91, endDay: 122 },
    3: { startDay: 274, endDay: 365 },
    4: { startDay: 669, endDay: 791 },
  };

  const addVisit = (num) => {
    const visit = visitWindows[num];
    if (!visit) return null;

    const startWindow = new Date(
      correctedDueDate.getTime() + visit.startDay * MS_PER_DAY
    );
    const endWindow = new Date(
      correctedDueDate.getTime() + visit.endDay * MS_PER_DAY
    );

    events.push({
      title: `COOLPRIME Visit ${num}`,
      visitNum: num,
      id: "000-000",
      DOB: birthDate,
      DaysEarly: babyEarly,
      OutOfArea: false,
      start: startWindow,
      end: endWindow,
      type: "window",
      Study: "COOLPRIME",
    });
  };
  if (visitNum === 1) {
    addVisit(2);
  } else if (visitNum === 2) {
    addVisit(3);
  } else if (visitNum === 3) {
    addVisit(4);
  } else if (visitNum === 4) {
    addVisit(5);
  }

  if (visitNum !== null) {
    addVisit(visitNum);
  } else {
    Object.keys(visitWindows).forEach((num) => addVisit(parseInt(num)));
  }
  return events;
}

// ---------------------------------------EDI---------------------------------------
// EDI Visits
// **After corrected age
// 2: 3-4 months
// 3: 6 months (+-4 weeks)
// 4: 9-12 months (+-4 weeks)
// 5: 24-26 months (+-4 weeks)

export function generateEDIAppointment(birthDate, babyEarly, visitNum = null) {
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
      id: `000-000`,
      DOB: birthDate,
      daysEarly: babyEarly,
      ooa: false,
      start: new Date(dueDate.getTime() + window.start * MS_PER_DAY),
      end: new Date(dueDate.getTime() + window.end * MS_PER_DAY),
      type: "window",
      Study: "EDI",
    });
  };

  if (visitNum === 1) {
    addVisit(2);
  } else if (visitNum === 2) {
    addVisit(3);
  } else if (visitNum === 3) {
    addVisit(4);
  } else if (visitNum === 4) {
    addVisit(5);
  }

  if (visitNum !== null) {
    addVisit(visitNum);
  } else {
    Object.keys(visitWindows).forEach((num) => addVisit(parseInt(num)));
  }

  return events;
}
