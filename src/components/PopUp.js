import React from 'react';
import "./PopUp.css";

/**
 * A custom popup component used to confirm an action with the user
 * Dislays a confirmation message with the option to confirm or close
 * @param {Object} param0 - The props object
 * @param {boolean} param0.isOpen - If the popup is open or closed
 * @param {Function} param0.onClose - The function to call when the popup is closed
 * @param {Function} param0.onConfirm - The function to call when the user has confirmed
 * @param {string} param0.message - The message displayed by the popup
 * @returns {JSX.Element | null} A JSX element representing the popup if open, or null if closed
 */
const PopUp = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
		<div className="popup-overlay">
			<div className="popup-content animate-pop">
				<div className="popup-header">Confirm Action</div>
				<p>{message}</p>
				<div className="button-row">
					<button className="confirm-button" onClick={onConfirm}>
						Confirm
					</button>
					<button className="cancel-button" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default PopUp;
