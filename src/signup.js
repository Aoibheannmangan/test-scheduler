import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordValidations({
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      length: value.length >= 8,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._+-]+@ucc\.ie$/;
    if (!emailPattern.test(email)) {
      alert('Invalid email. Please use your UCC email');
      return;
    }

    const staffIdPattern = /^\d{5}$/;
    if (!staffIdPattern.test(staffId)) {
      alert('Invalid Staff ID. Please use the correct format');
      return;
    }

    if (password !== repeatPassword) {
      alert('Passwords do not match! Please try again');
      return;
    }

    const userData = {
      email,
      staffId,
      password,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    alert('Account Successfully Created!');
    navigate('/calender');
  };

  return (
    <div className="signup-container">
      <div className="form-wrapper">
        <div className="signup-card">
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
                  <button type="submit" className="signupbtn">Sign Up</button>
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
