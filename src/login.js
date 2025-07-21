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
        <div className="loginscreen">
            <div className="form-border">
                <form onSubmit={handleLogin}>
                <div className="container">
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
                    <div className="link-row">
                        <span className="change">Don't have an account?  <a href="/signup">Sign Up</a></span>
                    </div>
                </div>
            </form>
            </div>

        </div>
    );
};

export default LogIn;
