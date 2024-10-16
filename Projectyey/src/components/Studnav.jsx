import { Bars3Icon, EnvelopeIcon, MapPinIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from '../userpages/home';
import AboutUs from '../userpages/aboutus';
import Services from '../userpages/services';
import Contact from '../userpages/contact';
import StudentCalendar from '../userpages/calendar';
import StudentProtectedRoute from './StudentProtectedRoute';
import LoginStudent from '../login/LoginStudent';

export function Studnav() {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [studentName, setStudentName] = useState('Sign in');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Fetch student name from localStorage when the component mounts
  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    console.log('Fetched Student Name:', storedName); // Debug log
    if (storedName) {
      setStudentName(storedName);
    }
  }, []);

  // Logout function to clear localStorage and navigate to the login page
  const handleLogout = () => {
    localStorage.removeItem('studentName'); // Remove stored name
    navigate('/login-student', { replace: true }); // Prevent going back to previous page
  };
  
  // Handle avatar or name click
  const handleAvatarClick = () => {
    if (studentName === 'Sign in') {
      navigate('/login-student'); 
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="bg-[#F7C301] text-black py-5">
        <div className="w-full px-6 text-sm flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <MapPinIcon className="h-5 w-5" />
            <span>7VVJ+QFR, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu</span>
          </div>

          <div className="flex items-center space-x-4">
            <PhoneIcon className="h-5 w-5" />
            <span>(032) 261 7741</span>
            <EnvelopeIcon className="h-5 w-5" />
            <span>hi@happydental.com</span>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-2xl">
        <div className="w-full px-5 py-1">
          <div className="flex justify-start items-center">
            <a href="/home" className="flex items-center text-xl font-bold text-black">
              <img src="src/image/teethLogoDesign.png" alt="Teeth Logo" className="h-14" />
            </a>

            <div>
              {/* Navigation with framer-motion */}
              <nav className="hidden lg:flex space-x-8 ml-8">
                <Link to="/home" className="text-gray-700 hover:text-black">
                  Home
                </Link>
                <Link to="/aboutus" className="text-gray-700 hover:text-black">
                  About Us
                </Link>
                <Link to="/services" className="text-gray-700 hover:text-black">
                  Services
                </Link>
                <Link to="/student-calendar" className="text-gray-700 hover:text-black">
                  Book now
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-black">
                  Contact Us
                </Link>
              </nav>

              {/* Animated route transitions */}
              <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route
      path="/home"
      element={
        <StudentProtectedRoute>
          <PageWrapper>
            <Home />
          </PageWrapper>
        </StudentProtectedRoute>
      }
    />
    <Route
      path="/aboutus"
      element={
        <StudentProtectedRoute>
          <PageWrapper>
            <AboutUs />
          </PageWrapper>
        </StudentProtectedRoute>
      }
    />
    <Route
      path="/services"
      element={
        <StudentProtectedRoute>
          <PageWrapper>
            <Services />
          </PageWrapper>
        </StudentProtectedRoute>
      }
    />
    <Route
      path="/student-calendar"
      element={
        <StudentProtectedRoute>
          <PageWrapper>
            <StudentCalendar />
          </PageWrapper>
        </StudentProtectedRoute>
      }
    />
    <Route
      path="/contact"
      element={
        <StudentProtectedRoute>
          <PageWrapper>
            <Contact />
          </PageWrapper>
        </StudentProtectedRoute>
      }
    />
    <Route path="/login-student" element={<PageWrapper><LoginStudent  /></PageWrapper>} />
  </Routes>
</AnimatePresence>
            </div>

            <div className="flex items-center ml-auto">
              {studentName === 'Sign in' ? (
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={handleAvatarClick} 
                >
                  <Avatar
                    variant="circular"
                    alt="student avatar"
                    src="src/image/student.png"
                  />
                  <Typography variant="h6" className="font-medium text-gray-800">
                    {studentName} 
                  </Typography>
                </div>
              ) : (
                <Menu className="shadow-2xl">
                  <MenuHandler>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar
                        variant="circular"
                        alt="student avatar"
                        src="src/image/student.png"
                      />
                      <Typography variant="h6" className="font-medium text-gray-800">
                        {studentName} {/* Display student's name */}
                      </Typography>
                    </div>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <a href="/student-profile">My Profile</a>
                    </MenuItem>
                    <MenuItem onClick={toggleModal}>Inbox</MenuItem>
                    <MenuItem>
                      <a href="/contact">Help</a>
                    </MenuItem>
                    <hr className="my-2 border-blue-gray-50" />
                    <MenuItem onClick={handleLogout}>
                      <Typography variant="small" className="font-medium">
                        Sign Out
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>

            <button
              className="lg:hidden flex items-center px-3 py-2 border rounded"
              onClick={() => setIsToggleOpen(!isToggleOpen)}
            >
              {isToggleOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <ul className="space-y-2">
              <li className="border p-2 rounded">You have a new message.</li>
              <li className="border p-2 rounded">Assignment deadline approaching.</li>
              <li className="border p-2 rounded">New event in your course.</li>
            </ul>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export default Studnav;
