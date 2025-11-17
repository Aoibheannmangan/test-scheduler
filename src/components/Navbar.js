import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a className="logo">INFANT</a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link to="/appoint">Appointment View</Link>
          </li>
          <li>
            <Link to="/calender">Calendar</Link>
          </li>
          <li>
            <Link to="/forecast">Forecast</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/account" className="nav-link">
          Patients
        </Link>

        <button onClick={handleLogout} className="nav-logout">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
