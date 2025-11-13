import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Alert from "../components/Alert";

/**
 * LogIn component that renders the LogIn form and handles user authentication
 * 
 * Checks for stored users, verifies credentials,
 * navigates to the calendar page on success, displays alert if failed
 * 
 * @component
 * @example
 * <Route path="/login" element={<LogIn />} />
 * 
 * @returns {JSX.Element} The LogIn component 
 */

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState(null);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordInputRef = useRef(null);

  const navigate = useNavigate();

    /**
     * 
     * Event handler to check if caps lock is on
     * @param {KeyboardEvent} event - The keyboard event/ 
     */
  useEffect(() => {
    //To check if the caps lock is on
    const handleKeyUp = (event) => {
      if (event.getModifierState("CapsLock")) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }
    };

    const input = passwordInputRef.current;
    if (input) {
      input.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      if (input) {
        input.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, []);

  /**
   * 
   * Handles the login form submission
   * 
   * Checks if the email and password submitted by the user match an already created account.
   * Displays a success alert and navigates to the calendar page if credentials are correct.
   * Displays an error alert if credentials are incorrect.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {void} 
   */

  const handleLogin = (e) => {
    //Login Logic
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if any user in the array matches the entered details
    const matchedUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      setIsSubmitting(true);
      setTimeout(() => {
        setAlert({ message: "Login Successful!", type: "success" });
        setIsSubmitting(false);
        navigate("/calender");
      }, 2000);
    } else {
      setAlert({ message: "Email or Password is incorrect!", type: "error" });
    }
  };

 
  return (
    <div className="login-container">
      <div className="form-wrapper">
        <div className="login-card">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="form-headers">
              <h1 className="title">Log In</h1>
            </div>
            <div className="form-body">
              <div className="input-group">
                <label htmlFor="email">
                  <b>Email</b>
                </label>
                <div className="input-icon-wrapper">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {/* User enters password */}
              <div className="input-group">
                <label htmlFor="password">
                  <b>Password</b>
                </label>
                <div className="input-icon-wrapper">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    ref={passwordInputRef}
                    required
                  />
                </div>
                {capsLockOn && (
                  <div
                    className="caps-warning"
                    style={{ color: "red", marginTop: "5px" }}
                  >
                    Warning: Caps Lock is ON
                  </div>
                )}
                <div className="forgot-password-link">
                  <a href="/forgotpsw">
                    <br />
                    Forgot Password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="spinner"></div> : "Log In"}
              </button>
              <div className="signup-link">
                <span className="change">
                  Don't have an account? <a href="/signup">Sign Up</a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
