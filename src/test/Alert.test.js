import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Alert from '../components/Alert';

test('renders alert with message as warning', () => {
    render(<Alert message="Test warning" type="warning" on onClose={() => {}} />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument;
    expect(alertElement).toHaveTextContent('Test warning');
    expect(alertElement).toHaveClass('alert-popup warning');
});

test('correct class = success', () => {
    render(<Alert message="Test warning" type="success" on onClose={() => {}} />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-popup success');
});

test('correct class = error', () => {
    render(<Alert message="Test warning" type="error" on onClose={() => {}} />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('error');
});

test('correct class = info', () => {
    render(<Alert message="Test warning" type="info" on onClose={() => {}} />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-popup info');
});

test('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<Alert message="Close" type="warning" onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
})
