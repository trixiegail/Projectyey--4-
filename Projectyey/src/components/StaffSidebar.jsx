import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Button, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import { Link , useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/staffdashboard' },
    { text: 'Staff', icon: <PeopleIcon/> , path: '/stafflist'  },
    { text: 'Patients', icon: <PeopleIcon /> , path: '/' },
  ];

  const manageItems = [
    { text: 'Calendar', icon: <CalendarTodayIcon /> , path: '/staffcalendar' },
    { text: 'Appointments', icon: <EventAvailableIcon  /> , path: '/' },
    { text: 'Forms', icon: <DescriptionIcon  /> , path: '/staffforms' },
    { text: 'Messages', icon: <MailIcon  /> , path: '/' },
    { text: 'Settings', icon: <SettingsIcon /> , path: '/staffsettings' },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const handleLogoClick = () => {
    setIsClicked(true);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/staffdashboard');
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
        onClick={handleClick} 
      >
        <img
          src={isHovered ? 'src/image/teethLogoDesignYellow.png' : 'src/image/teethLogoDesignWhite.png'}
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
                '& .MuiListItemIcon-root': {
                  color: '#88343b', 
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Typography variant="caption" sx={{ p: 2, color: '#AAAAAA', textTransform: 'uppercase' }}>
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
                '& .MuiListItemIcon-root': {
                  color: '#88343b', // Change icon color on hover
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#f8c404', mt: 'auto' }} />
      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<ExitToAppIcon />}
          sx={{ color: '#FFFFFF', textTransform: 'none', 
              '&:hover': {
                backgroundColor: '#f8c404',
                color: '#88343b',
                '& .MuiListItemIcon-root': {
                  color: '#88343b', // Change icon color on hover
                },
              },
             }}
        > Log Out
        </Button> <br/>
        <Typography variant="caption" sx={{ mt: 1, color: '#AAAAAA',  textAlign: 'center', marginLeft: '50px' }}>
          © 2024 Capstone 2
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
