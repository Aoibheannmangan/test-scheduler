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
				sch_premdays: 5,
				reg_email: "patient001@test.com",
				nicu_dc_outcome: "1",
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
				sch_premdays: 10,
				reg_email: "patient002@test.com",
				nicu_dc_outcome: "1",
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

		test("expansion toggle functional", () => {
			render(<Appointments />);

			const patientLabel = screen.getByText(/001\s*\+/);
			expect(patientLabel).toBeInTheDocument();

			fireEvent.click(patientLabel); // Expand
			expect(screen.getByText(/date of birth:/i)).toBeInTheDocument();

			fireEvent.click(patientLabel); // Collapse
			expect(
				screen.queryByText(/date of birth:/i)
			).not.toBeInTheDocument();
		});
	});

	describe("Booked appointment info", () => {
		beforeEach(() => {
			const { useData } = require("../hooks/DataContext");
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");

			useData.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			const start = new Date("2025-01-10T10:00:00");
			const end = new Date("2025-01-10T11:00:00");

			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						id: "001",
						displayId: "001",
						type: "booked",
						visit_num: 2,
						start,
						end,
						DOB: "2020-01-02",
						OutOfArea: false,
					},
					{
						id: "002",
						displayId: "002",
						type: "window",
						visit_num: 7,
						start: null,
						end: null,
						DOB: "2020-01-02",
						OutOfArea: false,
					},
				],
			});
		});
		test("renders date and time", () => {
			render(<Appointments />);

			const patientLabel = screen.getByText(/001\s*\+/);
			expect(patientLabel).toBeInTheDocument();

			fireEvent.click(patientLabel); // Expand
			expect(screen.getByText(/10 January 2025/i)).toBeInTheDocument();
			expect(screen.getByText(/10:00 - 11:00/i)).toBeInTheDocument();
		});

		test("render visit num", () => {
			render(<Appointments />);

			const visitNumContainer = screen.getAllByTestId("visit-number")[0];
			expect(visitNumContainer).toHaveTextContent("2");
		});

		test("render complete visit indicator", () => {
			render(<Appointments />);

			const visitCompleteNumContainer =
				screen.getAllByTestId("visit-number")[1];
			expect(visitCompleteNumContainer).toHaveTextContent("Complete");
		});

		test("renders 'N/A'", () => {
			// Override the mock test and render blank to see N/A
			const { useData } = require("../hooks/DataContext");
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");

			useData.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});
			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						id: "001",
						displayId: "001",
						type: "booked",
						visit_num: 2,
						start: null,
						end: null,
						DOB: "2020-01-02",
						OutOfArea: false,
					},
				],
			});

			render(<Appointments />);

			const patientLabel = screen.getByText(/001\s*\+/);
			expect(patientLabel).toBeInTheDocument();

			fireEvent.click(patientLabel); // Expand
			expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
		});
	});

	describe("Window event info", () => {
		beforeEach(() => {
			// Mock useData
			const { useData } = require("../hooks/DataContext");
			useData.mockReturnValue({
				data: [
					{
						record_id: "001",
						nn_dob: "2020-01-02",
						reg_ooa: "0",
						reg_dag: 1,
						type: "window",
						visit_num: 2,
						reg_email: "test@example.com",
					},
					{
						record_id: "002",
						nn_dob: "2020-01-02",
						reg_ooa: "0",
						reg_dag: 1,
						type: "window",
						visit_num: 1, // still in NICU
						reg_email: "nicupatient@example.com",
						nicu_dc_outcome: "0",
					},
				],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			// Mock useAppointmentFilters
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");
			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						id: "001",
						displayId: "001",
						type: "window",
						visit_num: 2, // transition visit example
						DOB: "2020-01-02",
						OutOfArea: false,
						Study: ["AIMHIGH"],
						email: "test@example.com",
					},
					{
						id: "002",
						displayId: "002",
						type: "window",
						visit_num: 1, // transition visit example
						DOB: "2020-01-02",
						OutOfArea: false,
						Study: ["AIMHIGH"],
					},
				],
			});
		});
		test("renders transition visit num", () => {
			render(<Appointments />);

			const visitNumContainer = screen.getAllByTestId("visit-number")[0];
			expect(visitNumContainer).toHaveTextContent("1 → 2");
		});

		test("Patient in NICU displayed", () => {
			render(<Appointments />);

			const patientLabel = screen.getByText(/002\s*\+/);
			expect(patientLabel).toBeInTheDocument();
			fireEvent.click(patientLabel); // Expand

			const statusLabel = screen.getByTestId("status-label");
			expect(statusLabel).toHaveTextContent(
				/participant is still in nicu/i
			);
		});

		test("renders contact number", () => {
			render(<Appointments />);

			const patientLabel = screen.getByText(/001\s*\+/);
			expect(patientLabel).toBeInTheDocument();
			fireEvent.click(patientLabel); // Expand

			const contactLabel = screen.getByTestId("contact-label");
			expect(contactLabel).toBeInTheDocument();
			fireEvent.click(contactLabel); // Expand contact toggle

			const email = screen.getByText(/test@example.com/i);
			expect(email).toBeInTheDocument();
		});
	});

	describe("Rendering Proximity Indicator", () => {
		// Set up methods for loading notifiers:
		beforeEach(() => {
			const { useData } = require("../hooks/DataContext");
			const {
				useAppointmentFilters,
			} = require("../hooks/useAppointmentFilters");

			const farDate = new Date();
			farDate.setMonth(farDate.getMonth() + 2);

			const midDate = new Date();
			midDate.setDate(midDate.getDate() + 14);

			const closeDate = new Date();
			closeDate.setDate(closeDate.getDate() + 2);

			useData.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				updatePatient: jest.fn(),
			});

			useAppointmentFilters.mockReturnValue({
				searchQuery: "",
				setSearchQuery: jest.fn(),
				selectedStudies: ["AIMHIGH", "COOLPRIME", "EDI"],
				handleStudyChange: jest.fn(),
				filteredAppointments: [
					{
						id: "001",
						OutOfArea: false,
						type: "booked",
						visit_num: 2,
						start: farDate,
					},
					{
						id: "002",
						OutOfArea: false,
						type: "booked",
						visit_num: 4,
						start: midDate,
					},
					{
						id: "003",
						OutOfArea: false,
						type: "booked",
						visit_num: 3,
						start: closeDate,
					},
				],
			});
		});
		test("green indicator", () => {
			render(<Appointments />);

			expect(screen.getByTestId(/far-notifier/i)).toBeInTheDocument();
		});

		test("orange indicators", () => {
			render(<Appointments />);

			expect(screen.getByTestId(/mid-notifier/i)).toBeInTheDocument();
		});

		test("red visit number", () => {
			render(<Appointments />);

			expect(screen.getByTestId(/far-notifier/i)).toBeInTheDocument();
		});
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
