import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import Alert from './components/Alert';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  const [showAlert, setShowAlert] = useState(true);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  // Password Validation for making sure the password has the different requirements
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordValidations({
      // Password needs a lowercase letter, an uppercase letter, a number and needs to be longer than eight characters
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      length: value.length >= 8,
    });
  };

  const isEmailRegistered = (email) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.some((user) => user.email === email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For email validation, makes sure it ends in @ucc.ie 
    const emailPattern = /^[a-zA-Z0-9._+-]+@ucc\.ie$/;
    if (!emailPattern.test(email)) {
      setAlert({ message: "Invalid format. Please use your UCC Email", type: "warning" });
      return;
    }

    // Also Checks if the email has already been used
    if (isEmailRegistered(email)) {
      setAlert({ message: "Email is already registered", type: "info" });
      return;
    }

    // For ID validation, makes sure it is exactly 5 numbers long
    const staffIdPattern = /^\d{5}$/;
    if (!staffIdPattern.test(staffId)) {
      setAlert({ message: "Invalid Staff ID Format", type: "warning" });
      return;
    }

    // Makes sure password and initial password works
    if (password !== repeatPassword) {
      setAlert({ message: "Passwords do not match. Please try again", type: "error" });
      return;
    }

    const userData = {
      email,
      staffId,
      password,
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    // Loading
    setIsSubmitting(true);
    setTimeout(() => {
      setShowAlert({ message: "Login Successful!", type: "success" });
      setIsSubmitting(false);
      navigate('/calender');
    }, 2000);
  };

  return (
    <div className="signup-container">
      <div className="form-wrapper">
        <div className="signup-card">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Sign Up</h1>
            </div>
            <div className="form-body">
              <div className="input-group">
                <label htmlFor="email"><b>Email</b></label>
                <div className="input-icon-wrapper">
                  <FaEnvelope className="icon" />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="sid"><b>Staff ID</b></label>
                <div className="input-icon-wrapper">
                  <FaUser className="icon" />
                  <input
                    type="number"
                    placeholder="Enter Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
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
                    placeholder="Enter Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setShowPasswordMessage(true)}
                    onBlur={() => setShowPasswordMessage(false)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                <div className="input-icon-wrapper">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="Please re-enter your password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="clearfix">
                <div className="button-row">
                  <button
                    type="submit"
                    className="signupbtn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="spinner"></div>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {showPasswordMessage && (
            <div id="message">
              <h3>Password must contain the following:</h3>
              <p className={passwordValidations.lowercase ? 'valid' : 'invalid'}>
                A <b>lowercase</b> letter
              </p>
              <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}>
                A <b>capital (uppercase)</b> letter
              </p>
              <p className={passwordValidations.number ? 'valid' : 'invalid'}>
                A <b>number</b>
              </p>
              <p className={passwordValidations.length ? 'valid' : 'invalid'}>
                Minimum <b>8 characters</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
