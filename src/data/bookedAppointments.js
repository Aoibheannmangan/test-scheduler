export function getBookedAppointments() {
  const bookedAppointments = [
    {
      title: 'Dr. Murphy - Baby C',
      start: new Date(2025, 10, 12, 10, 0),
      end: new Date(2025, 10, 12, 11, 0),
      type: 'booked'
    },
    {
      title: 'Dr. OConnell - Baby D',
      start: new Date(2025, 10, 14, 9, 30),
      end: new Date(2025, 10, 14, 10, 30),
      type: 'booked'
    },
  ];

return bookedAppointments

}
