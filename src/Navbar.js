import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className = "navbar-left">
                <a href="/" className = "logo">
                INFANT</a>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <Link to="/appoint">My appointments</Link>
                    </li>
                    <li>
                        <Link to="/book">Book an appointment</Link>
                    </li>
                    <li>
                        <Link to="/calender">Calender</Link>
                    </li>
                    <li>
                        <Link to="/info">My information</Link>
                    </li>
                    <li>
                      <Link to="/account">Account</Link>
                    </li>
                </ul>
            </div>
            <div className='navbar-right'>
                <a href="/account" className="user-icon">
                    <i className="fas fa-user"></i>
                </a>
            </div>
        </nav>
    );
};
export default Navbar;
