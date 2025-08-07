import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Account from '../pages/account';

test('displays message when no patient data is available', () => {
    localStorage.removeItem('userInfoList');
    render(
        <MemoryRouter>
            <Account />
        </MemoryRouter>
    );
    expect(screen.getByText(/no patient/i)).toBeInTheDocument();
    expect(screen.getByText(/add patient information/i)).toBeInTheDocument();
});

test('displays data when patient data is available', () => {
    const mockData = [
        {
            id: '1',
            Name: 'Lily Morrow',
            DOB: '2025-08-07',
            DaysEarly: '5',
            Sex: 'Female',
            Condition: 'Case',
            Study: ['EDI'],
            site: 'Cork',
            Info: 'No additional notes'
        }
    ];
    localStorage.setItem('userInfoList', JSON.stringify(mockData));
    render(
        <MemoryRouter>
            <Account />
        </MemoryRouter>
    );
    expect(screen.getByText(/lily morrow/i)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
    expect(screen.getByText(/edi/i)).toBeInTheDocument();
    expect(screen.getByText(/no additional notes/i)).toBeInTheDocument();
});

test('clicking edit stores user and navigates to the info page', () => {
    const mockData = [
        {
            id: '1',
            Name: 'Minnie',
            DOB: '2025-08-07',
            DaysEarly: '5',
            Sex: 'Female',
            Condition: 'Case',
            Study: ['EDI'],
            site: 'Cork',
            Info: 'No additional notes'
        }
    ];
    localStorage.setItem('userInfoList', JSON.stringify(mockData));
    render(
        <MemoryRouter>
            <Account />
        </MemoryRouter>
    );
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    const storedUser = JSON.parse(localStorage.getItem('editPatient'));
    expect(storedUser.Name).toBe('Minnie')
});

test('clicking delete opens confirmation popup', () => {
    const mockData = [{
        id: '2',
        Name: 'Mark Lee',
        DOB: '2025-07-12',
        DaysEarly: '2',
        Condition: 'Control',
        Study: ['EDI'],
        site: 'Coombe',
        Info: ''
    }];
    localStorage.setItem('userInfoList', JSON.stringify(mockData));
    render(
        <MemoryRouter>
            <Account />
        </MemoryRouter>
    );
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    expect(screen.getByText(/are you sure you want to delete this patient/i));
});