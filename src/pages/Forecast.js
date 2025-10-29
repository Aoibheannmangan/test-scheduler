import React, { useEffect, useState} from 'react'; 
import { getAppointmentsPerMonth }  from '../hooks/forecast';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { min } from 'moment';

const columns = [
    {id: "monthYear", label: "Month", minWidth: 170},
    {id: "count", label: "Number of Appointments", minWidth: 100, align: "right" }
];

function createData(monthYear, count){
    return {monthYear, count};
}

const Forecast = () => { 
    const [bookedEvents, setBookedEvents] = useState([]);
    const [monthlyCounts, setMonthlyCounts] = useState([]);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
        const parsedEvents = storedEvents.map(event => ({
            ...event,
            start: event.start ? new Date(event.start) : null,
            end: event.end ? new Date(event.end) : null,
        }));
        setBookedEvents(parsedEvents);
    }, []);


    useEffect(() => {
        const counts = getAppointmentsPerMonth(bookedEvents);
        setMonthlyCounts(counts);
    }, [bookedEvents]);

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
    </div>
  );
};


export default Forecast; 