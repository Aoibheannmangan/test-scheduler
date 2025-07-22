import React from 'react';
import './Alert.css';

const Alert = ({message, type, onClose}) => {
    return (
        <div className={`alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>X</button>
        </div>
    );
};

export default Alert;