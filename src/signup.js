import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    return (
        <div className="signupscreen">
            <form action="action_page.php">
                <div class="container">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account.</p>

                    <label for="email"><b>Email</b></label>
                    <input type="email" placeholder="Enter Email" name="email" required />

                    <label for="sid"><b>Staff ID</b></label>
                    <input type="number" placeholder="Enter Staff ID" name="sid" required />

                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required />

                    <label for="psw-repeat"><b>Repeat Password</b></label>
                    <input type="password" placeholder='Please re-enter your password' name="psw-repeat" required />

                    <div class="clearfix">
                        <button type="button" class="cancelbtn">Cancel</button>
                        <button type="submit" class="signupbtn">Sign Up</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUp;