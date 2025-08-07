import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyCalendar from '../pages/Calendar';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Setup localizer
const localizer = momentLocalizer(moment);

// Mock the hook before importing the component
jest.mock('../hooks/useAppointmentFilters');

describe('Calendar Component', () => {
    const mockAppointmentEvents = [
        {
        title: 'Visit Test',
        id: '001',
        type: 'booked',
        start: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
        end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
        visitNum: 1,
        OutOfArea: false,
        Name: 'John Doe',
        DOB: '2025-01-01',
        site: 'Kildare',
        Study: ['AIMHIGH'],
        },
        {
        title: 'Study Window Test',
        id: '002',
        type: 'window',
        start: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
        end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
        visitNum: 2,
        OutOfArea: true,
        Name: 'Jane Smith',
        DOB: '2025-05-20',
        site: 'Kildare',
        Study: ['COOLPRIME'],
        }
    ];
    //--------------------------Set storage and search filter changes-------------------

    beforeEach(() => {
        // Mock localStorage to return our test data
        Storage.prototype.getItem = jest.fn(() =>
        JSON.stringify(mockAppointmentEvents)
        );
        // Mock the useAppointmentFilters hook
        useAppointmentFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: jest.fn(),
        selectedStudies: [],
        handleStudyChange: jest.fn(),
        filteredAppointments: mockAppointmentEvents,
        });
    });

    test('Render calendar and buttons', () => {
        render(
            <MyCalendar 
            localizer={localizer}
            />
        );

        expect(screen.getByRole('button', {name: 'Today'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Back'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Next'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Month'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Week'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Day'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Agenda'})).toBeInTheDocument();
        
        // Test to see if current month and year render
        const now = new Date();
        expect(screen.getByText(localizer.format(now, 'MMMM YYYY'))).toBeInTheDocument();

        expect(screen.getByRole('table', {name: 'Month View'})).toBeInTheDocument();

    });

    test('Render Visit and Study Window titles', async () => {
        render(<MyCalendar />);

        expect(screen.getByText(/Study Window Test/i)).toBeInTheDocument();
        // TODO:
        // FIND VISIT EVENT, BLOCKED, FIRE EVENT CLICKS, SEARCH PATIENT, BLOCK DAY, USE FILTERS

});
})