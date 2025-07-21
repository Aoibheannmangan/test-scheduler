import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    const [email, setEmail] = useState('');
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

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
        <div className="signupscreen">
            <form onSubmit={handleSubmit}>
                <div class="container">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account.</p>

                    <label for="email"><b>Email</b></label>
                    <input 
                        type="email" 
                        placeholder="Enter Email" 
                        value= {email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required />

                    <label for="sid"><b>Staff ID</b></label>
                    <input 
                        type="number" 
                        placeholder="Enter Staff ID" 
                        value={staffId} 
                        onChange={(e) => setStaffId(e.target.value)}
                        required />

                    <label for="psw"><b>Password</b></label>
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />

                    <label for="psw-repeat"><b>Repeat Password</b></label>
                    <input 
                        type="password" 
                        placeholder='Please re-enter your password' 
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)} 
                        required />

                    <div class="clearfix">
                        <div class="button-row">
                            <button type="button" class="cancelbtn">Cancel</button>
                            <button type="submit" class="signupbtn">Sign Up</button>
                        </div>
                        
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUp;