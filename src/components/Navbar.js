import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">INFANT</Link>
            </div>

            <div className="navbar-center">
                <ul className="nav-links">
                    <li><Link to="/appoint">Appointment View</Link></li>
                    <li><Link to="/calender">Calendar</Link></li>
                    <li><Link to="/forecast">Forecast</Link></li>
                </ul>
            </div>

            <div className="navbar-right">
                <Link to="/account" className="nav-link">Patients</Link>
                <Link to="/login" className="nav-link">Log Out</Link>
            </div>
        </nav>
    );
};

export default Navbar;
