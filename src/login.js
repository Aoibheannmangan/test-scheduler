import React, { useState } from 'react';
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
    <div className="login-container" 
   /* style={{
        backgroundImage: `linear-gradient(to right, rgba(141, 90, 151, 0.97), rgba(202, 141, 214, 0.97)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'multiply;',
    }} */>

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
              <h1>Log In</h1>
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
                    autocomplete="off"
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
                    autocomplete="off"
                    required
                  />
                </div>
                <div className="forgot-password-link">
                    <a href="/forgotpsw">Forgot Password?</a>
                </div>
              </div>
              <button 
                type="submit"
                className="loginbtn"
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
