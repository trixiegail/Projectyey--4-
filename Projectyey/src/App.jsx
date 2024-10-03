import React, { useState } from 'react';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateDepartment from "./staffpages/CreateDepartment";
import CreateProgram from "./staffpages/CreateProgram";
import CreateStudent from "./staffpages/CreateStudentAccount";
import CreateUserRoleAccount from "./staffpages/CreateUserRoleAccount";
import Dashboard from "./staffpages/Dashboard";
import DoctorAccounts from "./staffpages/DoctorAccounts";
import NurseAccounts from "./staffpages/NurseAccounts";
import StaffAccounts from "./staffpages/StaffAccounts";
import StudentsAccounts from "./staffpages/StudentsAccounts";
import LoginStaff from './login/LoginStaff';
import ForgotPassword from './login/ForgotPassword';
import LoginStudent from './login/LoginStudent';
import LoginNurse from './login/LoginNurse';
import LoginAdmin from './login/LoginAdmin';
import LoginDoctor from './login/LoginDoctor';
import Archive from './staffpages/Archive';
import Home from './userpages/home';
import AboutUs from './userpages/aboutus';
import Services from './userpages/services';
import StudentCalendar from './userpages/calendar';
import Docinfo from "./pages/docinfo";
import Nurseinfo from "./pages/nurseinfo";
import Staffinfo from "./pages/staffinfo";
import Studinfo from "./pages/studinfo";
import RgstrForCheckup from "./pages/RegisterForCheckup";
import ChckupForm from "./pages/CheckupForm";
import CheckupApplicantList from "./pages/CheckupApplicantList";
import StudentMedicalHistory from "./pages/StudentMedicalHistory";
import MedicalHistoryProvider from "./pages/MedicalHistoryProvider";
import AfterLogin from "./pages/AfterLogin";
import StudentMedicalRecords from "./pages/StudentMedicalRecords";
import NurseSchedule from "./pages/NurseSchedule";
import CalendarSchedule from "./pages/CalendarSchedule";
import StaffArchive from './staffpages/StaffArchive';
import NurseArchive from './staffpages/NurseArchive';
import Contact from './userpages/contact';
import PrintView from './pages/printview';
import DentalChartForm from './doctor/DentalChart';
import IntraoralExamination from './doctor/IntraoralExam';
import DocDashboard from './doctor/Dashboard';
import BookingPage from './pages/BookingPage';
import Account from './studentprofile/Account'
import Settings from './studentprofile/Settings'

export default function App() {
  // State to manage events
  const [events, setEvents] = useState([
    // Add some initial dummy events if necessary
  ]);

  // Handler for booking a slot
  const handleBookSlot = (event) => {
    alert(`You have booked: ${event.title}`);
    // Logic for handling booking can be added here
  };

  return (
    <div>
      <BrowserRouter>
        <MedicalHistoryProvider>
          <Routes>
            <Route path="/" exact element={<LoginAdmin />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/student-accounts" exact element={<StudentsAccounts />} />
            <Route path="/staff-accounts" exact element={<StaffAccounts />} />
            <Route path="/nurse-accounts" exact element={<NurseAccounts />} />
            <Route path="/doctor-accounts" exact element={<DoctorAccounts />} />
            <Route path="/archived-student-accounts" exact element={<Archive />} />
            <Route path="/archived-staff-accounts" exact element={<StaffArchive />} />
            <Route path="/archived-nurse-accounts" exact element={<NurseArchive />} />
            <Route path="/create-account" exact element={<CreateUserRoleAccount />} />
            <Route path="/create-student-account" exact element={<CreateStudent />} />
            <Route path="/create-department" exact element={<CreateDepartment />} />
            <Route path="/create-program" exact element={<CreateProgram />} />
            <Route path="/login-staff" exact element={<LoginStaff />} />
            <Route path="/login-student" exact element={<LoginStudent />} />
            <Route path="/login-nurse" exact element={<LoginNurse />} />
            <Route path="/login-admin" exact element={<LoginAdmin />} />
            <Route path="/login-doctor" exact element={<LoginDoctor />} />
            <Route path="/change-password" exact element={<ForgotPassword />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/aboutus" exact element={<AboutUs />} />
            <Route path="/services" exact element={<Services />} />
            <Route path="/contact" exact element={<Contact />} />
            <Route path="/student-calendar" exact element={<StudentCalendar />} />
            <Route path="/home-personnel" exact element={<AfterLogin />} />
            <Route path="/studinfo" exact element={<Studinfo />} />
            <Route path="/nurseinfo" exact element={<Nurseinfo />} />
            <Route path="/docinfo" exact element={<Docinfo />} />
            <Route path="/staffinfo" exact element={<Staffinfo />} />
            <Route path="/RegisterForCheckup" exact element={<RgstrForCheckup />} />
            <Route path="/CheckupForm/:id" exact element={<ChckupForm />} />
            <Route path="/CheckupApplicantList" exact element={<CheckupApplicantList />} />
            <Route path="/StudentMedicalHistory" exact element={<StudentMedicalHistory />} />
            <Route path="/AfterLogin" exact element={<AfterLogin />} />
            <Route path="/StudentMedicalRecords" exact element={<StudentMedicalRecords />} />
            <Route path="/NurseSchedule" exact element={<NurseSchedule />} />
            <Route path="/CalendarSchedule" exact element={<CalendarSchedule />} />
            <Route path='/printview' exact element={<PrintView />} />
            <Route path='/checkupform' exact element={<ChckupForm />} />
            
            {/* Doctor */}
            <Route path='/dentalchartform' exact element={<DentalChartForm />} />
            <Route path='/intaoralexamination' exact element={<IntraoralExamination />} />
            <Route path='/docdashboard' exact element={<DocDashboard />} />
            
            {/* Booking Page */}
            <Route path='/booking' exact element={<BookingPage />} />

            <Route path="/account" component={<Account />} />
            <Route path="/settings" component={<Settings />} />
          </Routes>
        </MedicalHistoryProvider>
      </BrowserRouter>
    </div>
  );
}
