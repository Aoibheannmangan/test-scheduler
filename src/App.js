import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Appointments from './appoint';
import UserInfo from './info';
import Navbar from './components/Navbar';
import MyCalendar from './calender';
import Account from './account'; 
import LogIn from './login';
import SignUp from './signup';
import ForgotPsw from './forgotpsw'
import ToggleAppointment from './components/toggleAppointment';
import '@fontsource/sansation';

function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/signup', '/login', '/forgotpsw'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/appoint" element={<Appointments />} />
          <Route path="/info" element={<UserInfo />} />
          <Route path="/calender" element={<MyCalendar />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpsw" element={<ForgotPsw />} />
          <Route path="/toggleAppointment" element={<ToggleAppointment />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
