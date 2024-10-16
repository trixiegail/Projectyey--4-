import React, { useState } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Typography, Divider, Button, Box 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { doctor, logoutDoctor } = useAuth();
  const navigate = useNavigate(); // Declare it only once

  const handleLogout = () => {
    logoutDoctor();
    navigate('/login-doctor');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/docdashboard' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctorlist' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/' },
  ];

  const manageItems = [
    { text: 'Calendar', icon: <CalendarTodayIcon />, path: '/doccalendar' },
    { text: 'Appointments', icon: <EventAvailableIcon />, path: '/' },
    { text: 'Forms', icon: <DescriptionIcon />, path: '/docforms' },
    { text: 'Messages', icon: <MailIcon />, path: '/' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/docsettings' },
  ];

  const [isHovered, setIsHovered] = useState(false);

  const handleLogoClick = () => {
    navigate('/docdashboard'); // Use navigate here directly
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#88343b',
          color: '#FFFFFF',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleLogoClick} // Use the logo click handler
      >
        <img
          src={
            isHovered 
              ? 'src/image/teethLogoDesignYellow.png' 
              : 'src/image/teethLogoDesignWhite.png'
          }
          alt="Logo"
          style={{ width: '150px', height: 'auto', transition: '0.3s' }}
        />
      </Box>

      <Divider sx={{ borderColor: '#f8c404' }} />

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            sx={{
              '&:hover': {
                backgroundColor: '#f8c404',
                color: '#88343b',
                '& .MuiListItemIcon-root': { color: '#88343b' },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Typography
        variant="caption"
        sx={{ p: 2, color: '#AAAAAA', textTransform: 'uppercase' }}
      >
        Manage
      </Typography>

      <List>
        {manageItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            sx={{
              '&:hover': {
                backgroundColor: '#f8c404',
                color: '#88343b',
                '& .MuiListItemIcon-root': { color: '#88343b' },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#f8c404', mt: 'auto' }} />

      <Box sx={{ p: 2 }}>
        <Button
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          sx={{
            color: '#FFFFFF',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f8c404',
              color: '#88343b',
              '& .MuiListItemIcon-root': { color: '#88343b' },
            },
          }}
        >
          Log Out
        </Button>

        <Box
        sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}
      >
        <Typography
          variant="caption"
          sx={{ color: '#AAAAAA' }}
        >
          © 2024 Capstone 2
        </Typography>
      </Box>

      </Box>
    </Drawer>
  );
};

export default Sidebar;
