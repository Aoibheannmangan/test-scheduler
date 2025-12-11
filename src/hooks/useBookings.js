import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook to fetch and manage bookings from the backend
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Fetch on mount (default: true)
 * @returns {Object} - { bookings, loading, error, refetch }
 */
export const useBookings = (options = {}) => {
  const { autoFetch = true } = options;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Ensure API_URL has no trailing slash
    const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "") + "/api";

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log response for debugging Render deployment
      console.log("Booking API response:", response.data);

      // Safely get events; default to empty array if undefined
      const eventsArray = Array.isArray(response.data.events)
        ? response.data.events
        : [];

      const events = eventsArray.map((event) => ({
        ...event,
        title: event.title || "",
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
        event_type: event.event_type || "",
        patient_id: event.patient_id || null,
        visit_num: event.visit_num || null,
        note: event.note || "",
        no_show: event.no_show || false,
        out_of_window: event.out_of_window || false,
        room_id: event.room_id || null,
      }));

      setBookings(events);
      return events;
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err);
      setBookings([]); // Ensure bookings is always an array
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};
