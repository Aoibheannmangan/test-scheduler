import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { getAppointmentsPerMonth, getWindowsPerMonth } from "../hooks/forecast";

// Table column definitions
const columns = [
  { id: "monthYear", label: "Month", minWidth: 170 },
  { id: "count", label: "Number of Appointments", minWidth: 100, align: "right" }
];

const windowColumns = [
  { id: "windowMonthYear", label: "Month", minWidth: 170 },
  { id: "windowCount", label: "Number of Visit Windows", minWidth: 100, align: "right" }
];

// Helper functions to format row data
const createData = (monthYear, count) => ({ monthYear, count });
const createWindowData = (windowMonthYear, windowCount) => ({ windowMonthYear, windowCount });

const Forecast = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [windowEvents, setWindowEvents] = useState([]);
  const [monthlyCounts, setMonthlyCounts] = useState({});
  const [windowCounts, setWindowCounts] = useState({});
  const [appointmentRows, setAppointmentRows] = useState([]);
  const [windowRows, setWindowRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load booked events from localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    const parsedEvents = storedEvents.map((event) => ({
      ...event,
      start: event.start ? new Date(event.start) : null,
      end: event.end ? new Date(event.end) : null
    }));
    setBookedEvents(parsedEvents);

    // Filter for windows only
    const windows = parsedEvents.filter((e) => e.type === "window");
    setWindowEvents(windows);
  }, []);

  // Count appointments per month
  useEffect(() => {
    const appointmentEvents = bookedEvents.filter((e) => e.type === "booked");
    const counts = getAppointmentsPerMonth(appointmentEvents);
    setMonthlyCounts(counts);
  }, [bookedEvents]);

  // Count visit windows per month
  useEffect(() => {
    const counts = getWindowsPerMonth(windowEvents);
    setWindowCounts(counts);
  }, [windowEvents]);

  // Prepare appointment table rows
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

  // Prepare visit window table rows
  useEffect(() => {
    const sorted = Object.entries(windowCounts)
      .sort(([a], [b]) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");
        return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
      })
      .map(([windowMonthYear, windowCount]) => createWindowData(windowMonthYear, windowCount));
    setWindowRows(sorted);
  }, [windowCounts]);

  const handleChangePage = (_event, newPage) => setPage(newPage);
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

      <h1>Visit Window Forecast</h1>

      {windowRows.length === 0 ? (
        <p>There are no visit windows currently</p>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="visit window table">
              <TableHead>
                <TableRow>
                  {windowColumns.map((column) => (
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
                {windowRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover tabIndex={-1} key={row.windowMonthYear}>
                      {windowColumns.map((column) => (
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
            count={windowRows.length}
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
