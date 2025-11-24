import "./BookedChart.css";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, RadioGroup, Radio, FormControlLabel } from "@mui/material";

const BookedChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [alignment, setAlignment] = useState(selectedYear.toString());

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setAlignment(event.target.value);
  };

  const appointmentData = {
    2025: [23, 45, 23, 44, 56, 67, 34, 45, 56, 67, 78, 89],
    2026: [33, 45, 37, 34, 45, 56, 67, 78, 89, 90, 91, 92],
  };

  const noShowData = {
    2025: [2, 3, 4, 5, 3, 2, 4, 4, 3, 2, 3, 2],
    2026: [3, 4, 6, 2, 1, 1, 4, 3, 2, 2, 2, 3],
  };

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

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <RadioGroup
        value={alignment}
        onChange={handleYearChange}
        className="radio-group"
        row={true}
      >
        {Object.keys(appointmentData).map((year) => (
          <FormControlLabel
            key={year}
            value={year}
            control={<Radio className="hidden-radio" />}
            label={year}
            className={
              alignment === year ? "year-label selected" : "year-label"
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
              data: appointmentData[selectedYear],
              label: `Appointments in ${selectedYear}`,
              stack: "total",
              color: "#0e9757ff",
            },
            {
              data: noShowData[selectedYear],
              label: `No-show in ${selectedYear}`,
              stack: "total",
              color: "#ca3609ff",
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
