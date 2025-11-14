import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Alert from "../components/Alert";
import axios from "axios";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState(null);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/calender");
    }
  }, [navigate]);

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

  const handleLogin = async (e) => {
    //Login Logic
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      if (response.data.message) {
        localStorage.setItem("token", response.data.message);
        setAlert({ message: "Login Successful!", type: "success" });
        setTimeout(() => {
          navigate("/calender");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setAlert({ message: error.response.data.error, type: "error" });
      } else {
        setAlert({ message: "An unexpected error occurred", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
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
