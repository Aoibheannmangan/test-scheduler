import React from "react";
import Forecast from "./../components/Forecast";
import BookedChart from "./../components/BookedChart";
import "./Reports.css";
import axios from "axios";

const Reports = () => {
	return (
		<div className="reportPage">
			<h1 className="window-heading">Window and Booking Forecast</h1>
			<div className="chart-container">
				<Forecast />
			</div>

			<h1 className="chart-heading">Booking Statistics</h1>
			<div className="chart-container">
				<BookedChart />
			</div>
		</div>
	);
};

export default Reports;
