import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import MyCalendar from '../pages/Calendar';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import { eventPropGetter } from '../hooks/eventPropGetter';

//Localiser to see if calendar renders properly
const localizer = momentLocalizer(moment);

// Functions and mock hooks used to render functionality
const mockAddAppointment = jest.fn();
const mockClose = jest.fn();
// Mock the custom hook
jest.mock('../hooks/useAppointmentFilters', () => ({
useAppointmentFilters: jest.fn(),
}));

describe('Calendar Component', () => {
    const mockAppointmentEvents = [
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
        }
    ]
    //--------------------------Set storage and search filter changes-------------------

    beforeEach(() => {
            // Mock localStorage
            Storage.prototype.getItem = jest.fn(() =>
            JSON.stringify(mockAppointmentEvents)
            );
    
            // Mock useAppointmentFilters to return state
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


    })
})