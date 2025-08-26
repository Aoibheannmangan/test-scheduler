import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPsw from '../components/forgotpsw';

test('renders the forgot password form', () => {
    render(
        <MemoryRouter>
            <ForgotPsw />
        </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /reset password/i});
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
});

test('shows warning for invalid password', async () => {
    render(
        <MemoryRouter>
            <ForgotPsw />
        </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
        target: {value: 'wrong'}
    });
    fireEvent.click(screen.getByRole('button', {name: /reset password/i}));
});

