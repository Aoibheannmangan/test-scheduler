import React, { useState} from 'react'; 
import { useNavigate} from 'react-router-dom'; 
import Alert from './components/Alert'; 
import {FaUser, FaLock} from 'react-icons/fa'; 

const ForgotPsw = () => { 
    const [staffId, setStaffId] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [alert, setAlert] = useState(null); 
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
        setNewPassword(value); 

        setPasswordValidations({ 
            lowercase: /[a-z]/.test(value), 
            uppercase: /[A-Z]/.test(value), 
            number: /[0-9]/.test(value), 
            length: value.length >= 8, 
        }); 
    }; 

    const handleReset = (e) => { 
        e.preventDefault(); 
        const users = JSON.parse(localStorage.getItem('users')) || []; 
        const userIndex = users.findIndex(user => user.staffId === staffId); 

        const isValid =  
            passwordValidations.lowercase && 
            passwordValidations.uppercase && 
            passwordValidations.number && 
            passwordValidations.length; 

            if (!isValid) { 
                setAlert({ message: "Invalid Password. Must contain at least 8 character, including an uppercase letter, a lowercase letter and a number", type:"error"}); 
                return; 
            } 

        if (userIndex !== -1) { 
            const currentPassword = users[userIndex].password; 
            if (newPassword === currentPassword) { 
                setAlert({ message: "New password cannot be the same as the old password", type:"error"}); 
                return; 
            } 

            users[userIndex].password = newPassword; 
            localStorage.setItem('users', JSON. stringify(users)); 
            setAlert({message: 'Password reset successful!', type: 'success'}); 
            navigate('/calender'); 
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

                <form onSubmit={handleReset}> 
                    <h1 className="title">Reset Password</h1> 
                    <div className="form-body"> 
                        <div className="input-group"> 
                        <label>Staff ID</label> 
                        <div className="input-icon-wrapper"> 
                            <FaUser className="icon" /> 
                            <input  
                                type="number" 
                                value={staffId} 
                                onChange={(e) => setStaffId(e.target.value)} 
                                required 
                            /> 
                        </div> 
                    </div> 

                    <div className="input-group"> 
                        <label>New Password</label> 
                        <div className="input-icon-wrapper"> 
                             <FaLock className="icon" /> 
                             <input  
                                type="password" 
                                value={newPassword} 
                                onChange={handlePasswordChange} 
                                onFocus={() => setShowPasswordMessage(true)} 
                                onBlur ={() => setShowPasswordMessage(false)} 
                                required 
                            /> 
                        </div> 
                    </div> 
                    {showPasswordMessage && ( 
                        <div id="message"> 
                            <h3>Password must contain the following:</h3> 
                            <p className={passwordValidations.lowercase ? 'valid' : 'invalid'}> 
                                A <b>lowercase</b> letter 
                            </p> 
                            <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}> 
                                An <b>uppercase</b> letter 
                            </p> 
                            <p className={passwordValidations.number ? 'valid' : 'invalid'}> 
                                A <b>number</b> 
                            </p> 
                            <p className={passwordValidations.length ? 'valid' : 'invalid'}> 
                                Minimum <b>8 characters</b>  
                            </p> 
                        </div> 
                    )} 
                    <button type="submit" className="login-button">Reset Password</button> 
                    </div>  
                </form> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default ForgotPsw; 