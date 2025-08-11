import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LogIn from '../pages/login';

test('renders the login form', () => {
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );

  const staffIdInput = screen.getByRole('spinbutton', { name: /staff id/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /log in/i });
  expect(staffIdInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('shows error when ID is not entered', () => {
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );
  const submitButton = screen.getByRole('button', { name: /log in/i });
  fireEvent.click(submitButton);
  const errorMessage = screen.getByText(/staff id or password is incorrect/i);
  expect(errorMessage).toBeInTheDocument();
});

test('submits the form with valid data', () => {
  const mockUser = { staffId: '12345', password: 'Password123' };
  localStorage.setItem('users', JSON.stringify([mockUser]));
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );
  const staffIdInput = screen.getByRole('spinbutton', { name: /staff id/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /log in/i });
  fireEvent.change(staffIdInput, { target: { value: '12345' } });
  fireEvent.change(passwordInput, { target: { value: 'Password123' } });
  fireEvent.click(submitButton);
});

test('shows error alert with invalid credentials', async () => {
  const mockUser = { staffId: '12345', password: 'Password123'};
  localStorage.setItem('users', JSON.stringify([mockUser]));
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );
  const staffIdInput = screen.getByRole('spinbutton', {name: /staff id/i});
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', {name: /log in/i});
  fireEvent.change(staffIdInput, { target: { value: '12347' }});
  fireEvent.change(passwordInput, { target: { value: 'WrongPassword1'}});
  fireEvent.click(submitButton);
  expect(screen.getByText(/staff id or password is incorrect/i)).toBeInTheDocument;

});
