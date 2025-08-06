import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Appointments from '../pages/AppointView';
// Mock the hook functions
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';

// Mock the custom hook
jest.mock('../hooks/useAppointmentFilters', () => ({
  useAppointmentFilters: jest.fn(),
}));

describe('Appointments Component', () => {
    //------------------------------------Mock patients for rendering---------------------------------
    const mockFilteredAppointments = [
        {
        id: '001',
        type: 'booked',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        visitNum: 1,
        OutOfArea: false,
        Name: 'John Doe',
        DOB: '2025-01-01',
        site: 'Kildare',
        Study: ['AIMHIGH'],
        },
        {
        id: '002',
        type: 'window',
        visitNum: 2,
        OutOfArea: true,
        Name: 'Jane Smith',
        DOB: '2025-05-20',
        site: 'Kildare',
        Study: ['COOLPRIME'],
        },
    ];
    //------------------------------------Set storage and search/ filter changes---------------------------------
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() =>
        JSON.stringify(mockFilteredAppointments)
        );

        // Mock useAppointmentFilters to return state
        useAppointmentFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: jest.fn(),
        selectedStudies: [],
        handleStudyChange: jest.fn(),
        filteredAppointments: mockFilteredAppointments,
        });
    });

    //------------------------------------Testing code---------------------------------

    test('renders main heading and search input', () => {
        render(<Appointments />);

        expect(screen.getByText(/Visit Overview/i)).toBeInTheDocument();
        expect(screen.getByLabelText('searchBar')).toBeInTheDocument();
    });

    test('renders patient list with correct IDs', () => {
        render(<Appointments />);

        // Check that mock patients are rendered
        expect(screen.getByText(/001/)).toBeInTheDocument();
        expect(screen.getByText(/002/)).toBeInTheDocument();
    });
    
    test('filters can be clicked', () => {
        render(<Appointments />);

        const aimhighCheck = screen.getByLabelText('AimhighCheck');
        expect(aimhighCheck).toBeInTheDocument();

        fireEvent.click(aimhighCheck);
        expect(useAppointmentFilters().handleStudyChange).toHaveBeenCalledWith('AIMHIGH');
    });

    test('expands patient info on ID click', () => {
        render(<Appointments />);

        const patientRow = screen.getByText(/001/);
        fireEvent.click(patientRow);

        // Should show name in the expanded info
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

        
});
// Need to add more testing