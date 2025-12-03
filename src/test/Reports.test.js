import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Reports from "../pages/Reports";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock the child components
jest.mock("../components/Forecast", () => {
	return function MockForecast() {
		return <div data-testid="forecast-component">Forecast Component</div>;
	};
});

jest.mock("../components/BookedChart", () => {
	return function MockBookedChart() {
		return (
			<div data-testid="booking-component">
				Booked Chart Component
			</div>
		);
	};
});

// Mock the DataContext
jest.mock("../hooks/DataContext", () => ({
	useData: () => ({
		data: [
			{
				record_id: "001",
				nn_dob: "2024-01-01",
				reg_days_early: 5,
				visit_1_nicu_discharge_complete: "1",
				v2_attend: "0",
				reg_date1: "2025-02-01",
				reg_date2: "2025-02-28",
			},
		],
		loading: false,
		error: null,
		refetchData: jest.fn(),
	}),
}));

// Mock useBookings hook
jest.mock("../hooks/useBookings", () => ({
	useBookings: () => ({
		bookings: [
			{
				event_id: "123",
				title: "Test Appointment",
				start: new Date("2025-03-01"),
				end: new Date("2025-03-01"),
				event_type: "booked",
				patient_id: "001",
				visit_num: 2,
				no_show: false,
				out_of_window: false,
			},
		],
		loading: false,
		error: null,
		refetch: jest.fn(),
	}),
}));

describe("Reports Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		
		// Mock localStorage token
		Storage.prototype.getItem = jest.fn(() => "mock-token");
		
		// Mock axios calls for booking data
		axios.get.mockResolvedValue({
			data: {
				events: [
					{
						event_id: "123",
						title: "Test Appointment",
						start: "2025-03-01",
						end: "2025-03-01",
						event_type: "booked",
						patient_id: "001",
						visit_num: 2,
						no_show: false,
						out_of_window: false,
					},
				],
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Page Rendering", () => {
		test("renders the reports page with main headings", () => {
			render(<Reports />);

			expect(
				screen.getByText(/window and booking forecast/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(/booking statistics/i)
			).toBeInTheDocument();
		});

		test("renders the Forecast component", () => {
			render(<Reports />);

			expect(screen.getByTestId("forecast-component")).toBeInTheDocument();
		});

		test("renders the BookedChart component", () => {
			render(<Reports />);

			expect(
				screen.getByTestId("booking-component")
			).toBeInTheDocument();
		});

		test("renders both components inside chart containers", () => {
			render(<Reports />)

			// Use queryAllByTestId or getAllByTestId to find all chart containers
	    	const chartContainers = screen.getAllByTestId('chart-container');
			
   	 		// Check the number of chart containers
    		expect(chartContainers).toHaveLength(2);
		});
	});

	describe("Component Structure", () => {
		test("has correct heading hierarchy", () => {
			render(<Reports />);

			const headings = screen.getAllByRole("heading", { level: 1 });
			expect(headings).toHaveLength(2);
			expect(headings[0]).toHaveTextContent(
				/window and booking forecast/i
			);
			expect(headings[1]).toHaveTextContent(/booking statistics/i);
		});

		test("applies correct CSS classes to headings", () => {
			render(<Reports />);

			const windowHeading = screen.getByText(
				/window and booking forecast/i
			);
			const chartHeading = screen.getByText(/booking statistics/i);

			expect(windowHeading).toHaveClass("window-heading");
			expect(chartHeading).toHaveClass("chart-heading");
		});

		test("wraps forecast in chart container", () => {
			render(<Reports />);

			const forecastContainer = screen.getAllByTestId("chart-container")[0]; // first occurrence
			const forecastComponent = within(forecastContainer).getByTestId("forecast-component");
			expect(forecastContainer).toBeInTheDocument();
 			expect(forecastComponent).toBeInTheDocument();

			const bookingContainer = screen.getAllByTestId("chart-container")[1]; // the second occurrence
			const bookingComponent = within(bookingContainer).getByTestId("booking-component");
			expect(bookingContainer).toBeInTheDocument();
			expect(bookingComponent).toBeInTheDocument();
		});
	});

	describe("Layout and Styling", () => {
		test("renders reportPage wrapper", () => {
			render(<Reports />);

			const reportPage = screen.getByTestId("page-container");
			expect(reportPage).toBeInTheDocument();
		});

		test("displays components in correct order", () => {
			render(<Reports />);

    const headings = screen.getAllByRole("heading");
    
    const forecastHeadingIndex = headings.findIndex((h) => 
        h.textContent.match(/window and booking forecast/i)
    );
    const chartHeadingIndex = headings.findIndex((h) => 
        h.textContent.match(/booking statistics/i)
    );

    expect(chartHeadingIndex).toBeGreaterThan(forecastHeadingIndex);
		});
	});

	describe("Component Integration", () => {

		test("renders without crashing when data is available", () => {
			const { container } = render(<Reports />);
			expect(container).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		test("has proper heading structure for screen readers", () => {
			render(<Reports />);

			const headings = screen.getAllByRole("heading", { level: 1 });
			expect(headings.length).toBeGreaterThan(0);
		});

		test("maintains semantic HTML structure", () => {
			render(<Reports />);

			const h1Elements = screen.getAllByRole("heading", { leavel: 1 });

			expect(h1Elements.length).toBe(2);
		});
	});

	describe("Error Handling", () => {
		test("renders even if child components have issues", () => {

			// Mock child components to simulate potential rendering issues
			jest.mock('./../components/Forecast', () => () => null);
			jest.mock('./../components/BookedChart', () => () => null);

			render(<Reports />);

			// Core container should still be present
			const pageContainer = screen.getByTestId("page-container");
			expect(pageContainer).toBeInTheDocument();

			// Verify headings are still rendered
			expect(screen.getByText(/Window and Booking Forecast/i)).toBeInTheDocument();
			expect(screen.getByText(/Booking Statistics/i)).toBeInTheDocument();
		});
	});
});
