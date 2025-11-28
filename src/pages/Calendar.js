import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import "./Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ClickableDateCell from "../components/ClickableCell";
import { eventPropGetter } from "../hooks/eventPropGetter";
import ToggleAppointment from "./Appointment";
import "../components/useAppointmentFilters.css";
import CustomToolbar from "../components/CustomToolbar";
import Alert from "../components/Alert";
import PopUp from "../components/PopUp";
import RebookingForm from "../components/RebookingForm";
import { CiCalendar } from "react-icons/ci";
import { useData } from "../hooks/DataContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import LeaveForm from "../components/LeaveForm";

/**
 * Calendar component that renders the main calendar view and handles appointment management.
 * Includes functionality for booking, editing, deleting appointments,
 * blocking dates, searching patients, and managing visit windows.
 * @component
 * @example
 * <Route path="/calendar" element={<MyCalendar />} />
 * @returns {JSX.Element} The Calendar component that renders the main calendar view and handles appointment management.
 */

const MyCalendar = () => {
	const [view, setView] = useState("month");
	const [date, setDate] = useState(new Date());
	const [searchPatientId, setSearchPatientId] = useState("");
	const [windowEvents, setWindowEvents] = useState([]);
	const [currentPatient, setCurrentPatient] = useState(null);
	const [alert, setAlert] = useState(null);
	const [popupOpen, setPopupOpen] = useState(false);
	const [outsideWindowPopupOpen, setOutsideWindowPopupOpen] = useState(false);
	const [pendingAppointment, setPendingAppointment] = useState(null);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [editedInfo, setEditedInfo] = useState(null);

	const [appOpen, setAppOpen] = useState(false);

	const [showRebookingForm, setShowRebookingForm] = useState(false);
	const [rebookPopupOpen, setRebookPopupOpen] = useState(false);
	const [eventToRebook, setEventToRebook] = useState(null);

	const [selectedDate, setSelectedDate] = useState(null);
	const isFirstRender = useRef(true);

	/**
	 * State to manage blocked dates
	 * @type {Array<{start: Date, end: Date}>}
	 * @returns {void}
	 *
	 */
	const [blockedDates, setBlockedDates] = useState([]);
    const [blockStart, setBlockStart] = useState(null);
    const [blockEnd, setBlockEnd] = useState(null);
	const [leaveOpen, setLeaveOpen] = useState(false);
  	const [leaveEvents, setLeaveEvents] = useState([]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("/api/blocked-dates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert incoming ISO strings → real JS Date objects
        const formatted = response.data.blockedDates.map((b) => ({
          ...b,
          start: new Date(b.start),
          end: new Date(b.end),
          blocked: true,
          event_type: "blocked",
        }));

        setBlockedDates(formatted);
      } catch (err) {
        console.error("Error fetching blocked:", err);
      }
    };

    fetchBlockedDates();
  }, []);
  
   useEffect(() => {
		const fetchLeaveDates = async () => {
		try {
			const token = localStorage.getItem("token");

			const response = await axios.get("/api/leave", {
			headers: { Authorization: `Bearer ${token}` },
			});

			// Use the correct key 'leaveEvents' from backend
			const formatted = response.data.leaveEvents.map((b) => ({
			...b,
			start: new Date(b.start),
			end: new Date(b.end),
			}));

			setLeaveEvents(formatted);
		} catch (err) {
			console.error("Error fetching Leave:", err);
		}
		};

		fetchLeaveDates();
	}, []);


	const [showBlockedDates, setShowBlockedDates] = useState(false);

	/* Appointment portion */
	// Create array to store booked appointments
	const [bookedEvents, setBookedEvents] = useState([]);

	const {
		data: apiUserList,
		loading,
		error,
		updatePatient,
		refetchData,
	} = useData();
	const [userList, setUserList] = useState([]);

	/**
	 * Effect to map API user data with booked events from localStorage
	 * and set the combined user list state.
	 * @returns {void}
	 *
	 */
	// Run whenever apiUserList changes
	useEffect(() => {
		if (apiUserList) {
			setUserList(apiUserList);
		}
	}, [apiUserList]);

	// Selected rooms available
	const roomList = useMemo(
		() => [
			{ id: "TeleRoom", label: "Telemetry Room (Room 2.10)", dbId: 1 },
			{ id: "room1", label: "Assessment Room 1", dbId: 2 },
			{ id: "room2", label: "Assessment Room 2", dbId: 3 },
			{ id: "room3", label: "Assessment Room 3", dbId: 4 },
			{ id: "room4", label: "Assessment Room 4", dbId: 5 },
			{
				id: "devRoom",
				label: "Developmental Assessment Room (Room 2.07)",
				dbId: 6,
			},
		],
		[]
	);

	const fetchBookings = useCallback(async () => {
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
			const bookings = response.data.events.map((event) => {
				const room = roomList.find((r) => r.dbId === event.room_id);

				return {
					...event,
					title: event.title,
					start: new Date(event.start),
					end: new Date(event.end),
					room: room ? room.id : null,
					event_type: event.event_type,
				};
			});
			setBookedEvents(bookings);
		} catch (error) {
			console.error("Error fetching bookings:", error);
		}
	}, [roomList, setBookedEvents]);

	// In use effect as it runs when component mounts
	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	/**
	 *
	 * Handles selecting an event on the calendar.
	 *
	 * @param {Object} event - The event object that was selected.
	 * @param {string} event.type - The type of the event (e.g., "booked", "window").
	 * @param {string} event.title - The title of the event.
	 * @param {Date} event.start - The start date/time of the event.
	 * @param {Date} event.end - The end date/time of the event.
	 * @param {string} event.room - The room assigned to the event.
	 * @param {boolean} event.noShow - Indicates if the event was marked as a no-show.
	 * @param {string} event.noShowComment - Comments related to the no-show status.
	 * @returns {void}
	 */
	// Open popup when clicking an event
	const handleSelectEvent = (event) => {
		console.log("Selected Event:", event); // DEBUG
		// So only booked events can be altered
		if (event.event_type === "booked") {
			setSelectedEvent(event);
			// Copy all editable properties into editedInfo state
			setEditedInfo({
				title: event.title || "",
				start: moment(event.start),
				end: moment(event.end),
				note: event.note || "",
				room: event.room || "",
				noShow: event.noShow || false,
				noShowComment: event.noShowComment || "",
			});
		}
	};

	/**
	 * Handles blocking a selected date on the calendar.
	 * @returns {void}
	 */
	const handleBlockDate = async () => {
    if (!blockStart || !blockEnd) {
      setAlert({ message: "Please select a start and end", type: "error" });
      return;
    }

    if (blockEnd.isSameOrBefore(blockStart)) {
      setAlert({ message: "End must be after start", type: "error" });
      return;
    }

    const startISO = blockStart.toISOString();
    const endISO = blockEnd.toISOString();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/block-date",
        { start: startISO, end: endISO },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newEvent = {
        title: "Blocked",
        start: new Date(startISO),
        end: new Date(endISO),
        blocked: true,
        allDay: false,
        event_type: "blocked",
        eventId: response.data.eventId,
      };

      setBlockedDates((prev) => [...prev, newEvent]);

      setAlert({ message: "Date blocked", type: "success" });
    } catch (err) {
      console.error("Error blocking:", err);
      setAlert({ message: "Error blocking date", type: "error" });
    }
  };

	/**
	 * Handles unblocking a previously blocked date on the calendar.
	 * @returns {void}
	 */
	//Unblock previously blocked dates
	const handleUnBlockDate = () => {
		try {
			if (!selectedDate) {
				setAlert({
					message: "Please select a date to unblock",
					type: "error",
				});
				return;
			}

			const startOfDay = moment(selectedDate).startOf("day");

			setBlockedDates((prev) => {
				const safePrev = Array.isArray(prev) ? prev : [];

				// Filter out the blocked event that matches the selected date
				const updated = safePrev.filter((evt) => {
					const evtStart = evt?.start ? moment(evt.start) : null;
					return !evtStart?.isSame(startOfDay, "day");
				});

				// Save updated blocked dates to localStorage safely
				try {
					localStorage.setItem(
						"blockedDates",
						JSON.stringify(updated)
					);
				} catch (e) {
					console.error("Error updating localStorage:", e);
				}

				// Alert user
				if (updated.length !== safePrev.length) {
					setAlert({
						message: `Unblocked ${startOfDay.format("YYYY-MM-DD")}`,
						type: "success",
					});
				} else {
					setAlert({
						message: "Selected date was not blocked",
						type: "warning",
					});
				}

				return updated;
			});
		} catch (error) {
			console.error("Error in handleUnblockDate:", error);
			setAlert({
				message: "An error occurred while unblocking",
				type: "error",
			});
		}
	};

	/**
	 * Toggles the display of blocked dates on the calendar.
	 * @returns {void}
	 */
	const handleShowBlockedDates = () => {
		setShowBlockedDates((prev) => !prev);
	};

	/**
	 * Handles the change of selected date from the date input.
	 * @param {Object} event - The event object from the date input change.
	 * @param {string} event.target.value - The new selected date value.
	 * @return {void}
	 */
	const handleDateChange = (event) => {
		setSelectedDate(event);
	};

	const blockedEventGetter = (event) => {
		if (event.blocked) {
			return {
				className: "rbc-event-blocked",
			};
		}
		return {};
	};

	/**
	 * Handles combining event properties for styling and blocked status.
	 *
	 * @param {Object} event - The event object to get properties for.
	 * @param {string} event.type - The type of the event (e.g., "booked", "window").
	 * @param {string} event.title - The title of the event.
	 * @param {Date} event.start - The start date/time of the event.
	 * @param {Date} event.end - The end date/time of the event.
	 * @param {boolean} event.blocked - Indicates if the event is blocked.
	 * @param {string} event.room - The room assigned to the event.
	 * @param {boolean} event.noShow - Indicates if the event was marked as a no-show.
	 * @param {string} event.noShowComment - Comments related to the no-show status.
	 *  @returns {void}
	 */
	const combinedEventGetter = (event) => {
		const blockedProps = blockedEventGetter(event);
		const styleProps = eventPropGetter(event);

		return {
			...styleProps,
			...blockedProps,
		};
	};

	/**
	 * Handles changes to the no-show checkbox in the event edit form.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the checkbox.
	 * @return {void}
	 */
	const handleNoShowChange = (e) => {
		const newNoShowStatus = e.target.checked;
		setEditedInfo((prev) => ({
			...prev,
			noShow: newNoShowStatus,
		}));

		if (newNoShowStatus) {
			setShowRebookingForm(true);
			setAppOpen(false);
		} else {
			setShowRebookingForm(false);
		}
	};

	/**
	 * Handles updating an existing event in the booked events list.
	 * @param {Object} updatedEvent - The event object with updated details.
	 * @param {string} updatedEvent.id - The unique identifier of the event.
	 * @param {string} updatedEvent.title - The title of the event.
	 * @param {Date} updatedEvent.start - The start date/time of the event.
	 * @param {Date} updatedEvent.end - The end date/time of the event.
	 * @param {string} updatedEvent.room - The room assigned to the event.
	 * @param {boolean} updatedEvent.noShow - Indicates if the event was marked as a no-show.
	 * @param {string} updatedEvent.noShowComment - Comments related to the no-show status.
	 * @return {void}
	 */

	const handleUpdateEvent = (updatedEvent) => {
		const updatedBooked = bookedEvents.map((event) =>
			event.id === updatedEvent.id ? updatedEvent : event
		);
		setBookedEvents(updatedBooked);
	};

	useEffect(() => {
		if (!editedInfo || isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (editedInfo.show && !editedInfo.noShow) {
			openBookingFormWithPrefill(selectedEvent);
		}
	}, [editedInfo?.noShow, selectedEvent, editedInfo]);

	const openBookingFormWithPrefill = (event) => {
		setSelectedEvent(event);
		setShowRebookingForm(true);
	};

	/**
	 * Handles saving edited event information.
	 * @returns {void}
	 */
	// Save when editing event info
	const saveEditedInfo = async () => {
		console.log("Saving Edited Info:", editedInfo); // DEBUG
		if (!selectedEvent || !editedInfo) return;

		const patientId = selectedEvent.patient_id;
		const patient = userList.find((p) => p.record_id === patientId);

		if (!patient) {
			setAlert({
				message: "Patient data not found for this booking.",
				type: "error",
			});
			return;
		}

		const isOutOfWindow = !isAppointmentWithinVisitWindow(
			{ start: editedInfo.start },
			patient
		);

		// Prepare updated event object
		const updatedEvent = {
			...selectedEvent,
			...editedInfo,
			start: new Date(editedInfo.start),
			end: new Date(editedInfo.end),
			out_of_window: isOutOfWindow,
		};

		// Pull slected booking using JWT
		try {
			const token = localStorage.getItem("token");
			await axios.put(
				`http://localhost:5000/api/appointment/${selectedEvent.event_id}`,
				{
					start: updatedEvent.start.toISOString(),
					end: updatedEvent.end.toISOString(),
					title: updatedEvent.title,
					note: editedInfo.note,
					no_show: updatedEvent.noShow,
					out_of_window: updatedEvent.out_of_window,
					roomId: roomList.find((r) => r.id === updatedEvent.room)
						?.dbId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update event
			const updatedBooked = bookedEvents.map((event) =>
				event.event_id === selectedEvent.event_id ? updatedEvent : event
			);
			setBookedEvents(updatedBooked);
			closePopup();
		} catch (error) {
			console.error("Error updating appointment:", error);
			setAlert({
				message: "Failed to update appointment. Please try again.",
				type: "error",
			});
		}
	};

	// Close popup, reset selected event
	const closePopup = () => {
		setSelectedEvent(null);
		setEditedInfo("");
	};

	/**
	 * Handles searching for a patient by their ID.
	 * @returns {void}
	 */
	// Search patient by ID
	const handleSearchWindow = () => {
		const patient = apiUserList.find(
			(p) => p.record_id === searchPatientId.trim()
		);
		if (!patient) {
			setAlert({
				message: "Patient with that ID not found",
				type: "error",
			});
			setCurrentPatient(null);
			setWindowEvents([]);
			return;
		}

		// If trying to book another appointment
		if (["booked"].includes(patient.type)) {
			setAlert({
				message: "This patient's visit is already booked or scheduled.",
				type: "error",
			});
			setCurrentPatient(null);
			setWindowEvents([]);
			return;
		}

		if (!patient.nn_dob) {
			setAlert({
				message:
					"Patient has no Date of Birth recorded, cannot generate visit windows.",
				type: "error",
			});
			setCurrentPatient(null);
			setWindowEvents([]);
			return;
		}

		let visit_num = 1;
		if (patient.visit_1_nicu_discharge_complete === "1") {
			visit_num = 2;
			for (let i = 2; i <= 6; i++) {
				if (patient[`v${i}_attend`] === "1") {
					visit_num = i + 1;
				} else {
					break;
				}
			}
		}

		const getWindowDates = (visit_num) => {
			switch (visit_num) {
				case 2:
					return { start: patient.reg_date1, end: patient.reg_date2 };
				case 3:
					return {
						start: patient.reg_9_month_window,
						end: patient.reg_12_month_window,
					};
				case 4:
					return {
						start: patient.reg_17_month_window,
						end: patient.reg_19_month_window,
					};
				case 5:
					return {
						start: patient.reg_23_month_window,
						end: patient.reg_25_month_window,
					};
				case 6:
					return {
						start: patient.reg_30_month_window,
						end: patient.reg_31_month_window,
					};
				default:
					return null;
			}
		};

		const windowDates = getWindowDates(visit_num);

		if (windowDates) {
			const { start, end } = windowDates;
			const windowStart = new Date(start);
			const windowEnd = new Date(end);

			const studyWindow = {
				title: `Visit ${visit_num} Window`,
				start: windowStart,
				end: windowEnd,
				type: "window",
				id: patient.record_id,
				Name: `Patient ${patient.record_id}`,
			};

			setWindowEvents([studyWindow]);

			// Navigate calendar to the window start date
			setDate(new Date(studyWindow.start));
			setView("month");

			setAlert({
				message: `Found patient: - Showing visit window`,
				type: "success",
			});
		} else {
			setWindowEvents([]);
			setAlert({
				message: "No upcoming visit windows for this patient.",
				type: "info",
			});
		}

		setCurrentPatient({ ...patient, visitNum: visit_num });
	};

	/**
	 * Handles checking if an appointment falls within the patient's visit windows.
	 *
	 * @param {Object} appointment - The appointment object to check.
	 * @param {Object} patient - The patient object containing visit window information.
	 * @returns {boolean} True if the appointment is within any visit window, false otherwise.
	 */
	// If booking within study window
	const isAppointmentWithinVisitWindow = (appointment, patient) => {
		let visit_num = 1;
		if (patient.visit_1_nicu_discharge_complete === "1") {
			visit_num = 2;
			for (let i = 2; i <= 6; i++) {
				if (patient[`v${i}_attend`] === "1") {
					visit_num = i + 1;
				} else {
					break;
				}
			}
		}

		const getWindowDates = (visit_num) => {
			switch (visit_num) {
				case 2:
					return { start: patient.reg_date1, end: patient.reg_date2 };
				case 3:
					return {
						start: patient.reg_9_month_window,
						end: patient.reg_12_month_window,
					};
				case 4:
					return {
						start: patient.reg_17_month_window,
						end: patient.reg_19_month_window,
					};
				case 5:
					return {
						start: patient.reg_23_month_window,
						end: patient.reg_25_month_window,
					};
				case 6:
					return {
						start: patient.reg_30_month_window,
						end: patient.reg_31_month_window,
					};
				default:
					return null;
			}
		};

		const windowDates = getWindowDates(visit_num);

		if (windowDates) {
			const { start, end } = windowDates;
			const windowStart = new Date(start);
			const windowEnd = new Date(end);
			const appointmentDate = new Date(appointment.start);

			// Set hours to 0 to compare dates only
			windowStart.setHours(0, 0, 0, 0);
			windowEnd.setHours(23, 59, 59, 999);
			appointmentDate.setHours(0, 0, 0, 0);

			return (
				appointmentDate >= windowStart && appointmentDate <= windowEnd
			);
		}

		return false;
	};

	/**
	 * Handles proceeding with booking an appointment outside the visit window after confirmation.
	 * @returns {void}
	 */
	// If confirm on outside study window pop up
	const proceedWithOutOfWindowBooking = () => {
		if (!pendingAppointment) return;
		handleAddAppointment(
			{ ...pendingAppointment, out_of_window: true },
			true
		); // override
		setOutsideWindowPopupOpen(false);
		setPopupOpen(false);
		setPendingAppointment(null);
	};

	/**
	 * Handles clearing the search and window events on the calendar.
	 * @returns {void}
	 */
	// Clear search and window on calender
	const handleClearWindow = () => {
		setWindowEvents([]);
		setSearchPatientId("");
		setCurrentPatient(null);
	};

	/**
	 * Handles confirming the deletion of an event from the booked events list.
	 * @returns {void}
	 */
	const confirmDeleteEvent = async () => {
		if (!eventToDelete?.event_id) {
			console.error("Missing event_id on event", eventToDelete);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.delete(
				`http://localhost:5000/api/appointment/${eventToDelete.event_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const updatedEvents = bookedEvents.filter(
				(event) => event.event_id !== eventToDelete.event_id
			);
			setBookedEvents(updatedEvents);
			setPopupOpen(false);
			setEventToDelete(null);
			closePopup();
			refetchData(); // Re-fetch patient data to update visit windows
		} catch (error) {
			console.error("Error deleting appointment:", error);
			setAlert({
				message: "Failed to delete appointment. Please try again.",
				type: "error",
			});
		}
	};

	/**
	 * Handles clicking on an event in the calendar to open the delete confirmation popup.
	 * @param {Object} event - The event object that was clicked.
	 * @return {void}
	 */
	// Store event clicked on and open pop up for delete
	const handleEventClick = (event) => {
		setEventToDelete(event);
		setPopupOpen(true);
	};

	/**
	 * Handles adding a new appointment by opening the appointment booking popup.
	 * @return {void}
	 */
	// Store event clicked on and open pop up for delete
	const handleEventAdd = () => {
		setAppOpen(true);
	};

	// Sets current date and time
	const localizer = momentLocalizer(moment);

	/**
	 * Hand;es adding a new appointment to the booked events list and updating patient context.
	 *
	 * @param {Object} appointment - The appointment object containing details for the new appointment.
	 * @param {boolean} [override=false] - Flag indicating whether to override visit window checks.
	 * @returns {void} Does not return a value.
	 */
	// Function to add appointment
	const handleAddAppointment = async (appointment, override = false) => {
		const patientId = appointment.patientId;
		const match = userList.find((p) => p.record_id === patientId);

		if (!match) {
			setAlert({
				message: "Patient with that ID not found",
				type: "error",
			});
			setCurrentPatient(null);
			setWindowEvents([]);
			return;
		}

		// Check if the appointment is within the visit window
		if (!override && !isAppointmentWithinVisitWindow(appointment, match)) {
			setPendingAppointment(appointment);
			setOutsideWindowPopupOpen(true);
			return; // Stop here, wait for user confirmation
		}

		try {
			await axios.post(
				"http://localhost:5000/api/book",
				{ ...appointment, patient: match },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			await fetchBookings();
			refetchData(); // Re-fetch patient data to update visit windows and visit numbers

			setAlert({
				message: "Appointment booked successfully",
				type: "success",
			});
		} catch (error) {
			console.error("Error booking appointment: ", error);
			setAlert({ message: "Error booking appointment: ", type: "error" });
		}

		setAppOpen(false);
	};

	// Replace study filter state with rooms filter
	const [selectedRooms, setSelectedRooms] = useState(
		roomList.map((room) => room.id)
	);

	// Handler for room checkbox change
	const handleRoomChange = (roomId) => {
		setSelectedRooms((prev) =>
			prev.includes(roomId)
				? prev.filter((r) => r !== roomId)
				: [...prev, roomId]
		);
	};

	const isDateBlocked = (date) => {
		const formattedDate = moment(date).format("YYYY-MM-DD");
		return blockedDates.some(
			(blockedDate) =>
				moment(blockedDate.start).format("YYYY-MM-DD") === formattedDate
		);
	};

	const isTimeSlotBooked = (date, eventIdToExclude) => {
		const selectedStartTime = moment(date).valueOf();

		return bookedEvents.some((booking) => {
			if (booking.event_id === eventIdToExclude) return false;

			const bookingStartTime = moment(booking.start).valueOf();
			const bookingEndTime = moment(booking.end).valueOf();

			return (
				selectedStartTime >= bookingStartTime &&
				selectedStartTime < bookingEndTime
			);
		});
	};

	const shouldDisableDate = (date) => {
    const blocksForDay = blockedDates.filter(b => moment(date).isSame(b.start, "day"));
    return blocksForDay.some(b => {
      const start = moment(b.start);
      const end = moment(b.end);

      const sameDay = start.isSame(date, "day");
      const fullDay = end.diff(start, "minutes") >= (24 * 60 - 1);

      return fullDay;
    });
  };


	const shouldDisableTime = (time) => {
    if (!selectedDate) return false; // Safety check

    const dateTime = moment(selectedDate)
      .hour(moment(time).hour())
      .minute(moment(time).minute())
      .second(0)
      .millisecond(0);

    // Check blocked dates
    const isBlocked = blockedDates.some(b => {
      const start = moment(b.start);
      const end = moment(b.end);
      return dateTime.isBetween(start, end, null, "[)");
    });

    if (isBlocked) return true;

    // Check booked events
    return isTimeSlotBooked(time, selectedEvent?.event_id);
  };

   const handleAddLeave = async (leaveEvent) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/leave",
        {start: leaveEvent.start, end: leaveEvent.end, name: leaveEvent.name},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      const saved = {
        ...leaveEvent,
        event_id: response.data.event_id,
      };

      setLeaveEvents((prev) => [...prev, saved]);
      setAlert({type: "success", message: "Leave added."});
    } catch (error) {
      console.error("Error adding leave:", error);
      setAlert({ type: "error", message: "Failed to add leave"});
    }

    setLeaveOpen(false);
  };


	/**
	 * Combines all event types into a single array for calendar display and applies filtering based on selected rooms.
	 * @returns {Array<Object>} Array of filtered appointment objects for calendar display.
	 *
	 */
	// Array of all avents
	const allEvents = [...bookedEvents, ...windowEvents, ...blockedDates, leaveEvents];

	/**
	 * Filters appointments based on selected rooms and ensures date objects are properly formatted.
	 *
	 * @returns {Array<Object>} Array of filtered appointment objects with proper date formatting.
	 */
	const filteredAppointments = useMemo(() => {
		return allEvents
			.filter((event) => {
				if (event.blocked) return true;
				if (event.type === "window") return true; // Always show windows
				if (event.event_type === "leave") return true;
				return selectedRooms.includes(event.room); // Filter booked by room
			})
			.map((evt) => ({
				...evt,
				start:
					evt.start instanceof Date ? evt.start : new Date(evt.start),
				end: evt.end instanceof Date ? evt.end : new Date(evt.end),
			}));
	}, [allEvents, selectedRooms]);

	const dayPropGetter = (date) => {
		const isBlocked = blockedDates.some((evt) =>
			moment(date).isSame(evt.start, "day")
		);
		if (isBlocked) {
			return {
				style: { backgroundColor: "#ff0015ff" },
				className: "blocked-date-cell",
			};
		}

		return {};
	};

	const DateCellWrapper = ({ children, value, onSelectSlot }) => {
		const isBlocked = blockedDates.some((evt) =>
			moment(value).isSame(evt.start, "day")
		);

		return (
			<div
				style={{
					backgroundColor: isBlocked ? "ff0015ff" : "transparent",
					height: "100%",
					width: "100%",
					cursor: "pointer",
				}}
				onClick={() => onSelectSlot && onSelectSlot({ start: value })}
			>
				{children}
			</div>
		);
	};

	//-------------------------------------------HTML------------------------------------------------------------------

	// API loading or error message if encountered
	if (loading) return <div>Loading appointments...</div>;
	if (error) return <div>Error loading appointments: {error.message}</div>;

	return (
		<div className="CalBody">
			{alert && (
				<Alert
					message={alert.message}
					type={alert.type}
					onClose={() => setAlert(null)}
				/>
			)}

			{/**CALENDER*/}
			<div className="calendar-wrapper">
				<Calendar
					localizer={localizer}
					events={filteredAppointments}
					startAccessor="start"
					endAccessor="end"
					eventPropGetter={combinedEventGetter}
					view={view}
					onView={setView}
					date={date}
					onNavigate={setDate}
					dayPropGetter={dayPropGetter}
					blockedDates={blockedDates}
					onSelectSlot={(slotInfo) => {
						setDate(slotInfo.start);
						setView("day");
					}}
					onSelectEvent={handleSelectEvent}
					selectable
					views={["month", "week", "day", "agenda"]}
					components={{
						event: ({ event }) => (
							<div>
								{event.title}
								{event.event_type === "booked" && (
									<div style={{ fontSize: 14 }}>
										<strong>
											{new Date(
												event.start
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</strong>{" "}
										-{" "}
										<strong>
											{new Date(
												event.end
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</strong>
									</div>
								)}
								<div style={{ fontSize: 12 }}>
									<strong>{event.note}</strong>
								</div>{" "}
								{/* Show description here */}
							</div>
						),
						toolbar: CustomToolbar,
						dateCellWrapper: DateCellWrapper,
					}}
				/>
			</div>

			<div className="floatContainer">
				{/**WINDOW SEARCH*/}
				<div className="floatChild">
					<h4>Show Event Types</h4>
					<div className="filter-row">
						<div className="windowView">
							<label>
								View Patient Window:
								<input
									type="text"
									placeholder="Enter Patient ID"
									value={searchPatientId}
									onChange={(e) =>
										setSearchPatientId(e.target.value)
									}
								/>
								<div className="button-row">
									<button
										className="search-button"
										onClick={handleSearchWindow}
									>
										Search Window
									</button>
									<button
										className="clear-button"
										onClick={handleClearWindow}
									>
										Clear Window
									</button>
								</div>
								<h4>Input Leave</h4>
								<button className="save-button" onClick={(handleAddLeave) => setLeaveOpen(true)}>
									Add Leave
								</button>
								<div className="blockContainer">
									<h4>Block Dates</h4>
									<LocalizationProvider dateAdapter={AdapterMoment}>
									<label>
										Select start date & time
										<DateTimePicker
										value={blockStart}
										onChange={(val) => setBlockStart(val)}
										renderInput={(params) => <input {...params} />}
										ampm={false}
										/>
									</label>

									<label>
										Select end date & time
										<DateTimePicker
										value={blockEnd}
										onChange={(val) => setBlockEnd(val)}
										renderInput={(params) => <input {...params} />}
										ampm={false}
										/>
									</label>
									</LocalizationProvider>
									<div className="button-row">
										<button
											onClick={handleBlockDate}
											className="block-button"
										>
											{" "}
											Block Date
										</button>
										<button
											onClick={handleShowBlockedDates}
											className="block-button"
										>
											{showBlockedDates ? "Hide" : "Show"}{" "}
											blocked dates
										</button>
										<button
											className="block-button"
											onClick={handleUnBlockDate}
										>
											Unblock Date
										</button>
									</div>
									{showBlockedDates && (
                    <ul>
                      {blockedDates.map((date, index) => (
                        <li key={index}>
                          {moment(date.start).format("YYYY-MM-DD HH:mm")} -{" "}
                          {moment(date.end).format("HH:mm")}
                        </li>
                      ))}
                    </ul>
                  )}
								</div>
							</label>
							{/**DISPLAYS PATIENT WHEN SEARCHED IN WINDOW*/}
							{currentPatient && (
								<div className="patientInfo">
									<h4>Patient Info</h4>
									<p>
										<b>ID:</b> {currentPatient.id}
									</p>
									<p>
										<b>Visit Number:</b>{" "}
										{currentPatient.visitNum}
									</p>
									<p>
										<b>DOB:</b>{" "}
										{new Date(
											currentPatient.DOB
										).toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<div>
					{/**COLLAPSABLE FILTER BOX*/}
					<div className="floatChild">
						<ul>
							<li>
								<div>
									<b>Room Filter</b>
								</div>
								{/**DISPLAYS FILTERS USING LOOP*/}
								<ul>
									{roomList.map((room) => (
										<li key={room.id}>
											<div className="filter-checkbox">
												<label>
													<input
														type="checkbox"
														checked={selectedRooms.includes(
															room.id
														)}
														onChange={() =>
															handleRoomChange(
																room.id
															)
														}
														className={room.id}
													/>
													{room.label}
												</label>
											</div>
										</li>
									))}
								</ul>
							</li>
						</ul>
					</div>
				</div>
				<div className="floatButton">
					<h4>Book an Appointment</h4>

					<button className="appButton" onClick={handleEventAdd}>
						<CiCalendar className="bookIcon" />
					</button>
					<div className="patientInfo">
						<p>
							<strong>Tip:</strong> Click the calendar icon to add
							a new appointment.
						</p>
						<p>
							Use the filter to the left to specify room viewings.
						</p>
						<p>
							And try out the search window or block features to
							view patient visit windows and block dates for your
							schedule.
						</p>
					</div>
				</div>
			</div>

			{/**EDIT POPUP*/}
			{selectedEvent && (
				<div className="popup-overlay">
					<div className="popup-content">
						<div className="popup-header">
							<h3>
								Edit Event for{" "}
								{selectedEvent.Name || selectedEvent.title}
							</h3>
						</div>
						<label>
							Title:
							<input
								type="text"
								value={editedInfo.title}
								onChange={(e) =>
									setEditedInfo((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
							/>
						</label>

						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DateTimePicker
								label="Start Time"
								value={editedInfo.start}
								onChange={(newValue) =>
									setEditedInfo((prev) => ({
										...prev,
										start: newValue,
									}))
								}
								shouldDisableDate={shouldDisableDate}
								shouldDisableTime={shouldDisableTime}
								ampm={false}
							/>
							<DateTimePicker
								label="End Time"
								value={editedInfo.end}
								onChange={(newValue) =>
									setEditedInfo((prev) => ({
										...prev,
										end: newValue,
									}))
								}
								shouldDisableDate={shouldDisableDate}
								shouldDisableTime={shouldDisableTime}
								ampm={false}
							/>
						</LocalizationProvider>

						<label>
							Room:
							<select
								id="room"
								name="room"
								value={editedInfo.room}
								onChange={(e) =>
									setEditedInfo((prev) => ({
										...prev,
										room: e.target.value,
									}))
								}
							>
								<option value="">-- Select Room --</option>
								<option value="TeleRoom">
									Telemetry Room (Room 2.10)
								</option>
								<option value="room1">Assessment Room 1</option>
								<option value="room2">Assessment Room 2</option>
								<option value="room3">Assessment Room 3</option>
								<option value="room4">Assessment Room 4</option>
								<option value="devRoom">
									Developmental Assessment Room (Room 2.07)
								</option>
							</select>
						</label>

						<label className="checkbox-container">
							<input
								type="checkbox"
								checked={editedInfo.noShow}
								onChange={handleNoShowChange}
							/>
							<span className="noshow-check"></span>
							Mark as No-Show / Cancelled
						</label>

						{showRebookingForm && selectedEvent && (
							<RebookingForm
								event={selectedEvent}
								onSave={(updatedEvent) => {
									handleUpdateEvent(updatedEvent);
									setShowRebookingForm(false);
								}}
								onCancel={() => setShowRebookingForm(false)}
								blockedDates={blockedDates}
								bookedEvents={bookedEvents}
							/>
						)}

						<div className="button-row">
							<button
								onClick={saveEditedInfo}
								className="confirm-button"
							>
								Save
							</button>
							<button
								onClick={closePopup}
								className="cancel-button"
							>
								Cancel
							</button>
							<button
								onClick={() => handleEventClick(selectedEvent)}
								className="delete-button"
							>
								Delete Appointment
							</button>
						</div>
					</div>
				</div>
			)}

			{/**DELETE POPUP*/}
			<PopUp
				isOpen={popupOpen}
				onClose={() => setPopupOpen(false)}
				onConfirm={() => {
					confirmDeleteEvent();
				}}
				message={`Delete ${selectedEvent?.title || "this event"} for ${
					selectedEvent?.patientId || "Unknown ID"
				}?`}
				option1="Confirm"
				option2="Cancel"
			/>
			{/*EDIT POPUP*/}
			<PopUp
				isOpen={rebookPopupOpen}
				onClose={() => {
					setRebookPopupOpen(false);
					setAppOpen(false);
				}}
				onConfirm={() => {
					openBookingFormWithPrefill(eventToRebook);
					setRebookPopupOpen(false);
				}}
				message={`This event was marked as a no-show. Would you like to rebook for ${
					eventToRebook?.patientId || "this patient"
				}?`}
				option1="Yes"
				option2="No"
			/>

			{/**APPOINTMENT BOOKING FORM*/}
			<div className="AppointmentToggle">
				<ToggleAppointment
					onAddAppointment={handleAddAppointment}
					isOpen={appOpen}
					onClose={() => setAppOpen(false)}
					bookedEvents={bookedEvents}
					blockedDates={blockedDates}
					roomList={roomList}
					userList={userList}
				/>
			</div>
			{/** Pop up for leave form */}
			{leaveOpen && (
				<LeaveForm
				 onSave={handleAddLeave}
					onClose={() => setLeaveOpen(false)}
				/>
			)}

			{/**Pop up for window booking warning*/}
			<PopUp
				isOpen={outsideWindowPopupOpen}
				onClose={() => setOutsideWindowPopupOpen(false)}
				onConfirm={proceedWithOutOfWindowBooking}
				message={`This event for patient ${pendingAppointment?.patientId} is outside of the visit window. Do you wish to proceed?`}
				option1="Confirm"
				option2="Cancel"
			/>
		</div>
	);
};

export default MyCalendar;
