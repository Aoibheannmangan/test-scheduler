// Functions for forecasting appointments by month

/**
 * Counts appointments per month from both booked and window events.
 * - Booked appointments are counted in the month they're scheduled
 * - Window appointments are counted in the month the window starts
 *
 * @param {Array} appointments - Array of appointment/window events
 * @returns {Object} Object with month-year keys and appointment counts as values
 */
export function getAppointmentsPerMonth(events) {
	const counts = {};

	events.forEach((event) => {
		if (!event.start) return;
		const date = new Date(event.start);
		if (isNaN(date)) return;

		const key = `${date.toLocaleString("default", {
			month: "long",
		})} ${date.getFullYear()}`;
		if (!counts[key]) counts[key] = { booked: 0, window: 0 };

		if (event.type === "booked") counts[key].booked += 1;
		else counts[key].window += 1;
	});

	return counts;
}
