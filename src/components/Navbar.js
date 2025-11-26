import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import infantLogo from "../assets/infantNavLogo.png";

/**
 * Customised Navbar component that provides navigation links for the application.
 * Includes links to Appointment View, Calendar, Forecast and Sign Out
 * @returns {JSX.Element} The rendered Navbar with links to the pages
 */
const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="navbar">
			<div className="navbar-left">
				<img src={infantLogo} className="logo" alt="Infant Logo"></img>
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
						<Link to="/reports">Reports</Link>
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
