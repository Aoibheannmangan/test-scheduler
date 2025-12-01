import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('Navbar component', () => {
    test("renders all links", () => {
		render(
			<MemoryRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true,
				}}
			>
				<Navbar />
			</MemoryRouter>
		);
		expect(screen.getByText(/Appointment View/i)).toBeInTheDocument();
		expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
		expect(screen.getByText(/Reports/i)).toBeInTheDocument();
		expect(screen.getByText(/Patients/i)).toBeInTheDocument();
		expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
	});

	test("Links redirect when clicked", async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter
				initialEntries={["/"]} // start at home
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true,
				}}
			>
				<Navbar />
				<Routes>
					<Route
						path="/appoint"
						element={<div>Appointment Page</div>}
					/>
					<Route
						path="/calender"
						element={<div>Calendar Page</div>}
					/>
					<Route path="/reports" element={<div>Reports Page</div>} />
					<Route path="/account" element={<div>Patients Page</div>} />
					<Route
						path="/login"
						element={<div data-testid="logout-page">Log Out</div>}
					/>
				</Routes>
			</MemoryRouter>
		);

		const infantLogo = screen.getByAltText("Infant Logo");

		const appointmentLink = screen.getByText(/Appointment View/i);
		await user.click(appointmentLink);
		expect(screen.getByText(/Appointment Page/i)).toBeInTheDocument();

		const calendarLink = screen.getByText(/Calendar/i);
		await user.click(calendarLink);
		expect(screen.getByText(/Calendar Page/i)).toBeInTheDocument();

		const reportsLink = screen.getByText(/Reports/i);
		await user.click(reportsLink);
		expect(screen.getByText(/Reports Page/i)).toBeInTheDocument();

		const patientsLink = screen.getByText(/Patients/i);
		await user.click(patientsLink);
		expect(screen.getByText(/Patients Page/i)).toBeInTheDocument();

		const logoutLink = screen.getByRole("button", { name: /Log Out/i });
		await user.click(logoutLink);
		expect(screen.getByTestId("logout-page")).toBeInTheDocument();
	});
});
