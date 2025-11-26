import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

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
  { id: "count", label: "Number of Appointments", minWidth: 100, align: "right" }
];

/**
 * Creates a data row for the table.
 * 
 * @param {string} monthYear - The month and year (e.g., "January 2025").
 * @param {number} count - The number of appointments booked in that month.
 * @returns {Object} A data row object containing the monthYear and count.
 */
const createData = (monthYear, count) => ({ monthYear, count });

/**
 * Forecast component for displaying appointments.
 * @returns {JSX.Element} The Forecast component that displays the forecast of booked appointments per month.
 */
const Forecast = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
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
    const storedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    const parsedEvents = storedEvents.map((event) => ({
      ...event,
      start: event.start ? new Date(event.start) : null,
      end: event.end ? new Date(event.end) : null
    }));
    setBookedEvents(parsedEvents);
  }, []);

  /**
   * Filters booked events and counts the number of appointments per month.
   * Updates the monthlyCounts state with the results.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const appointmentEvents = bookedEvents.filter((e) => e.type === "booked");
    const counts = getAppointmentsPerMonth(appointmentEvents);
    setMonthlyCounts(counts);
  }, [bookedEvents]);

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
        return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
      })
      .map(([monthYear, count]) => createData(monthYear, count));
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
    </div>
  );
};

export default Forecast;
