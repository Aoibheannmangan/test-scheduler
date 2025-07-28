import React, { useState, useEffect, useRef } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Alert from './components/Alert';
import backgroundImage from './assets/logo.jpg';


const LogIn = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const [showAlert, setShowAlert] = useState(true);
  const [alert, setAlert] = useState(null);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const passwordInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
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


  const handleLogin = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if any user in the array matches the entered credentials
    const matchedUser = storedUsers.find(
      (user) => user.staffId === staffId && user.password === password
    );

    if (matchedUser) {
      setIsSubmitting(true);
      setTimeout(() => {
      setAlert({ message: "Login Successful!", type: "success" });
      setIsSubmitting(false);
      navigate('/calender');
    }, 2000);
    } else {
      setAlert({ message: "Staff ID or Password is incorrect!", type: "error" });
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

          <form onSubmit={handleLogin}>
            <div className="form-headers">
              <h1 className="title">Log In</h1>
            </div>
            <div className="form-body">
              <div className="input-group">
                <label htmlFor="sid"><b>Staff ID</b></label>
                <div className="input-icon-wrapper">
                  <FaUser className="icon" />
                  <input
                    type="number"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="psw"><b>Password</b></label>
                <div className="input-icon-wrapper">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    ref={passwordInputRef}
                    required
                  />


                </div>
                {capsLockOn && (
                    <div className="caps-warning" style={{ color: 'red', marginTop: '5px' }}>
                        Warning: Caps Lock is ON
                    </div>
                )}
                <div className="forgot-password-link">
                    <a href="/forgotpsw"><br />Forgot Password?</a>
                </div>
              </div>
              <button 
                type="submit"
                className="login-button"
                disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="spinner"></div>
                    ) : (
                      'Log In'
                    )}
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
