import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToggleAppointment from '../components/AppointmentForm';


describe('ToggleAppointment Component', () => {
  const mockAddAppointment = jest.fn();
  const mockClose = jest.fn();

  test('renders all form fields', () => {

      render(
        <ToggleAppointment
        isOpen={true}
        onAddAppointment={mockAddAppointment}
        onClose={mockClose}
        />
    );

    expect(screen.getByLabelText(/Patient ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Appointment Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assessment Room/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Visit Note/i)).toBeInTheDocument();
  });

  test('submits form with correct data', () => {

    render(
      <ToggleAppointment
      isOpen={true}
      onAddAppointment={mockAddAppointment}
      onClose={mockClose}
      />
    )

    fireEvent.change(screen.getByLabelText(/Patient ID/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Appointment Date/i), { target: { value: '2025-08-10' } });
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: '10:30' } });
    fireEvent.change(screen.getByLabelText(/Assessment Room/i), { target: { value: 'room1' } });
    fireEvent.change(screen.getByLabelText(/Visit Note/i), { target: { value: 'Routine checkup' } });

    fireEvent.submit(screen.getByTestId('appointment-form'));

    expect(mockAddAppointment).toHaveBeenCalledTimes(1);
    const appointment = mockAddAppointment.mock.calls[0][0];
    expect(appointment.patientId).toBe('12345');
    expect(appointment.room).toBe('room1');
    expect(appointment.notes).toBe('Routine checkup');
  });//

  test('calls onClose when close button is clicked', () => {
        render(
      <ToggleAppointment
      isOpen={true}
      onAddAppointment={mockAddAppointment}
      onClose={mockClose}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(mockClose).toHaveBeenCalledTimes(1);

  });

  test('does not render when isOpen is false', () => {
    render(
      <ToggleAppointment
        isOpen={false}
        onAddAppointment={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.queryByText(/Patient ID/i)).toBeNull();
  });
});
