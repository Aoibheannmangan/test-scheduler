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
import Reports from "./pages/Reports";
import Footer from "./components/Footer";
import "@fontsource/sansation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProtectedRoute from "./components/ProtectedRoute";

//i
function App() {
	const location = useLocation();
	const hideNavbarPaths = ["/signup", "/login", "/forgotpsw"];
	const hideFooter = ["/signup", "/login", "/forgotpsw"];

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			{!hideNavbarPaths.includes(location.pathname) && <Navbar />}
			<div className="App">
				<Routes>
					<Route path="/login" element={<LogIn />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/forgotpsw" element={<ForgotPsw />} />
					<Route path="/" element={<ProtectedRoute />}>
						<Route
							path="/"
							element={<Navigate to="/calender" replace />}
						/>
						<Route path="/appoint" element={<Appointments />} />
						<Route path="/info" element={<UserInfo />} />
						<Route path="/calender" element={<MyCalendar />} />
						<Route path="/account" element={<Account />} />
						<Route path="/reports" element={<Reports />} />
						<Route
							path="/toggleAppointment"
							element={<ToggleAppointment />}
						/>
					</Route>
				</Routes>
			</div>
			{!hideFooter.includes(location.pathname) && <Footer />}
		</LocalizationProvider>
	);
}

export default App;
