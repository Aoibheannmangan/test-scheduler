let bookedAppointments = [ // Set list with appointment objects
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

// Function to return list of appointment objects
export function getBookedAppointments(){
  return bookedAppointments
  }

// Funtion to add appointments
export function addBookedAppointment(appointment) {
  bookedAppointments.push(appointment)
}

