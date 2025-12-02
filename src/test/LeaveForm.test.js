import React from "react";
import '@testing-library/jest-dom';
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import LeaveForm from "../components/LeaveForm";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock("@mui/x-date-pickers/DateTimePicker", () => {
  const React = require("react");
  const moment = require("moment");
  return{
    DateTimePicker: ({ label, value, onChange}) => (
      <input 
        aria-label={label}
        value={value ? moment(value).format("YYYY-MM-DD hh:mm") : ""}
        onChange={(e) => onChange(moment(e.target.value))}
      />
    ),
  };
});

const renderWithProviders = (component) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {component}
    </LocalizationProvider>
  );
};

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));


describe("LeaveForm Component", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all required form fields", () => {
    renderWithProviders(
      <LeaveForm />
    );

    expect(screen.getByLabelText(/staff name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /save leave/i})).toBeInTheDocument();
  });

  test("submits form with valid information", async () => {
    const mockSubmit = jest.fn();

    renderWithProviders(
      <LeaveForm onSave={mockSubmit}/>
    );

    fireEvent.change(screen.getByLabelText(/staff name/i), { target: {value: "Jane Doe"},});
    fireEvent.change(screen.getByLabelText(/start/i), {
      target: {value: "2025-12-01 10:00"},
    });
    fireEvent.change(screen.getByLabelText(/end/i), {
      target: {value: "2025-12-01 13:00"},
    });
    fireEvent.click(screen.getByText(/save leave/i));
    expect(mockSubmit).toHaveBeenCalledTimes(1);

  })

});