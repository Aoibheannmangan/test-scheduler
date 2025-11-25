import React, { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { useData } from "../hooks/DataContext";
import "./Forecast.css";
import { useBookings } from "../hooks/useBookings";

// Table column definitions
const columns = [
	{ id: "monthYear", label: "Month", minWidth: 170 },
	{ id: "booked", label: "Booked", minWidth: 100, align: "right" },
	{ id: "window", label: "Window", minWidth: 100, align: "right" },
	{ id: "total", label: "Total", minWidth: 100, align: "right" },
];

const createData = (monthYear, booked, window, total) => ({
	monthYear,
	booked,
	window,
	total,
});

/**
 * Helper function to get window dates for a specific visit number
 */
const getWindowDates = (patient, visitNum) => {
	switch (visitNum) {
		case 2:
			return { start: patient.reg_date1, end: patient.reg_date2 };
		case 3:
			return {
				start: patient.reg_9_month_window,
				end: patient.reg_12_month_window,
			};
		case 4:
			return {
				start: patient.reg_17_month_window,
				end: patient.reg_19_month_window,
			};
		case 5:
			return {
				start: patient.reg_23_month_window,
				end: patient.reg_25_month_window,
			};
		case 6:
			return {
				start: patient.reg_30_month_window,
				end: patient.reg_31_month_window,
			};
		default:
			return null;
	}
};

/**
 * Helper function to calculate visit number for a patient
 */
const calculateVisitNum = (patient) => {
	let visit_num = 1;
	if (patient.visit_1_nicu_discharge_complete === "1") {
		visit_num = 2;
		for (let i = 2; i <= 6; i++) {
			if (patient[`v${i}_attend`] === "1") {
				visit_num = i + 1;
			} else {
				break;
			}
		}
	}
	return visit_num;
};

const Forecast = () => {
	const { data: apiPatients, loading: patientsLoading } = useData();
	const { bookings, loading: bookingsLoading } = useBookings({
		autoFetch: true,
	});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Calculate monthly counts from bookings and patient windows - memoized
	const monthlyCounts = useMemo(() => {
		const counts = {};

		// Count booked appointments
		if (bookings && bookings.length > 0) {
			bookings.forEach((booking) => {
				if (booking.event_type === "booked" && booking.start) {
					const date = new Date(booking.start);
					const key = `${date.toLocaleString("default", {
						month: "long",
					})} ${date.getFullYear()}`;

					if (!counts[key]) {
						counts[key] = { booked: 0, window: 0 };
					}
					counts[key].booked += 1;
				}
			});
		}

		// Count patient windows
		if (apiPatients && apiPatients.length > 0) {
			apiPatients.forEach((patient) => {
				// Calculate current visit number
				const visitNum = calculateVisitNum(patient);

				// Only count if patient has upcoming visits (visit 1-6)
				if (visitNum >= 1 && visitNum <= 6) {
					const windowDates = getWindowDates(patient, visitNum);

					if (windowDates && windowDates.start) {
						const windowStart = new Date(windowDates.start);

						// Only count future windows or current month windows
						const today = new Date();
						today.setHours(0, 0, 0, 0);

						// Check if window is current or future
						const windowEnd = windowDates.end
							? new Date(windowDates.end)
							: windowStart;

						if (windowEnd >= today) {
							const key = `${windowStart.toLocaleString(
								"default",
								{
									month: "long",
								}
							)} ${windowStart.getFullYear()}`;

							if (!counts[key]) {
								counts[key] = { booked: 0, window: 0 };
							}

							// Check if this patient already has a booking for this visit
							const hasBooking =
								bookings &&
								bookings.some(
									(b) =>
										b.patient_id === patient.record_id &&
										b.event_type === "booked" &&
										b.visit_num === visitNum
								);

							// Only count as window if they don't have a booking
							if (!hasBooking) {
								counts[key].window += 1;
							}
						}
					}
				}
			});
		}

		return counts;
	}, [apiPatients, bookings]); // Only recalculate when data changes

	// Prepare table rows sorted chronologically - memoized
	const appointmentRows = useMemo(() => {
		return Object.entries(monthlyCounts)
			.sort(([a], [b]) => {
				const [monthA, yearA] = a.split(" ");
				const [monthB, yearB] = b.split(" ");
				return (
					new Date(`${monthA} 1, ${yearA}`) -
					new Date(`${monthB} 1, ${yearB}`)
				);
			})
			.map(([monthYear, counts]) =>
				createData(
					monthYear,
					counts.booked,
					counts.window,
					counts.booked + counts.window
				)
			);
	}, [monthlyCounts]);

	const handleChangePage = (_event, newPage) => setPage(newPage);

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	if (patientsLoading || bookingsLoading) {
		return (
			<div className="forecast-container">
				<p>Loading forecast data...</p>
			</div>
		);
	}

	if (appointmentRows.length === 0) {
		return (
			<div className="forecast-container">
				<p>
					There are currently no appointments or upcoming visit
					windows
				</p>
			</div>
		);
	}

	return (
		<div className="forecast-container">
			<Paper className="forecast-paper">
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
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row) => (
									<TableRow
										hover
										tabIndex={-1}
										key={row.monthYear}
									>
										{columns.map((column) => (
											<TableCell
												key={column.id}
												align={column.align}
											>
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
		</div>
	);
};

export default Forecast;
