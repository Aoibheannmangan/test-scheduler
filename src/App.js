import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Appointments from './appoint';
import BookAppointment from './book';
import UserInfo from './info';
import Navbar from './Navbar';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
    <Routes>
          <Route path="/appoint" element={<Appointments />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/info" element={<UserInfo />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
