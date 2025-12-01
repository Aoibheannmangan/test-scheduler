import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LogIn from '../pages/login';
import axios from 'axios';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

describe('Log In Component', () => {

  test("renders the Log In form", () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('shows error when submitting without email or password', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Email or password is incorrect" } }
    });

    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/email or password is incorrect/i)).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    axios.post.mockResolvedValue({
      data: { message: "mockToken123" }
    });

    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'thisisatest@ucc.ie' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Testing123' } });

    const button = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calender");
    });

  });

  test('shows error alert with invalid credentials', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Invalid credentials" } }
    });

    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'yeosang@ucc.ie' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword1' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

});
