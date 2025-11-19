import React from "react";
import Forecast from "./../components/Forecast";
import "./Reports.css";
import axios from "axios";

const Reports = () => {
  return (
    <div className="reportPage">
      <h1 className="heading">Window and Booking Forecast</h1>
      <div className="chart-container">
        <Forecast></Forecast>
      </div>

      <h1 className="heading">Booking Statistics</h1>
      <div className="chart-container">
        <p>
          Component for an MUI barchart of months and the bookings and windows
          in that. Breakdown/multiple barcharts for cases and visit number
        </p>
      </div>
    </div>
  );
};

export default Reports;
