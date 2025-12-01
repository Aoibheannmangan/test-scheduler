import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {

    test("Footer renders ucc portion", () => {
        render(<Footer />);
        const uccLogo = screen.getByAltText("UccLogo");
        expect(uccLogo).toBeInTheDocument();

        expect(screen.getByText("Hosted at:")).toBeInTheDocument();
    });

    test("Footer renders contact info correctly", () => {
        render(<Footer />)

        expect(screen.getByText(/Contact:/i)).toBeInTheDocument();
        expect(screen.getByText(/infant@ucc.ie/)).toBeInTheDocument();
        
        expect(screen.getByText(/\+353\(0\)21 4205082/)).toBeInTheDocument();
        expect(screen.getByText(/Paediatric Academic Unit,/)).toBeInTheDocument();
        expect(screen.getByText(/Cork University Hospital,/)).toBeInTheDocument();
        expect(screen.getByText(/Wilton, Cork/)).toBeInTheDocument();
        expect(screen.getByText(/Ireland/)).toBeInTheDocument();

    });

});