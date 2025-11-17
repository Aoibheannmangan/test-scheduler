import axios from "axios";
import { useCallback, useState } from "react";

const fetchBookings = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const events = response.data.events.map((event) => {
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        id: event.patient_id, // Map patient_id to id
      };
    });

    setBookedAppointments(events);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}, []);

// Functions for forecasting

export function getAppointmentsPerMonth(appointments, month, year) {
  const counts = {};

  appointments.forEach((event) => {
    if (!event.start) return;
    const date = new Date(event.start);
    if (isNaN(date)) return;

    const key = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}

export function getWindowsPerMonth(studyWindows) {
  const counts = {};
  studyWindows.forEach((window) => {
    if (!window.start) return;
    const date = new Date(window.start);
    if (isNaN(date)) return;

    const key = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}
