import React, { useEffect, useState} from 'react'; 
import { getAppointmentsPerMonth, getWindowsPerMonth }  from '../hooks/forecast';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { min } from 'moment';
import Tab from '@mui/material/Tab';

const columns = [
    {id: "monthYear", label: "Month", minWidth: 170},
    {id: "count", label: "Number of Appointments", minWidth: 100, align: "right" }
];

const wincolumns = [
  {id: "windowMonthYear", label: "Month", minWidth: 170},
  {id: "windowCount", label: "Number of Visit Windows", minWidth: 100, align: "right" }
]

function createData(monthYear, count){
    return {monthYear, count};
}

function createWinData(windowMonthYear, windowCount){
  return {windowMonthYear, windowCount};
}

const Forecast = () => { 
    const [bookedEvents, setBookedEvents] = useState([]);
    const [windowEvents, setWindowEvents] = useState([]);
    const [studyWindows, setStudyWindows] = useState([]);
    const [monthlyCounts, setMonthlyCounts] = useState([]);
    const [windowCounts, setWindowCounts] = useState([]);
    const [rows, setRows] = useState([]);
    const [windowRows, setWindowRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Load the booked events (Appointments) from local storage
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
        const parsedEvents = storedEvents.map(event => ({
            ...event,
            start: event.start ? new Date(event.start) : null,
            end: event.end ? new Date(event.end) : null,
        }));
        setBookedEvents(parsedEvents);
    }, []);

    //Load window data from userInfoList
    useEffect(() => {
      const storedUserInfoList = JSON.parse(localStorage.getItem("userInfoList")) || [];

      const visitWindow = storedUserInfoList 
        .map(user => ({
          start: user.visitWindow ? new Date(user.visitWindow.start) : null,
          end: user.visitWindow ? new Date(user.visitWindow.end) : null,
          type: "window",
          patientId: user.patientId || user.id,
          title: user.title || `Window for ${user.patientId}`,
        }))
        .filter(window => window.start);
        setWindowEvents(visitWindow);
    })

    //Get the number of appointments per month
    useEffect(() => {
        const appointmentEvents = bookedEvents.filter(e => e.type === "booked")
        const counts = getAppointmentsPerMonth(appointmentEvents);
        setMonthlyCounts(counts);
    }, [bookedEvents]);

    //Get the number of visit windows per month
    useEffect(() => {
        const counts = getWindowsPerMonth(windowEvents);
        setWindowCounts(counts);
    }, [windowEvents]);

    //Sort and map appointments
    useEffect(() => {
        const sortedEntries = Object.entries(monthlyCounts).sort(([a], [b]) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const dateA = new Date(`${monthA} 1, ${yearA}`);
            const dateB = new Date(`${monthB} 1, ${yearB}`);
            return dateA - dateB;
    });

    const dataRows = sortedEntries.map(([monthYear, count]) => createData(monthYear, count));
        setRows(dataRows);
    }, [monthlyCounts]);

    //Sort and map visit windows
    useEffect(() => {
      const sortedWindowEntries = Object.entries(windowCounts).sort(([a], [b]) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
      });

      const windowDataRows = sortedWindowEntries.map(([windowMonthYear, windowCount]) => createWinData(windowMonthYear, windowCount));
        setWindowRows(windowDataRows);
      }, [windowCounts]);

    const handleChangePage = (_event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    

    return ( 
      <div style={{ padding: "1.5rem" }}>
        <h1>Appointment Forecast</h1>

        {rows.length === 0 ? (
          <p>There are currently no appointments booked</p>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="forecast table">
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
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover tabIndex={-1} key={row.monthYear}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
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
              <Table stickyHeader aria-label="forecast table">
                <TableHead>
                  <TableRow>
                    {wincolumns.map((column) => (
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
                      <TableRow hover TabIndex={-1} key={row.windowMonthYear}>
                        {wincolumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
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