export function isDateBooked(date, appointments) {
  return appointments.some((event) => {
    const cellDate = new Date(date).toDateString();
    const eventDate = new Date(event.start).toDateString();
    return cellDate === eventDate;
  });
}
