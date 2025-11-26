import React, { useState, useEffect } from "react";
import "./Alert.css";

/**
 * Custom Alert Popup that displays a message with
 * a specified type
 * a close button
 */
const Alert = ({ message, type, onClose }) => {
	const [closing, setClosing] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			handleClose();
		}, 6000);

		return () => clearTimeout(timer);
	}, [onClose]);

	const handleClose = () => {
		setClosing(true);
		setTimeout(() => {
			onClose();
		}, 500); // Match the duration of the fade-out animation
	};
	return (
		<div
			role="alert"
			className={`alert-popup ${type} ${closing ? "closing" : ""}`}
		>
			<span>{message}</span>
			<button className="close-btn" onClick={handleClose}>
				X
			</button>
		</div>
	);
};

export default Alert;
