export function getAppointmentsPerMonth(events) {
    const counts = {};

    events.forEach((event) => {
        if (!event.start) return;
        const date = new Date(event.start);
        if (isNaN(date)) return;

        const key = `${date.toLocaleString("default", {month: "long"})} ${date.getFullYear()}`;
        if (!counts[key]) counts[key] = {booked: 0, window: 0};
        if (event.type === "booked") counts[key].booked += 1;
        else counts[key].window += 1;
    });

    return counts;
}