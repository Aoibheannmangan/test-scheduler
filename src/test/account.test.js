import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Account from "../pages/account";
import axios from 'axios';
import { FaLeaf } from "react-icons/fa";

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

const mockUseData = jest.fn();
jest.mock("../hooks/DataContext", () => ({
  useData: () => mockUseData(),
}));

describe('Account Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the account page", () => {
    mockUseData.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      updatedPatient: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading appointments/i)).toBeInTheDocument();
  });

  test("displays message when no patient data is available", () => {
    mockUseData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      updatedPatient: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    expect(screen.getByText(/no patient/i)).toBeInTheDocument();
  });

  test("displays patient list when available", () => {
    mockUseData.mockReturnValue({
      loading: false,
      error: null,
      updatedPatient: jest.fn(),
      data: [
        {
          record_id: "123",
          nn_dob: "2020-05-01",
          nn_sex: "1",
          reg_ooa: "0",
          reg_dag: "2",
          reg_patient_group: "1",
          reg_gest_age_w: 35,
          reg_gest_age_d: 2,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    const idMatches = screen.getAllByText((content, node) => {
      const text = node.textContent;
      return text && text.match(/Id:\s*123/i);
    });

    expect(idMatches.length).toBeGreaterThan(0);

    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/coombe/i)).toBeInTheDocument();
  });
});

