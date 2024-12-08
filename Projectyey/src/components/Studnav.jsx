import { Bars3Icon, EnvelopeIcon, MapPinIcon, PhoneIcon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline'; 
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
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
import Appointments from '../userpages/appointments';

export function Studnav() {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]); 
  const location = useLocation();
  const [studentName, setStudentName] = useState('Sign in');
  const navigate = useNavigate();
  const notificationRef = useRef(null); 
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (storedName) {
      setStudentName(storedName);
    }

    const fetchNotifications = () => {
      const exampleNotifications = [
        { id: 1, date: '2024-10-22', summary: 'New message from Dr. Smith', details: 'You have a dental checkup scheduled.' },
        { id: 2, date: '2024-10-20', summary: 'Reminder: Upcoming Appointment', details: 'Your appointment is scheduled for 2024-10-25.' },
        { id: 3, date: '2024-10-18', summary: 'Assignment Deadline Approaching', details: 'Please complete your health assessment before the deadline.' }
      ];
      setNotifications(exampleNotifications);
    };

    fetchNotifications(); 
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
    setIsNotificationOpen((prev) => !prev); 
  };

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


  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <>
      <div className="bg-[#fee140] bg-gradient-to-b from-[#F0E1A6] via-[#F0E1A6] to-[#E1C966] text-black py-5">
      <div className="flex justify-between items-center w-full px-6 text-sm">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <MapPinIcon className="h-5 w-5" />
          <span>7VVJ+QFR, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <EnvelopeIcon className="h-5 w-5" />
          <span>dentalcapstone5@gmail.com</span>
        </div>
      </div>
    </div>


        <header className="bg-white shadow-2xl">
    <div className="w-full px-5 py-7">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <a
        href="/home"
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            isHovered
              ? "src/image/teethLogoDesignYellow.png"
              : "src/image/teethLogoDesign.png"
          }
          alt="Teeth Logo"
          className="h-14 transition-all duration-300"
        />
      </a>

      {/* Center: Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-8">
      {[
        { to: "/home", label: "Home" },
        { to: "/aboutus", label: "About Us" },
        { to: "/services", label: "Services" },
        { to: "/student-calendar", label: "Book now" },
        { to: "/appointments", label: "Appointments" },
        { to: "/contact", label: "Contact Us" },
      ].map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={`relative text-gray-700 font-medium transition-all duration-300 ${
            location.pathname === link.to
              ? "text-gray-700 after:absolute after:left-0 after:bottom-[-2px] after:bg-gray-700 after:h-[2px] after:w-full"
              : "hover:text-[#88343B] hover:after:absolute hover:after:left-0 hover:after:bottom-[-2px] hover:after:bg-[#88343B] hover:after:h-[2px] hover:after:w-full"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>

      {/* Right: Sign In/Profile Section */}
      <div className="flex items-center space-x-4">
    

        {studentName === "Sign in" ? (
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar
              variant="circular"
              alt="student avatar"
              src="/student.png"
            />
            <Typography
              variant="h6"
              className="font-medium text-gray-800"
            >
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
                  src="/student.png"
                />
                <Typography
                  variant="h6"
                  className="font-medium text-black"
                >
                  {studentName}
                </Typography>
              </div>
            </MenuHandler>

            <MenuList className="bg-white">
              <MenuItem className="bg-white hover:bg-gradient-to-b from-[#F0E1A6] !hover:text-black">
                <a
                  href="/student-profile"
                  className="text-black font-bold"
                >
                  My Profile
                </a>
              </MenuItem>
              {/* <MenuItem className="bg-white hover:bg-gradient-to-b from-[#F0E1A6] !hover:text-black">
                <a
                  href="/settings"
                  className="text-black font-bold"
                >
                  Settings
                </a>
              </MenuItem> */}
              <MenuItem className="bg-white hover:bg-gradient-to-b from-[#F0E1A6] !hover:text-black">
                <a
                  href="/contact"
                  className="font-bold text-black"
                >
                  Help
                </a>
              </MenuItem>
              <hr className="my-2 bg-[#F7C301]" />
              <MenuItem
                className="bg-white hover:bg-gradient-to-b from-[#F0E1A6] !hover:text-black"
                onClick={handleLogout}
              >
                <Typography
                  variant="small"
                  className="font-bold text-black"
                >
                  Sign Out
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
    </div>
  </div>
</header>
    </>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
    {children}
  </motion.div>
);

export default Studnav;
