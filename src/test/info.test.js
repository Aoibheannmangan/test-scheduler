import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserInfo from "../pages/info";

test("renders the signup form", () => {
  render(
    <MemoryRouter>
      <UserInfo />
    </MemoryRouter>
  );
  const nameInput = screen.getByLabelText(/name/i);
  const dateInput = screen.getByLabelText(/patient date of birth/i);
  const earlyInput = screen.getByLabelText(/days born before due date/i);
  const sexInput = screen.getByLabelText(/sex/i);
  const conditionInput = screen.getByLabelText(/condition/i);
  const siteInput = screen.getByLabelText(/site/i);
  const infoInput = screen.getByLabelText(/info/i);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  expect(nameInput).toBeInTheDocument();
  expect(dateInput).toBeInTheDocument();
  expect(earlyInput).toBeInTheDocument();
  expect(sexInput).toBeInTheDocument();
  expect(conditionInput).toBeInTheDocument();
  expect(siteInput).toBeInTheDocument();
  expect(infoInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("allows user to fill and submit the form", () => {
  render(
    <MemoryRouter>
      <UserInfo />
    </MemoryRouter>
  );
  const nameInput = screen.getByLabelText(/name/i);
  const dateInput = screen.getByLabelText(/patient date of birth/i);
  const earlyInput = screen.getByLabelText(/days born before due date/i);
  const sexInput = screen.getByLabelText(/sex/i);
  const conditionInput = screen.getByLabelText(/condition/i);
  const siteInput = screen.getByLabelText(/site/i);
  const infoInput = screen.getByLabelText(/info/i);
  const aimhighCheckbox = screen.getByLabelText(/aimhigh/i);
  const yesRadio = screen.getByLabelText(/yes/i);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  fireEvent.change(nameInput, { target: { value: "Test" } });
  fireEvent.change(dateInput, { target: { value: "2025-08-07" } });
  fireEvent.change(earlyInput, { target: { value: "5" } });
  fireEvent.change(sexInput, { target: { value: "Female" } });
  fireEvent.change(conditionInput, { target: { value: "High Risk Infant" } });
  fireEvent.click(aimhighCheckbox);
  fireEvent.change(siteInput, { target: { value: "Cork" } });
  fireEvent.click(yesRadio);
  fireEvent.change(infoInput, { target: { value: "Additional notes" } });
  fireEvent.click(submitButton);
});

test('edits an existing patient and updates localStorage', async () => {
  const existingPatient = {
    id: '230-001',
    Name: 'Felix',
    DOB: '2025-08-29',
    DaysEarly: '3',
    Sex: 'Male',
    Condition: 'Control',
    Study: ['EDI'],
    site: 'CUMH',
    OutOfArea: false,
    Info: 'Some info',
    type: 'window',
    visitNum: 1,
    room: '101',
    notes: 'Initial Notes',
  };

  localStorage.setItem('editPatient', JSON.stringify(existingPatient));
  localStorage.setItem('userInfoList', JSON.stringify([existingPatient]));

  render(
    <MemoryRouter>
      <UserInfo />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue('Felix')).toBeInTheDocument();
  });

  const nameInput = screen.getByDisplayValue('Felix');
  fireEvent.change(nameInput, { target: { value: 'Chris' } });

  const saveButton = screen.getByRole('button', { name: /save|submit/i });
  fireEvent.click(saveButton);

  await waitFor(() => {
    const updatedList = JSON.parse(localStorage.getItem('userInfoList'));
    expect(screen.getByText(/successfully updated/i)).toBeInTheDocument();
  });
});
