import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SignUp from '../pages/signup';
import axios from 'axios';
import { updateCallChain } from 'typescript';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('Sign Up Component', () => {
    test('renders the signup form', () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /staff id/i})).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Please re-enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i})).toBeInTheDocument();
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

    test('shows warning for invalid id format', async () =>{
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: {value:'test@ucc.ie'}
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: /staff id/i }), {
            target: { value: '123456' },
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
        expect(alert).toHaveTextContent(/Invalid Staff ID Format/i);
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

    test('shows warning when email is already registered', async () => {
        axios.post.mockRejectedValue({
            response: {
            data: { error: "Email is already registered" }
            }
        });

        render(
            <MemoryRouter>
            <SignUp />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@ucc.ie' }
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: /staff id/i }), {
            target: { value: '12345' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
            target: { value: 'ValidPass1' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Please re-enter your password/i), {
            target: { value: 'ValidPass1' } 
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/Email is already registered/i);
    });

    test('shows warning when ID is already registered', async () => {
        axios.post.mockRejectedValue({
            response: {
                data: { error: "ID is already registered"}
            }
        });

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'brandnewuser@ucc.ie'}
        });

        fireEvent.change(screen.getByRole('spinbutton', {name: /staff id/i}), {
            target: {value: '12345'}
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
            target: { value: 'ValidPass1'}
        });

        fireEvent.change(screen.getByPlaceholderText(/Please re-enter your password/i), {
            target: { value: 'ValidPass1'}
        });

        fireEvent.click(screen.getByRole('button', {name: /sign up/i}));

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/ID is already registered/i);
    })
})








