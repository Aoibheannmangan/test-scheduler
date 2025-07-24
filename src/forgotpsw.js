import React, { useState} from 'react';
import { useNavigate} from 'react-router-dom';
import Alert from './components/Alert';

const ForgotPsw = () => {
    const [staffId, setStaffId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.staffId === staffId);

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
                        <input 
                            type="number"
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>New Password</label>
                        <input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Reset Password</button>
                    </div> 
                </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPsw;