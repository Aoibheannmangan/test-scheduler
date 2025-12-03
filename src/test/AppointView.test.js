import {
	render,
	screen,
	fireEvent,
	waitFor,
	getByText,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Appointments from "../pages/AppointView";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock the DataContext
jest.mock("../hooks/DataContext", () => ({
	useData: jest.fn(() => ({
		data: [
			{
				record_id: "001",
				nn_dob: "2024-01-01",
				nn_sex: "1",
				reg_ooa: "0",
				reg_dag: "1",
				reg_participant_group: "1",
				reg_days_early: 5,
				nicu_email: "patient001@test.com",
				visit_1_nicu_discharge_complete: "1",
				v2_attend: "0",
				v3_attend: "0",
				v4_attend: "0",
				v5_attend: "0",
				v6_attend: "0",
				reg_date1: "2025-02-01",
				reg_date2: "2025-02-28",
				reg_9_month_window: "2025-03-01",
				reg_12_month_window: "2025-03-31",
			},
			{
				record_id: "002",
				nn_dob: "2024-05-20",
				nn_sex: "2",
				reg_ooa: "1",
				reg_dag: "2",
				reg_participant_group: "2",
				reg_days_early: 10,
				nicu_email: "patient002@test.com",
				visit_1_nicu_discharge_complete: "1",
				v2_attend: "1",
				v3_attend: "0",
				v4_attend: "0",
				v5_attend: "0",
				v6_attend: "0",
				reg_date1: "2025-01-01",
				reg_date2: "2025-01-31",
				reg_9_month_window: "2025-04-01",
				reg_12_month_window: "2025-04-30",
			},
		],
		loading: false,
		error: null,
		updatePatient: jest.fn(),
	})),
}));

// Mock useAppointmentFilters hook
jest.mock("../hooks/useAppointmentFilters", () => ({
	useAppointmentFilters: jest.fn(),
}));

const { useAppointmentFilters } = require("../hooks/useAppointmentFilters");

describe("Appointments Component", () => {
	const mockBookedEvents = [
		{
			event_id: "123",
			patient_id: "001",
			title: "ID: 001 | Visit: 2",
			start: new Date("2025-02-15T10:00:00"),
			end: new Date("2025-02-15T13:00:00"),
			event_type: "booked",
			visit_num: 2,
			room_id: 2,
			note: "Follow-up appointment",
			no_show: false,
			out_of_window: false,
		},
	];

	const mockWindowEvents = [
		{
			patient_id: "002",
			title: "ID: 002 | Visit: 3",
			start: new Date("2025-04-15"),
			end: new Date("2025-04-15"),
			event_type: "window",
			visit_num: 3,
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock localStorage
		Storage.prototype.getItem = jest.fn(() => "mock-token");

		// Mock axios calls
		axios.get.mockResolvedValue({
			data: {
				events: mockBookedEvents,
			},
		});

		// Setup default mock return for useAppointmentFilters
		useAppointmentFilters.mockReturnValue({
			searchQuery: "",
			setSearchQuery: jest.fn(),
			selectedStudies: ["AIMHIGH", "COOLPRIME", "EDI"],
			handleStudyChange: jest.fn(),
			filteredAppointments: [],
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Loading and Error States", () => {
		test("shows loading message when data is loading", () => {
			const { useData } = require("../hooks/DataContext");
			useData.mockReturnValue({
				data: [],
				loading: true,
				error: null,
				updatePatient: jest.fn(),
			});

			render(<Appointments />);

			expect(
				screen.getByText(/loading appointments/i)
			).toBeInTheDocument();
		});

		test("shows error message when there is an error", () => {
			const { useData } = require("../hooks/DataContext");
			useData.mockReturnValue({
				data: [],
				loading: false,
				error: new Error("Failed to fetch data"),
				updatePatient: jest.fn(),
			});

			render(<Appointments />);

			expect(
				screen.getByText(/error loading appointments/i)
			).toBeInTheDocument();
		});
	});

	describe("Page and elements are rendering", () => {
		test("all containers and search bar is rendering", () => {
			const { useData } = require("../hooks/DataContext");

			useData.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			render(<Appointments />);

			expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
			expect(screen.getByTestId("search-container")).toBeInTheDocument();
			expect(screen.getByLabelText("mainTable")).toBeInTheDocument();
		});

		test("patients are rendering", async () => {
			const { useData } = require("../hooks/DataContext");
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");

			// Mock api call
			useData.mockReturnValue({
				data: [
					{
						record_id: "001",
						nn_dob: "2024-01-01",
						reg_dag: 1, // optional
					},
					{
						record_id: "002",
						nn_dob: "2024-05-20",
						reg_dag: 2,
					},
				],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			// Mock fetchBooking() so component doesn't fail
			axios.get.mockResolvedValue({
				data: { events: [] },
			});

			// Mock useAppointmentFilters to return these patients as filteredAppointments
			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH", "COOLPRIME", "EDI"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						displayId: "001",
						id: "001",
						visit_num: 1,
						type: "window",
					},
					{
						displayId: "002",
						id: "002",
						visit_num: 1,
						type: "window",
					},
				],
			});

			render(<Appointments />);

			// Check that patient IDs show up on the page
			expect(await screen.findByText(/001/)).toBeInTheDocument();
			expect(await screen.findByText(/002/)).toBeInTheDocument();
		});
	});

	describe("Table elements are loading", () => {
		// Set up methods for loading table elements:
		beforeEach(() => {
			const { useData } = require("../hooks/DataContext");
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");

			// Mock useData
			useData.mockReturnValue({
				data: [
					{ record_id: "001", nn_dob: "2024-01-01", reg_ooa: "1" }, // OOA
					{ record_id: "002", nn_dob: "2024-05-20", reg_ooa: "0" }, // Not OOA
				],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			// Mock useAppointmentFilters
			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH", "COOLPRIME", "EDI"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						id: "001",
						OutOfArea: true,
						type: "window",
						visit_num: 2,
					},
					{
						id: "002",
						OutOfArea: false,
						type: "window",
						visit_num: 2,
					},
				],
			});
		});

		test("renders headings", () => {
			render(<Appointments />);

			expect(screen.getByTestId("patient-heading")).toBeInTheDocument();
			expect(screen.getByTestId("visit-heading")).toBeInTheDocument();
			expect(screen.getByTestId("kildare-heading")).toBeInTheDocument();
		});

		test("render ooa present and not", () => {
			render(<Appointments />);

			const ooaIndicators = screen.getAllByTestId("indicator");
			expect(ooaIndicators[0]).toBeVisible(); // OOA patient
			expect(ooaIndicators[1]).not.toBeVisible(); // In-area patient
		});

		test("empty table when no matches", () => {
			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH", "COOLPRIME", "EDI"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [],
			});

			render(<Appointments />);

			expect(
				screen.getByText(/no matching appointments found/i)
			).toBeInTheDocument();
		});

		test("expansion toggle functional", () => {});
	});

	describe("Booked appointment info", () => {
		test("renders date and time", () => {});

		test("render expansion", () => {});

		test("renders 'N/A'", () => {});
	});

	describe("Window event info", () => {
		test("renders visit num", () => {});

		test("Patient in NICU displayed", () => {});

		test("Patient is complete", () => {});

		test("renders contact number", () => {});
	});

	describe("Rendering Proximity Indicator", () => {
		test("green indicator", () => {});

		test("orange indicators", () => {});

		test("red visit number", () => {});
	});

	describe("API + Data Fetching", () => {
		test("call the useData() hook", () => {
			const { useData } = require("../hooks/DataContext");
			useData.mockReturnValue({});
		});

		test("call the fetchBookings() on mount", async () => {
			const { useData } = require("../hooks/DataContext");
			useData.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			render(<Appointments />);

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});
	});

	test("perform a get request to /api.appointments", async () => {
		const { useData } = require("../hooks/DataContext");
		useData.mockReturnValue({
			data: [],
			loading: false,
			error: null,
			updatePatient: jest.fn(),
		});

		render(<Appointments />);

		// Check if this endpoint is reached
		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/appointments"),
				expect.any(Object)
			);
		});
	});
});
