import React, { useEffect, useState, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { useData } from "../hooks/DataContext";
import axios from "axios";

/**
 * Forecast component that displays a forecast of booked appointments per month.
 *
 * Fetches booked events from `localStorage`, counts appointments per month, and
 * displays the data in a paginated table.
 *
 * @component
 * @example
 * <Route path="/forecast" element={<Forecast />} />
 * @returns {JSX.Element} The Forecast component that renders the appointment forecast table.
 */
import { getAppointmentsPerMonth } from "../hooks/forecast";

// Table column definitions
const columns = [
  { id: "monthYear", label: "Month", minWidth: 170 },
  { id: "booked", label: "Booked", minWidth: 100, align: "right" },
  { id: "window", label: "Window", minWidth: 100, align: "right" },
];

/**
 * Creates a data row for the table.
 *
 * @param {string} monthYear - The month and year (e.g., "January 2025").
 * @param {number} count - The number of appointments booked in that month.
 * @returns {Object} A data row object containing the monthYear and count.
 */
const createData = (monthYear, booked, window) => ({
  monthYear,
  booked,
  window,
});

/**
 * Forecast component for displaying appointments.
 * @returns {JSX.Element} The Forecast component that displays the forecast of booked appointments per month.
 */
const Forecast = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const { data: apiPatients } = useData();
  const [patientList, setPatientList] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [monthlyCounts, setMonthlyCounts] = useState({});
  const [appointmentRows, setAppointmentRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * Loads booked events from localStorage and parses the dates into Date objects.
   * This effect runs only once when the component is mounted.
   *
   * @returns {void}
   */
  useEffect(() => {
    if (apiPatients) setPatientList(apiPatients);
  }, [apiPatients]);

  /** Fetch bookings from backend */
  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const events = response.data.events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        patientId: event.patient_id,
        id: event.event_id,
      }));

      setBookedEvents(events);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, []);

  /** Fetch bookings on mount */
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /** Map API patients to internal structure */
  useEffect(() => {
    if (!patientList || !Array.isArray(apiPatients)) return;

    const mappedPatients = apiPatients.map((p) => {
      let visitNum = 1;
      if (p.visit_1_nicu_discharge_complete === "1") {
        visitNum = 2;
        for (let i = 2; i <= 6; i++) {
          if (p[`v${i}_attend`] === "1") visitNum = i + 1;
          else break;
        }
      }

      return {
        id: p.record_id || "",
        type: p.type || "window",
        visitNum,
        outOfArea: p.reg_ooa === "1",
        dob: p.nn_dob || "",
        site: { 1: "CUMH", 2: "Coombe", 3: "Rotunda" }[p.reg_dag] || "Unknown",
        study: ["AIMHIGH"], // Hardcoded for REDCap study
        daysEarly: p.reg_days_early ? Number(p.reg_days_early) : 0,
        info: "",
        notes: p.nicu_email || "",
        email: p.nicu_email || "",
        participantGroup: p.reg_participant_group || "",
        reg_date1: p.reg_date1,
        reg_date2: p.reg_date2,
        reg_9_month_window: p.reg_9_month_window,
        reg_12_month_window: p.reg_12_month_window,
        reg_17_month_window: p.reg_17_month_window,
        reg_19_month_window: p.reg_19_month_window,
        reg_23_month_window: p.reg_23_month_window,
        reg_25_month_window: p.reg_25_month_window,
        reg_30_month_window: p.reg_30_month_window,
        reg_31_month_window: p.reg_31_month_window,
      };
    });

    setPatientList(mappedPatients);
  }, [apiPatients]);

  /** Combine patients with their booked/window events */
  useEffect(() => {
    if (!patientList.length) return;

    const combinedEvents = [];

    patientList.forEach((patient) => {
      const patientBookings = bookedEvents.filter(
        (e) => e.patientId === patient.id
      );

      const upcomingBooked = patientBookings.find(
        (e) => e.event_type === "booked" && e.end >= new Date()
      );
      const windowEvent = patientBookings.find(
        (e) => e.event_type === "window"
      );

      const eventToDisplay = upcomingBooked || windowEvent || null;

      combinedEvents.push({
        ...patient,
        ...eventToDisplay,
        id: eventToDisplay?.id || patient.id,
        displayId: patient.id,
        type: eventToDisplay?.event_type || "window",
        visitNum: patient.visitNum,
        start: eventToDisplay?.start || null,
      });
    });

    setDisplayEvents(combinedEvents);
  }, [patientList, bookedEvents]);

  /** Compute monthly counts for table */
  useEffect(() => {
    const counts = getAppointmentsPerMonth(displayEvents);
    setMonthlyCounts(counts);
  }, [displayEvents]);

  /**
   * Prepares the table rows based on the monthly appointment counts.
   * The rows are sorted chronologically by month and year.
   *
   * @returns {void}
   */
  useEffect(() => {
    const sorted = Object.entries(monthlyCounts)
      .sort(([a], [b]) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`)
        );
      })
      .map(([monthYear, counts]) =>
        createData(monthYear, counts.booked, counts.window)
      );

    setAppointmentRows(sorted);
  }, [monthlyCounts]);

  /**
   * Handles page change in the table pagination.
   *
   * @param {Event} _event - The pagination event.
   * @param {number} newPage - The new page number to display.
   * @returns {void}
   */
  const handleChangePage = (_event, newPage) => setPage(newPage);

  /**
   * Handles the change in the number of rows per page in the table pagination.
   *
   * @param {React.ChangeEvent} event - The event triggering the change in rows per page.
   * @returns {void}
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Appointment Forecast</h1>

      {appointmentRows.length === 0 ? (
        <p>There are currently no appointments booked</p>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="appointments table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {appointmentRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover tabIndex={-1} key={row.monthYear}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={appointmentRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {console.log("Booked Events:", bookedEvents)}
      {console.log("Display Events:", displayEvents)}
      {console.log("Monthly Counts:", monthlyCounts)}
    </div>
  );
};

export default Forecast;