import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import {FaUser, FaLock, FaEnvelope} from 'react-icons/fa'


const SignUp = () => {

    const [email, setEmail] = useState('');
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        //Email Validation (Only lets you register with a UCC Email)
        const emailPattern = /^[a-zA-Z0-9._+-]+@ucc\.ie$/;
        if(!emailPattern.test(email)) {
            alert("Invalid email. Please use your UCC email");
            return;
        }

        //Staff ID format validation 
        const staffIdPattern = /^\d{5}$/;
        if (!staffIdPattern.test(staffId)) {
            alert("Invalid Staff ID. Please use the correct format");
            return;
        }



        if (password !== repeatPassword) {
            alert("Passwords do not match! Please try again");
            return;
        }
        
        const userData = {
            email,
            staffId,
            password
        }

        localStorage.setItem('user', JSON.stringify(userData));
        alert("Account Successfully Created!")
        navigate('/calender')

    }

    return (
        <div className="signup-container">
            <div className="form-wrapper">
                <div className="signup-card">
                    <form onSubmit={handleSubmit}>
                        <div class="form-header">
                            <h1>Sign Up</h1>
                        </div>
                        <div className="form-body">
                            <div className="input-group">
                                <label for="email"><b>Email</b></label>
                                <div className="input-icon-wrapper">
                                    <FaEnvelope className="icon" />
                                    <input 
                                        type="email" 
                                        placeholder="Enter Email" 
                                        value= {email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label for="sid"><b>Staff ID</b></label>
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
                                <label for="psw"><b>Password</b></label>
                                <div className="input-icon-wrapper">
                                    <FaLock className="icon"/>
                                    <input 
                                        type="password" 
                                        placeholder="Enter Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label for="psw-repeat"><b>Repeat Password</b></label>
                                <div className="input-icon-wrapper">
                                    <FaLock className="icon"/>
                                    <input 
                                        type="password" 
                                        placeholder='Please re-enter your password' 
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div class="clearfix">
                                <div class="button-row">
                                    <button type="submit" class="signupbtn">Sign Up</button>
                                </div>
                                
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;