import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAppointmentsPerMonth } from "../hooks/forecast";
import axios from "axios";

const BookedChart = () => {
  // Split tables into 2 diff components? 2 diff files?
  return (
    <BarChart
      xAxis={[{ data: ["group A", "group B", "group C"] }]}
      series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      height={300}
      showToolbar
    />
  );
};

export default BookedChart;
