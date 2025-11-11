import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Appointments from "./pages/AppointView";
import UserInfo from "./pages/info";
import Navbar from "./components/Navbar";
import MyCalendar from "./pages/Calendar";
import Account from "./pages/account";
import LogIn from "./pages/login";
import SignUp from "./pages/signup";
import ForgotPsw from "./components/forgotpsw";
import ToggleAppointment from "./pages/Appointment";
import "@fontsource/sansation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/signup", "/login", "/forgotpsw"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="App">
        <Routes>
          <Route path="/login/:id" element={<LogIn />} />
          <Route path="/signup/:id" element={<SignUp />} />
          <Route path="/forgotpsw/:id" element={<ForgotPsw />} />
          <Route path="/:id" element={<ProtectedRoute />}>
            <Route path="/:id" element={<Navigate to="/calender" replace />} />
            <Route path="/appoint/:id" element={<Appointments />} />
            <Route path="/info/:id" element={<UserInfo />} />
            <Route path="/calender/:id" element={<MyCalendar />} />
            <Route path="/account/:id" element={<Account />} />
            <Route path="/toggleAppointment/:id" element={<ToggleAppointment />} />
          </Route>
        </Routes>
      </div>
    </LocalizationProvider>
  );
}

export default App;
