import "./BookedChart.css";
import { useState, useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { useBookings } from "../hooks/useBookings";

const BookedChart = () => {
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [alignment, setAlignment] = useState(selectedYear.toString());

	const { bookings, loading } = useBookings();

	const handleYearChange = (event) => {
		const year = parseInt(event.target.value);
		setSelectedYear(year);
		setAlignment(year.toString());
	};

	// Calculate appointment data from bookings
	const { appointmentData, noShowData, outOfWindowData, availableYears } =
		useMemo(() => {
			const yearData = {};
			const years = new Set();

			// Process all bookings
			bookings.forEach((booking) => {
				if (booking.event_type === "booked" && booking.start) {
					const date = new Date(booking.start);
					const year = date.getFullYear();
					const month = date.getMonth(); // 0-11

					years.add(year);

					if (!yearData[year]) {
						yearData[year] = {
							appointments: new Array(12).fill(0),
							noShows: new Array(12).fill(0),
							outOfWindows: new Array(12).fill(0),
						};
					}

					yearData[year].appointments[month]++;

					// Count no shows and out of windows and appointments for barchart
					if (booking.no_show) {
						yearData[year].noShows[month]++;
					} else if (booking.out_of_window) {
						yearData[year].outOfWindows[month]++;
					}
				}
			});

			// Convert to the format needed for the chart
			const appointmentData = {};
			const noShowData = {};
			const outOfWindowData = {};

			Array.from(years).forEach((year) => {
				appointmentData[year] =
					yearData[year]?.appointments || new Array(12).fill(0);
				noShowData[year] =
					yearData[year]?.noShows || new Array(12).fill(0);
				outOfWindowData[year] =
					yearData[year]?.outOfWindows || new Array(12).fill(0);
			});

			// If no years found, add current year with empty data
			if (years.size === 0) {
				years.add(currentYear);
				appointmentData[currentYear] = new Array(12).fill(0);
				noShowData[currentYear] = new Array(12).fill(0);
				outOfWindowData[currentYear] = new Array(12).fill(0);
			}

			return {
				appointmentData,
				noShowData,
				outOfWindowData,
				availableYears: Array.from(years).sort(),
			};
		}, [bookings, currentYear]);

	const xLabels = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	if (loading) {
		return (
			<Box sx={{ width: "100%", padding: 2, textAlign: "center" }}>
				<p>Loading booking statistics...</p>
			</Box>
		);
	}

	return (
		<Box
			sx={{ width: "100%", padding: 2 }}
			data-testid="forecast-component"
		>
			<RadioGroup
				value={alignment}
				onChange={handleYearChange}
				className="radio-group"
				row={true}
			>
				{availableYears.map((year) => (
					<FormControlLabel
						key={year}
						value={year.toString()}
						control={<Radio className="hidden-radio" />}
						label={year.toString()}
						className={
							alignment === year.toString()
								? "year-label selected"
								: "year-label"
						}
					/>
				))}
			</RadioGroup>

			<Box sx={{ width: "100%", height: 400 }}>
				<BarChart
					xAxis={[
						{
							data: xLabels,
							scaleType: "band",
							label: "Months",
							tickLabelStyle: {
								angle: 0,
								textAnchor: "middle",
								fontSize: 10,
							},
						},
					]}
					series={[
						{
							data:
								appointmentData[selectedYear] ||
								new Array(12).fill(0),
							label: "Appointments",
							stack: "total",
							color: "#0e9757c9",
						},
						{
							data:
								noShowData[selectedYear] ||
								new Array(12).fill(0),
							label: "No-show in",
							stack: "total",
							color: "#ca3609d2",
						},
						{
							data:
								outOfWindowData[selectedYear] ||
								new Array(12).fill(0),
							label: "Out of Visit Window",
							stack: "total",
							color: "#e4cf0fda",
						},
					]}
					margin={{ left: 50, right: 50, top: 30, bottom: 50 }}
					height={400}
				/>
			</Box>
		</Box>
	);
};

export default BookedChart;
