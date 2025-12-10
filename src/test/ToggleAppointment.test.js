import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ToggleAppointment from "../pages/Appointment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Mock mui pickers (return dayjs objects)
jest.mock("@mui/x-date-pickers/DatePicker", () => {
	const React = require("react");
	const dayjs = require("dayjs"); // import inside the factory
	return {
		DatePicker: ({ label, value, onChange }) => (
			<input
				aria-label={label}
				value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
				onChange={(e) => onChange(dayjs(e.target.value))}
			/>
		),
	};
});

jest.mock("@mui/x-date-pickers/TimePicker", () => {
	const React = require("react");
	const dayjs = require("dayjs");
	return {
		TimePicker: ({ label, value, onChange }) => (
			<input
				aria-label={label}
				value={value ? dayjs(value).format("HH:mm") : ""}
				onChange={(e) => onChange(dayjs(e.target.value, "HH:mm"))}
			/>
		),
	};
});

// Helper function to wrap component with required providers
const renderWithProviders = (component) => {
	return render(
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			{component}
		</LocalizationProvider>
	);
};

describe("ToggleAppointment Component", () => {
	const mockAddAppointment = jest.fn();
	const mockClose = jest.fn();

	const mockRoomList = [
		{ id: "room1", label: "Assessment Room 1", dbId: 2 },
		{ id: "room2", label: "Assessment Room 2", dbId: 3 },
	];

	const mockUserList = [
		{
			record_id: "001",
			nicu_dc_outcome: "1",
			v2_attend: "0",
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Form Rendering", () => {
		test("renders all required form fields when open", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			expect(screen.getByLabelText(/patient id/i)).toBeInTheDocument();
			expect(
				screen.getByLabelText(/appointment date/i)
			).toBeInTheDocument();
			expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
			expect(screen.getByLabelText("End Time")).toBeInTheDocument();
			expect(
				screen.getByLabelText(/assessment room/i)
			).toBeInTheDocument();
			expect(screen.getByLabelText(/visit note/i)).toBeInTheDocument();
		});

		test("does not render when isOpen is false", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={false}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			expect(
				screen.queryByLabelText(/patient id/i)
			).not.toBeInTheDocument();
		});

		test("renders room options correctly", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			const roomSelect = screen.getByLabelText(/assessment room/i);
			expect(roomSelect).toBeInTheDocument();

			fireEvent.mouseDown(roomSelect);
			expect(screen.getByText(/assessment room 1/i)).toBeInTheDocument();
			expect(screen.getByText(/assessment room 2/i)).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		test("prevents submission with empty patient ID", async () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			fireEvent.click(screen.getByText(/submit/i));
			expect(mockAddAppointment).not.toHaveBeenCalled();
		});

		test("validates required time fields", async () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			fireEvent.change(screen.getByLabelText(/patient id/i), {
				target: { value: "001" },
			});

			fireEvent.click(screen.getByText(/submit/i));
			await waitFor(() => {
				expect(mockAddAppointment).not.toHaveBeenCalled();
			});
		});

		test("validates room selection", async () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			fireEvent.change(screen.getByLabelText(/patient id/i), {
				target: { value: "001" },
			});

			fireEvent.click(screen.getByText(/submit/i));
			expect(mockAddAppointment).not.toHaveBeenCalled();
		});
	});

	describe("Form Submission", () => {
		test("submits form with valid complete data", async () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			fireEvent.change(screen.getByLabelText(/patient id/i), {
				target: { value: "001" },
			});
			fireEvent.change(screen.getByLabelText(/appointment date/i), {
				target: { value: "2025-12-01" },
			});
			fireEvent.change(screen.getByLabelText(/start time/i), {
				target: { value: "10:00" },
			});

			fireEvent.click(
				screen.getByLabelText(/override calculated end time/i)
			);

			fireEvent.change(screen.getByLabelText("End Time"), {
				target: { value: "11:00" },
			});
			fireEvent.change(screen.getByLabelText(/assessment room/i), {
				target: { value: "room1" },
			});
			fireEvent.change(screen.getByLabelText(/visit note/i), {
				target: { value: "Follow-up visit" },
			});

			fireEvent.click(screen.getByText(/submit/i));
			expect(mockAddAppointment).toHaveBeenCalledTimes(1);
		});
	});

	describe("User Interactions", () => {
		test("closes form when close button clicked", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			fireEvent.click(screen.getByText(/close/i));
			expect(mockClose).toHaveBeenCalledTimes(1);
		});

		test("allows override checkbox to enable manual end time", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			const overrideCheckbox = screen.getByLabelText(
				/override calculated end time/i
			);
			fireEvent.click(overrideCheckbox);
			expect(overrideCheckbox.checked).toBe(true);
		});
	});

	describe("Accessibility", () => {
		test("has proper labels for all inputs", () => {
			renderWithProviders(
				<ToggleAppointment
					isOpen={true}
					onAddAppointment={mockAddAppointment}
					onClose={mockClose}
					bookedEvents={[]}
					blockedDates={[]}
					roomList={mockRoomList}
					userList={mockUserList}
				/>
			);

			expect(screen.getByLabelText(/patient id/i)).toBeInTheDocument();
			expect(
				screen.getByLabelText(/appointment date/i)
			).toBeInTheDocument();
			expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
			expect(screen.getByLabelText("End Time")).toBeInTheDocument();
			expect(
				screen.getByLabelText(/assessment room/i)
			).toBeInTheDocument();
			expect(screen.getByLabelText(/visit note/i)).toBeInTheDocument();
		});
	});
});
