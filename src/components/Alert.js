import React from 'react';
import './Alert.css';

/**
 * Custom Alert Popup that displays a message with
 * a specified type
 * a close button
 */
const Alert = ({message, type, onClose}) => {
    return (
        <div role="alert" className={`alert-popup ${type}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={onClose}>X</button>
        </div>
    );
};

export default Alert;