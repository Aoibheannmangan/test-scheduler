import React from 'react';
import './Alert.css';

const Alert = ({message, type, onClose}) => {
    return (
        <div className={`alert-popup ${type}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={onClose}>X</button>
        </div>
    );
};

export default Alert;