import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyCalendar from "../pages/Calendar";
import { useAppointmentFilters } from "../hooks/useAppointmentFilters";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";

jest.mock("../hooks/useAppointmentFilters");

const localizer = momentLocalizer(moment);
const now = new Date();

const mockAppointmentEvents = [
  {
    title: "Visit Test",
    id: "001",
    type: "booked",
    start: new Date(now.setHours(12, 0, 0, 0)).toISOString(),
    end: new Date(now.setHours(13, 0, 0, 0)).toISOString(),
    visitNum: 1,
    OutOfArea: false,
    Name: "John Doe",
    DOB: "2025-01-01",
    site: "Kildare",
    Study: ["AIMHIGH"],
    room: "room1",
    notes: "Initial visit",
  },
  {
    title: "Study Window Test",
    id: "002",
    type: "window",
    start: new Date(now.setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(now.setHours(15, 0, 0, 0)).toISOString(),
    visitNum: 2,
    OutOfArea: true,
    Name: "Jane Smith",
    DOB: "2025-05-20",
    site: "Kildare",
    Study: ["COOLPRIME"],
    room: "room2",
    notes: "Window period",
  },
];

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify(mockAppointmentEvents)
  );

  useAppointmentFilters.mockReturnValue({
    searchQuery: "",
    setSearchQuery: jest.fn(),
    selectedStudies: [],
    handleStudyChange: jest.fn(),
    filteredAppointments: mockAppointmentEvents,
  });
});

test("renders calendar with buttons and views", () => {
  render(<MyCalendar localizer={localizer} />);
  ["Today", "Back", "Next", "Month", "Week", "Day", "Agenda"].forEach((label) =>
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument()
  );
});

test("renders booked and window events", () => {
  render(<MyCalendar localizer={localizer} />);
  expect(screen.getByText(/Visit Test/i)).toBeInTheDocument();
  expect(screen.getByText(/Study Window Test/i)).toBeInTheDocument();
});

test("Week Button functions", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(screen.getByText(/week/i));

  const weekStart = moment(now).startOf("week");
  const weekEnd = moment(now).endOf("week");
  const expectedLabel = `${weekStart.format("MMMM DD")} – ${weekEnd.format(
    "DD"
  )}`;

  expect(
    await screen.findByText(
      (content, node) => node?.textContent === expectedLabel
    )
  ).toBeInTheDocument();
});

test("opens edit popup on event click", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(screen.getByText(/Visit Test/i));
  expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();
});

test("edits event title and saves", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(screen.getByText(/Visit Test/i));

  const titleInput = await screen.findByLabelText(/Title:/i);
  fireEvent.change(titleInput, { target: { value: "Updated Title" } });

  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => {
    expect(screen.queryByText(/Edit Event/i)).not.toBeInTheDocument();
  });
});

test("deletes an event", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(
    screen.getByText((content, node) =>
      node?.textContent?.includes("Visit Test")
    )
  );
  fireEvent.click(screen.getByText(/Delete Appointment/i));

  expect(
    await screen.findByText((content, node) =>
      node?.textContent?.includes("Delete")
    )
  ).toBeInTheDocument();

  const confirmButtons = screen.getAllByText(/Confirm/i);
  fireEvent.click(confirmButtons[0]);

  await waitFor(() => {
    expect(
      screen.queryByText((content, node) =>
        node?.textContent?.includes("Visit Test")
      )
    ).not.toBeInTheDocument();
  });
});

test("closes edit popup after delete confirmation", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(screen.getByText(/Visit Test/i)); // open edit popup
  expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Delete Appointment/i)); // open delete popup
  const confirmButtons = await screen.findAllByText(/Confirm/i);
  fireEvent.click(confirmButtons[0]); // confirm delete

  await waitFor(
    expect(screen.queryByText(/Edit Event/i)).not.toBeInTheDocument(),
    { timeout: 3000 }
  );
  await waitFor(
    expect(screen.queryByText(/Delete Appointment/i)).not.toBeInTheDocument()
  );
});

test("cancel delete keeps edit popup open", async () => {
  render(<MyCalendar localizer={localizer} />);
  fireEvent.click(screen.getByText(/Visit Test/i));
  expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Delete Appointment/i));
  const cancelButton = screen.getByText(/Cancel/i);
  fireEvent.click(cancelButton);

  await waitFor(() => {
    expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
  });
});

test("blocks a date and shows blocked event", async () => {
  render(<MyCalendar localizer={localizer} />);
  const dateInputs = screen.getAllByLabelText(/select date to block:/i);
  const dateInput = dateInputs[0]; // pick the first one

  const today = moment().format("DD-MM-YYYY");
  fireEvent.change(dateInput, { target: { value: today } });

  fireEvent.click(screen.getByRole("button", { name: /block date/i }));

  expect(
    await screen.findByText((content, node) => {
      return node?.textContent?.toLowerCase().includes("Blocked");
    })
  ).toBeInTheDocument();
});

test("filters events by room", async () => {
  render(<MyCalendar localizer={localizer} />);
  const roomCheckbox = screen.getByLabelText(/Assessment Room 1/i);
  fireEvent.click(roomCheckbox); // uncheck room1

  await waitFor(() => {
    expect(screen.queryByText(/Visit Test/i)).not.toBeInTheDocument();
  });
});

test("searches for patient window", async () => {
  render(<MyCalendar localizer={localizer} />);

  const input = screen.getByPlaceholderText(/Enter Patient ID/i);
  fireEvent.change(input, { target: { value: "002" } });

  fireEvent.click(screen.getByRole("button", { name: /search window/i }));

  // wait and assert the patient info shows up
  const patientInfo = await screen.findByText(
    /Patient Info/i,
    {},
    { timeout: 3000 }
  );
  expect(patientInfo).toBeInTheDocument();
});

test("search for non-existent patient shows no results", async () => {
  render(<MyCalendar localizer={localizer} />);
  const input = screen.getByPlaceholderText(/Enter Patient ID/i);
  fireEvent.change(input, { target: { value: "999" } });

  fireEvent.click(screen.getByRole("button", { name: /search window/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Patient Info/i)).not.toBeInTheDocument();
  });
});

test("opens appointment booking form", () => {
  render(<MyCalendar localizer={localizer} />);
  const buttons = screen.getAllByRole("button");
  const calendarButton = buttons.find((btn) =>
    btn.innerHTML.includes("bookIcon")
  );
  fireEvent.click(calendarButton);
  expect(screen.getByText(/Tip:/i)).toBeInTheDocument();
});
