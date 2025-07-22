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
                    <li><Link to="/appoint">My Appointments</Link></li>
                    <li><Link to="/calender">Calendar</Link></li>
                    <li><Link to="https://redcap.ucc.ie/index.php?action=myprojects">REDCap</Link></li>
                </ul>
            </div>

            <div className="navbar-right">
                <Link to="/account" className="nav-link">My Patients</Link>
                <Link to="/account" className="user-icon">
                    <i className="fas fa-user"></i>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
