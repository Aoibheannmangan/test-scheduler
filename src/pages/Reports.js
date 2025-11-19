import React from "react";
import Forecast from "./../components/forecast";
import "./Reports.css";
import axios from "axios";

const Reports = () => {
  return (
    <div className="reportPage">
      <h1 className="heading">Window and Booking Forecast</h1>
      <div className="forecastContainer">
        <Forecast></Forecast>
      </div>
    </div>
  );
};

export default Reports;