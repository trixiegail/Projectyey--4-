import React, { createContext, useState } from 'react';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; 

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
import StaffCheckupApplicantList from "./staff/StaffCheckupApplicantList";
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
import Sidebar from './components/DocSidebar';
import StaffSidebar from './components/StaffSidebar';
import NurseDashboard from './nurse/NurseDashboard';
import DocCalendar from './doctor/DocCalendar';
import FormManagement from './doctor/FormManagement';
import DoctorList from './doctor/DoctorList';
import DocForms from './doctor/DocForms';
import DocSettings from './doctor/DocSettings';
import StaffDashboard from './staff/Dashboard';
import StaffCalendar from './staff/StaffCalendar';
import StaffList from './staff/StaffList';
import StaffForms from './staff/StaffForms';
import StaffSettings from './staff/StaffSettings';
import Patients from './doctor/Patients';
import { PatientsContext } from './doctor/PatientsContext';
import { StaffPatientsContext } from './staff/StaffPatientsContext';
import { PatientsProvider } from './doctor/PatientsContext';
import StaffPatients from './staff/StaffPatients';
import { StaffPatientsProvider } from './staff/StaffPatientsContext';
import StudentProfile from "@/userpages/studentprofile.jsx";



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
      <PatientsProvider>
      <StaffPatientsProvider>
      <BrowserRouter>
      <AuthProvider>
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
            <Route path="/home" exact element={<Home />} />
            <Route path="/aboutus" exact element={<AboutUs />} />
            <Route path="/services" exact element={<Services />} />
            <Route path="/contact/*" exact element={<Contact />} />
            <Route path="/student-calendar/*" exact element={<StudentCalendar />} />
            <Route path="/home-personnel" exact element={<AfterLogin />} />
            <Route path="/studinfo" exact element={<Studinfo />} />
            <Route path="/nurseinfo" exact element={<Nurseinfo />} />
            <Route path="/docinfo" exact element={<Docinfo />} />
            <Route path="/staffinfo" exact element={<Staffinfo />} />
            <Route path="/RegisterForCheckup" exact element={<RgstrForCheckup />} />
            <Route path="/CheckupApplicantList" exact element={<CheckupApplicantList />} />
            <Route path="/StudentMedicalHistory" exact element={<StudentMedicalHistory />} />
            <Route path="/AfterLogin" exact element={<AfterLogin />} />
            <Route path="/StudentMedicalRecords" exact element={<StudentMedicalRecords />} />
            <Route path="/NurseSchedule" exact element={<NurseSchedule />} />
            <Route path="/CalendarSchedule" exact element={<CalendarSchedule />} />
            <Route path='/printview' exact element={<PrintView />} />
            <Route path='/sidebar' exact element={<StudentProfile />} />
            <Route path='/student-profile' exact element={<StudentProfile />} />
            

            <Route path="/CheckupForm/:studentIdNumber" exact element={<ChckupForm />} />
            <Route path="/PatientForm/:studentIdNumber" exact element={<PatientForm />} />
            <Route path='/checkupform' exact element={<ChckupForm />} />
            
            {/* Doctor */}
            <Route element={<ProtectedRoute />}>
            <Route path='/dentalchartform' exact element={<DentalChartForm />} />
            <Route path='/intaoralexamination' exact element={<IntraoralExamination />} />
            <Route path='/docdashboard' exact element={<DocDashboard />} />
            <Route path='/doccalendar' exact element={<DocCalendar />} />
            <Route path='/forms' exact element={<FormManagement />} />
            <Route path='/doctorlist' exact element={<DoctorList />} />
            <Route path='/docforms' exact element={<DocForms />} />
            <Route path='/docsettings' exact element={<DocSettings />} />
            <Route path='/patientlist' exact element={<Patients />} />
            <Route path="/declined-appointments" element={<DeclinedAppointments />} />
            <Route path="/completed-appointments" element={<CompletedAppointments />} />
            </Route>

            {/* Staff */}
            <Route path='/staffdashboard' exact element={<StaffDashboard />} />
            <Route path='/staffcalendar' exact element={<StaffCalendar />} />
            <Route path='/stafflist' exact element={<StaffList />} />
            <Route path='/staffforms' exact element={<StaffForms />} />
            <Route path='/staffsettings' exact element={<StaffSettings />} />
            <Route path='/staffpatientlist' exact element={<StaffPatients />} />

            {/* Login */}
            <Route path="/login-student" exact element={<LoginStudent />} />
            <Route path="/login-staff" exact element={<LoginStaff />} />
            <Route path="/login-nurse" exact element={<LoginNurse />} />
            <Route path="/login-admin" exact element={<LoginAdmin />} />
            <Route path="/login-doctor" exact element={<LoginDoctor />} />
            <Route path="/change-password" exact element={<ChangePassword />} />
            <Route path="/forgot-password" exact element={<ForgotPassword />} />

            
            
            {/* Booking Page */}
            <Route path='/booking' exact element={<BookingPage />} />

            <Route path='/nursedashboard' exact element={<NurseDashboard />} />

        
          </Routes>
        </MedicalHistoryProvider>
        </AuthProvider>
      </BrowserRouter>
      </StaffPatientsProvider>
      </PatientsProvider>
    </div>
  );
}
