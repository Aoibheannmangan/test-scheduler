import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../pages/signup';

test('renders the signup form', () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const staffIdInput = screen.getByRole('spinbutton', { name: /staff id/i});
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
    const repeatPasswordInput = screen.getByPlaceholderText(/Please re-enter your password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i});
    expect(emailInput).toBeInTheDocument();
    expect(staffIdInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(repeatPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
});

test('shows warning for invalid password', async () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
        target: {value: 'short'},
    });
    fireEvent.change(screen.getByPlaceholderText(/Please re-enter your password/i), {
        target: {value: 'short'},
    });  
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/Invalid Password/i)).toBeInTheDocument();
});

test('shows warning for invalid email format', async () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
        target: {value:'ValidPass1'}
    });
    fireEvent.change(screen.getByPlaceholderText(/Please re-enter your password/i),{
        target:{value:'ValidPass1'},
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: {value:'test@gmail.com'},
    });
    fireEvent.change(screen.getByRole('spinbutton', {name:/staff id/i}), {
        target: {value:'12345'},
    });
    fireEvent.click(screen.getByRole('button', {name:/sign up/i}));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Please use your UCC Email/i);
});

test('shows error when passwords dont match', async () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: {value:'test@ucc.ie'}
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /staff id/i }), {
        target: { value: '12345' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
        target: { value: 'ValidPass1' }
    });

    const confirmPasswordField = await screen.findByPlaceholderText(/Please re-enter your password/i);
    fireEvent.change(confirmPasswordField, {
        target: { value: 'ValidPass2' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Passwords do not match/i);
});






