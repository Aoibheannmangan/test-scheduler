import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Appointments from './appoint';
import BookAppointment from './book';
import UserInfo from './info';
import Navbar from './components/Navbar';
import MyCalendar from './calender';
import Account from './account'; 
import LogIn from './login';
import SignUp from './signup';

function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/signup', '/login'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/appoint" element={<Appointments />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/info" element={<UserInfo />} />
          <Route path="/calender" element={<MyCalendar />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
