import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.staffId === staffId && storedUser.password === password) {
            alert("Login Successful!");
            navigate('/calender'); 
        } else {
            alert("Staff ID or Password is incorrect!");
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <div className="login-card">
                    <form onSubmit={handleLogin}>
                        <div className="form-headers">
                            <h1>Log In</h1>
                        </div>
                    <div className="form-body">
                        <label htmlFor="sid"><b>Staff ID</b></label>
                        <input 
                            type="number" 
                            placeholder="Enter Staff ID" 
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)} 
                            required 
                        />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />

                        <button type="submit">Login</button>
                        <div className="signup-link">
                            <span className="change">Don't have an account?  <a href="/signup">Sign Up</a></span>
                        </div>
                    </div>
                </form>
                </div>
            </div>

        </div>
    );
};

export default LogIn;
