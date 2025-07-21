import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';


const LogIn = () => {

    return (
        <div className="loginscreen">
            <form action="action_page.php" method="post">
                <div class="container">
                    <label for="uname"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required />

                    <label for="sid"><b>Staff ID</b></label>
                    <input type="number" placeholder="Enter Staff ID" name="sid" required />

                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required />

                    <button type="submit">Login</button>
                </div>
            </form>

            <div class="container">
                <button type="button" class="cancelbtn">Cancel</button>
                <span class="psw">Forgot <a href="#">password?</a></span>

            </div>
        </div>
    );
};

export default LogIn;