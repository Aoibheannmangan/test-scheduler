import Forecast from "../components/forecast";
import BookedChart from "./../components/BookedChart";
import "./Reports.css";

const Reports = () => {
	return (
		<div className="reportPage" data-testid="page-container">
			<h1 className="window-heading">Window and Booking Forecast</h1>
			<div className="chart-container" data-testid="chart-container">
				<Forecast data-testid="forecast-component" />
			</div>

			<h1 className="chart-heading">Booking Statistics</h1>
			<div className="chart-container" data-testid="chart-container">
				<BookedChart data-testid="booking-component" />
			</div>
		</div>
	);
};

export default Reports;
