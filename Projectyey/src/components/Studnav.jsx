import { Bars3Icon, EnvelopeIcon, MapPinIcon, PhoneIcon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline'; 
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
  Button,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState, useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginStudent from '../login/LoginStudent';
import AboutUs from '../userpages/aboutus';
import StudentCalendar from '../userpages/calendar';
import Contact from '../userpages/contact';
import Home from '../userpages/home';
import Services from '../userpages/services';
import StudentProtectedRoute from './StudentProtectedRoute';

export function Studnav() {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for managing notification dropdown visibility
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const location = useLocation();
  const [studentName, setStudentName] = useState('Sign in');
  const navigate = useNavigate();
  const notificationRef = useRef(null); // To handle closing the dropdown when clicking outside

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (storedName) {
      setStudentName(storedName);
    }

    // Simulating fetching notifications from an API
    const fetchNotifications = () => {
      const exampleNotifications = [
        { id: 1, date: '2024-10-22', summary: 'New message from Dr. Smith', details: 'You have a dental checkup scheduled.' },
        { id: 2, date: '2024-10-20', summary: 'Reminder: Upcoming Appointment', details: 'Your appointment is scheduled for 2024-10-25.' },
        { id: 3, date: '2024-10-18', summary: 'Assignment Deadline Approaching', details: 'Please complete your health assessment before the deadline.' }
      ];
      setNotifications(exampleNotifications);
    };

    fetchNotifications(); // Simulate fetching notifications
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentName'); 
    navigate('/login-student', { replace: true });
  };

  const handleAvatarClick = () => {
    if (studentName === 'Sign in') {
      navigate('/login-student');
    }
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev); // Toggle notification dropdown
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  return (
    <>
      <div className="bg-[#fee140] bg-gradient-to-b from-[#F0E1A6] via-[#F0E1A6] to-[#E1C966] text-black py-5">
        <div className="container mx-auto flex justify-between items-center px-6 text-sm">
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
        <div className="container mx-auto px-5 py-7">
          <div className="flex justify-between items-center">
            <a href="/home" className="flex items-center text-xl font-bold text-black">
              <img src="src/image/teethLogoDesign.png" alt="Teeth Logo" className="h-14" />
            </a>

            <div>
              {/* Navigation */}
              <nav className="items-center justify-center hidden lg:flex space-x-8">
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

              {/* Route transitions */}
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
                  <Route path="/login-student" element={<PageWrapper><LoginStudent /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </div>

            {/* Right side with Notification and Avatar */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notificationRef}>
                <BellIcon className="h-6 w-6 text-gray-800 hover:text-black cursor-pointer" onClick={toggleNotification} />
                
                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <h2 className="text-lg font-semibold">Notifications</h2>
                      <ul className="space-y-2">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li key={notification.id} className="border p-2 rounded cursor-pointer hover:bg-gray-100">
                              <div className="flex justify-between">
                                <span>{notification.summary}</span>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-600">No new notifications</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar and Menu */}
              {studentName === 'Sign in' ? (
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleAvatarClick}>
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
                      <Typography variant="h6" className="font-medium text-black">
                        {studentName}
                      </Typography>
                    </div>
                  </MenuHandler>

                  <MenuList>
                    <MenuItem>
                      <a
                        href="/student-profile"
                        className="text-white hover:text-[rgb(136,52,59)] transition-colors duration-300"
                      >
                        My Profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="/contact"
                        className="font-medium text-white hover:text-[rgb(136,52,59)] transition-colors duration-300"
                      >
                        Help
                      </a>
                    </MenuItem>
                    <hr className="my-2 bg-[#F7C301]" />
                    <MenuItem onClick={handleLogout}>
                      <Typography
                        variant="small"
                        className="font-medium text-white hover:text-[rgb(136,52,59)] transition-colors duration-300"
                      >
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
