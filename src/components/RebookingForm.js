import React, { useState, useMemo } from "react";
import "./RebookingForm.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import dayjs from "dayjs";

/**
 * A form component that allows user to reschedule and event
 * Users can select a new start and end time, and provide a reason for the no-show
 *
 * @param {Object} param0 - The props object
 * @param {Object} param0.event - The event to be rebooked, with details such as start and end time
 * @param {Function} param0.onSave - A function to save the updated event with new details
 * @param {Function} param0.onCancel - A function to cancel the rebooking process and close the form
 * @returns {JSX.Element} The JSX for rendering the rebooking form
 */
const RebookingForm = ({
	event,
	onSave,
	onCancel,
	blockedDates = [],
	bookedEvents = [],
}) => {
	const [newDate, setNewDate] = useState(
		dayjs(event.start).format("YYYY-MM-DD")
	);
	const [newStart, setNewStart] = useState(moment(event.start));
	const [newEnd, setNewEnd] = useState(moment(event.end));
	const [noShowComment, setNoShowComment] = useState(
		event.noShowComment || ""
	);

	const start = useMemo(() => {
		if (!newDate || !newStart || !dayjs.isDayjs(newStart)) return null;
		return dayjs(`${newDate}T${newStart.format("HH:mm")}`).toDate();
	}, [newDate, newStart]);

	const end = useMemo(() => {
		if (!newDate || !newEnd || !dayjs.isDayjs(newEnd)) return null;
		return dayjs(`${newDate}T${newEnd.format("HH:mm")}`).toDate();
	}, [newDate, newEnd]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!newStart || !dayjs.isDayjs(newStart)) {
			alert("Please select a start time");
			return;
		}
		if (!newEnd || !dayjs.isDayjs(newEnd)) {
			alert("Please select an end time");
			return;
		}

		const start = dayjs(newDate)
			.set("hour", newStart.hour())
			.set("minute", newStart.minute())
			.set("second", 0)
			.set("millisecond", 0)
			.toDate();

		const end = dayjs(newDate)
			.set("hour", newEnd.hour())
			.set("minute", newEnd.minute())
			.set("second", 0)
			.set("millisecond", 0)
			.toDate();

		const updatedEvent = {
			...event,
			start: newStart.toDate(),
			end: newEnd.toDate(),
			noShow: true,
			noShowComment,
		};
		onSave(updatedEvent);
	};

	const isDateBlocked = (date) => {
		const formattedDate = moment(date).format("YYYY-MM-DD");
		return blockedDates.some(
			(blockedDate) =>
				moment(blockedDate.start).format("YYYY-MM-DD") === formattedDate
		);
	};

	const isTimeSlotBooked = (date) => {
		const selectedStartTime = newStart.valueOf();
		const selectedEndTime = newEnd.valueOf();

		return bookedEvents.some((booking) => {
			const bookingStartTime = moment(booking.start).valueOf();
			const bookingEndTime = moment(booking.end).valueOf();

			// Check for overlap
			return (
				(selectedStartTime >= bookingStartTime &&
					selectedStartTime < bookingEndTime) ||
				(selectedEndTime > bookingStartTime &&
					selectedEndTime <= bookingEndTime) ||
				(selectedStartTime <= bookingStartTime &&
					selectedEndTime >= bookingEndTime)
			);
		});
	};

	const shouldDisableDate = (date) => {
		return isDateBlocked(date);
	};

	const shouldDisableTime = (time, clockType) => {
		if (isTimeSlotBooked(time)) {
			return true;
		}
		return false;
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h3 className="title">Reschedule Event</h3>
				<p>
					<strong>Title: </strong>
					{event.title}
				</p>

				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DateTimePicker
						label="New Start Time"
						value={newStart}
						onChange={(newValue) => setNewStart(newValue)}
						shouldDisableDate={shouldDisableDate}
						shouldDisableTime={shouldDisableTime}
						ampm={false}
					/>
					<DateTimePicker
						label="New End Time"
						value={newEnd}
						onChange={(newValue) => setNewEnd(newValue)}
						shouldDisableDate={shouldDisableDate}
						shouldDisableTime={shouldDisableTime}
						ampm={false}
					/>
				</LocalizationProvider>

				<label>Reason for Cancellation / No-Show: </label>
				<input
					type="text"
					value={noShowComment}
					onChange={(e) => setNoShowComment(e.target.value)}
					placeholder="e.g. Unexpected emergency"
				/>

				<div className="modal-buttons">
					<button onClick={handleSubmit} className="resubmit-button">
						Save
					</button>
					<button onClick={onCancel} className="recancel-button">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default RebookingForm;
