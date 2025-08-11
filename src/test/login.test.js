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

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /log in/i });
  expect(emailInput).toBeInTheDocument();
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
  const errorMessage = screen.getByText(/email or password is incorrect/i);
  expect(errorMessage).toBeInTheDocument();
});

test('submits the form with valid data', () => {
  const mockUser = { email: 'test@ucc.ie', password: 'Password123' };
  localStorage.setItem('users', JSON.stringify([mockUser]));
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /log in/i });
  fireEvent.change(emailInput, { target: { value: 'test@ucc.ie' } });
  fireEvent.change(passwordInput, { target: { value: 'Password123' } });
  fireEvent.click(submitButton);
});

test('shows error alert with invalid credentials', async () => {
  const mockUser = { email: 'test@ucc.ie', password: 'Password123'};
  localStorage.setItem('users', JSON.stringify([mockUser]));
  render(
    <MemoryRouter>
      <LogIn />
    </MemoryRouter>
  );
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', {name: /log in/i});
  fireEvent.change(emailInput, { target: { value: 'yeosang@ucc.ie' }});
  fireEvent.change(passwordInput, { target: { value: 'WrongPassword1'}});
  fireEvent.click(submitButton);
  expect(screen.getByText(/email or password is incorrect/i)).toBeInTheDocument;

});
