import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook to fetch and manage bookings from the backend
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - bool to fetch on mount (default: true)
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

    // Perform get request
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const events = response.data.events.map((event) => {
        // Return the events
        return {
          ...event,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          event_type: event.event_type,
          patient_id: event.patient_id,
          visit_num: event.visit_num,
          note: event.note,
          no_show: event.no_show,
          room_id: event.room_id,
        };
      });

      // Set events
      setBookings(events);
      return events;
    } catch (err) {
      // error handling
      console.error("Error fetching bookings:", err);
      setError(err);
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
