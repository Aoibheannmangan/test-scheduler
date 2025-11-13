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
import Forecast from "./pages/Forecast";
import "@fontsource/sansation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

//i
function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/signup", "/login", "/forgotpsw"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/toggleAppointment" element={<ToggleAppointment />} />
        </Routes>
      </div>
    </LocalizationProvider>
  );
}

export default App;
