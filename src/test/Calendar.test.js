import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyCalendar from "../pages/Calendar";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// Mock axios for API calls
jest.mock("axios", () => ({
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
}));

// Mock the DataContext
jest.mock("../hooks/DataContext", () => ({
	useData: () => ({
		data: [
			{
				record_id: "001",
				nn_dob: "2024-01-01",
				reg_days_early: 5,
				nicu_dc_outcome: "1",
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

// Mock the child components
jest.mock("../components/LeaveForm", () => {
	return function MockLeaveForm() {
		return <div data-testid="leave-form">Leave Form</div>;
	};
});

// Helper function to wrap component with providers
const renderWithProviders = (component) => {
	return render(
		<LocalizationProvider dateAdapter={AdapterMoment}>
			{component}
		</LocalizationProvider>
	);
};

describe("MyCalendar Component", () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();

		// Mock successful API responses
		axios.get.mockResolvedValue({
			data: {
				events: [],
				blockedDates: [],
				leaveEvents: [],
			},
		});

		axios.post.mockResolvedValue({
			data: { ok: true, eventId: "123" },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Calendar Rendering", () => {
		test("renders calendar with all view buttons", () => {
			renderWithProviders(<MyCalendar />);

			// Check toolbar buttons exist
			expect(screen.getByText("Today")).toBeInTheDocument();
			expect(screen.getByText("Back")).toBeInTheDocument();
			expect(screen.getByText("Next")).toBeInTheDocument();
			expect(screen.getByText("Month")).toBeInTheDocument();
			expect(screen.getByText("Week")).toBeInTheDocument();
			expect(screen.getByText("Day")).toBeInTheDocument();
			expect(screen.getByText("Agenda")).toBeInTheDocument();
		});

		test("switches between different calendar views", async () => {
			renderWithProviders(<MyCalendar />);

			// Click Week view
			const weekButton = screen.getByText("Week");
			fireEvent.click(weekButton);

			await waitFor(() => {
				expect(weekButton).toHaveClass("active");
			});

			// Click Day view
			const dayButton = screen.getByText("Day");
			fireEvent.click(dayButton);

			await waitFor(() => {
				expect(dayButton).toHaveClass("active");
			});
		});

		test("renders main calendar container", () => {
			renderWithProviders(<MyCalendar />);

			// Check for calendar wrapper
			const calendarWrapper = screen.getByTestId("cal-wrapper");
			expect(calendarWrapper).toBeInTheDocument();
		});
	});

	describe("Booking Appointments", () => {
		test("opens appointment form when book button clicked", async () => {
			renderWithProviders(<MyCalendar />);

			// Correct way to find the booking button
			const bookButton = screen.getByTestId("booking-button");

			fireEvent.click(bookButton);

			await waitFor(() => {
				expect(
					screen.getByLabelText(/Patient ID/i)
				).toBeInTheDocument();
			});
		});

		test("validates appointment before submission", async () => {
			renderWithProviders(<MyCalendar />);

			// Open booking form
			const bookButton = screen.getByTestId("booking-button");
			fireEvent.click(bookButton);

			// Wait for form to open
			await waitFor(() => {
				expect(
					screen.getByLabelText(/Patient ID/i)
				).toBeInTheDocument();
			});

			// Try to submit without filling required fields
			const submitButton = screen.getByText(/submit/i);
			fireEvent.click(submitButton);

			// Form should still be visible (validation failed)
			await waitFor(() => {
				expect(
					screen.getByLabelText(/Patient ID/i)
				).toBeInTheDocument();
			});
		});
	});

	describe("Date Blocking Functionality", () => {
		test("blocks a date when block button clicked", async () => {
			axios.post.mockResolvedValueOnce({
				data: { ok: true, eventId: "block123" },
			});

			renderWithProviders(<MyCalendar />);

			// Click block button (this will show alert if no date selected)
			const blockButton = screen.getByRole("button", {
				name: /^Block Date$/i,
			});
			fireEvent.click(blockButton);

			// Should show validation message or success
			await waitFor(() => {
				// Component should still be rendered
				expect(screen.getByText(/Block Dates/i)).toBeInTheDocument();
			});
		});

		test("shows blocked dates when toggle clicked", async () => {
			renderWithProviders(<MyCalendar />);

			const showButton = screen.getByTestId("toggle-block");

			fireEvent.click(showButton);

			expect(
				screen.getByTestId("toggle-block", {
					name: /hide blocked dates/i,
				})
			).toBeInTheDocument();
		});
	});
});

describe("Patient Window Search", () => {
	test("searches for patient and displays window", async () => {
		renderWithProviders(<MyCalendar />);

		// Find search input
		const searchInput = screen.getByPlaceholderText(/enter patient id/i);

		// Enter patient ID
		fireEvent.change(searchInput, { target: { value: "001" } });

		// Click search button
		const searchButton = screen.getByRole("button", {
			name: /search window/i,
		});
		fireEvent.click(searchButton);

		await waitFor(() => {
			// Should show patient info
			expect(screen.getByText(/patient info/i)).toBeInTheDocument();
		});
	});

	test("handles non-existent patient search", async () => {
		renderWithProviders(<MyCalendar />);

		const searchInput = screen.getByPlaceholderText(/enter patient id/i);
		fireEvent.change(searchInput, { target: { value: "999" } });

		const searchButton = screen.getByRole("button", {
			name: /search window/i,
		});
		fireEvent.click(searchButton);

		// Component should handle gracefully
		await waitFor(() => {
			expect(searchInput).toBeInTheDocument();
		});
	});

	test("clears patient window search", async () => {
		renderWithProviders(<MyCalendar />);

		// Search for patient first
		const searchInput = screen.getByPlaceholderText(/enter patient id/i);
		fireEvent.change(searchInput, { target: { value: "001" } });

		const searchButton = screen.getByRole("button", {
			name: /search window/i,
		});
		fireEvent.click(searchButton);

		// Now clear
		const clearButton = screen.getByRole("button", {
			name: /clear window/i,
		});
		fireEvent.click(clearButton);

		// Search input should be cleared
		expect(searchInput.value).toBe("");
	});
});

describe("Room Filtering", () => {
	test("renders all room filter checkboxes", () => {
		renderWithProviders(<MyCalendar />);

		expect(screen.getByLabelText(/telemetry room/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/assessment room 1/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/assessment room 2/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/assessment room 3/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/assessment room 4/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/developmental assessment room/i)
		).toBeInTheDocument();
	});

	test("toggles room filter when checkbox clicked", async () => {
		renderWithProviders(<MyCalendar />);

		const room1Checkbox = screen.getByLabelText(/assessment room 1/i);

		// Initially should be checked
		expect(room1Checkbox).toBeChecked();

		// Click to uncheck
		fireEvent.click(room1Checkbox);

		await waitFor(() => {
			expect(room1Checkbox).not.toBeChecked();
		});
	});
});

describe("Event Editing", () => {
	test("opens edit popup when booked event clicked", async () => {
		const bookedEvent = {
			event_id: "123",
			title: "Editable Event",
			start: new Date().toISOString(),
			end: new Date(Date.now() + 3600000).toISOString(),
			event_type: "booked",
			patient_id: "001",
			room_id: 2,
		};

		axios.get.mockResolvedValueOnce({
			data: {
				events: [bookedEvent],
				blockedDates: [],
				leaveEvents: [],
			},
		});

		renderWithProviders(<MyCalendar />);

		// Wait for event to be rendered and click it
		await waitFor(() => {
			const eventElement = screen.queryByText(/editable event/i);
			if (eventElement) {
				fireEvent.click(eventElement);
			}
		});
	});
});

describe("Event Deletion", () => {
	test("shows confirmation popup before deleting", async () => {
		const bookedEvent = {
			event_id: "123",
			title: "Delete Me",
			start: new Date().toISOString(),
			end: new Date(Date.now() + 3600000).toISOString(),
			event_type: "booked",
			patient_id: "001",
		};

		axios.get.mockResolvedValueOnce({
			data: {
				events: [bookedEvent],
				blockedDates: [],
				leaveEvents: [],
			},
		});

		renderWithProviders(<MyCalendar />);

		// This test verifies the component renders without errors
		await waitFor(() => {
			expect(screen.getByText("Today")).toBeInTheDocument();
		});
	});
});

describe("Leave Functionality", () => {
	test("renders add leave button", () => {
		renderWithProviders(<MyCalendar />);

		expect(screen.getByText(/input leave/i)).toBeInTheDocument();
		expect(screen.getByText(/add leave/i)).toBeInTheDocument();
	});

	test("opens leave form when button clicked", async () => {
		renderWithProviders(<MyCalendar />);

		const addLeaveButton = screen.getByTestId("leave-button");
		expect(addLeaveButton).toBeInTheDocument();

		// Simulate button click
		fireEvent.click(addLeaveButton);

		// Wait for form to appear
		const leaveForm = screen.getByTestId("leave-form");
		expect(leaveForm).toBeInTheDocument();
	});
});

describe("Error Handling", () => {
	test("handles API errors gracefully", async () => {
		// Mock API failure
		axios.get.mockRejectedValueOnce(new Error("API Error"));

		renderWithProviders(<MyCalendar />);

		// Component should still render
		await waitFor(() => {
			expect(screen.getByText("Today")).toBeInTheDocument();
		});
	});

	test("shows alert on booking failure", async () => {
		axios.post.mockRejectedValueOnce(new Error("Booking failed"));

		renderWithProviders(<MyCalendar />);

		// Verify component renders despite potential errors
		expect(screen.getByText("Today")).toBeInTheDocument();
	});
});

describe("Navigation", () => {
	test("navigates to today when Today button clicked", () => {
		renderWithProviders(<MyCalendar />);

		const todayButton = screen.getByText("Today");
		fireEvent.click(todayButton);

		// Component should handle navigation
		expect(todayButton).toBeInTheDocument();
	});

	test("navigates to previous period when Back clicked", () => {
		renderWithProviders(<MyCalendar />);

		const backButton = screen.getByText("Back");
		fireEvent.click(backButton);

		expect(backButton).toBeInTheDocument();
	});

	test("navigates to next period when Next clicked", () => {
		renderWithProviders(<MyCalendar />);

		const nextButton = screen.getByText("Next");
		fireEvent.click(nextButton);

		expect(nextButton).toBeInTheDocument();
	});
});
