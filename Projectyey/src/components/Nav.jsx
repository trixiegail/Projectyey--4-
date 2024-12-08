import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true); // Open the confirmation modal
  };

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    // Logic to log out and navigate to the login page
  };

  const handleLogoutCancel = () => {
    setLogoutConfirmOpen(false); // Close the confirmation modal
  };

  const menuItems = [
    { text: 'Students', icon: <PeopleIcon />, path: '/student-accounts' },
    { text: 'Staffs', icon: <LocalHospitalIcon />, path: '/staff-accounts' },
    { text: 'Nurses', icon: <LocalHospitalIcon />, path: '/nurse-accounts' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctor-accounts' },
  ];

  const archiveItems = [
    { text: 'Students', path: '/archived-student-accounts' },
    { text: 'Nurses', path: '/archived-nurse-accounts' },
    { text: 'Staff', path: '/archived-staff-accounts' },
    { text: 'Doctors', path: '/archived-doctor-accounts' },
  ];

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
      >
        <img
          src={
            isHovered
              ? '/teethLogoDesignYellow.png'
              : '/teethLogoDesignWhite.png'
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
        Archive
      </Typography>

      <List>
        {archiveItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            sx={{
              '&:hover': {
                backgroundColor: '#f8c404',
                color: '#88343b',
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#f8c404', mt: 'auto' }} />

      <Box sx={{ p: 2 }}>
        <Button
          onClick={handleLogoutClick}
          startIcon={<ExitToAppIcon />}
          sx={{
            color: '#FFFFFF',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f8c404',
              color: '#88343b',
            },
          }}
        >
          Log Out
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
            © 2024 Capstone 2
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={logoutConfirmOpen}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Logging out will end your current session and return you to the login page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="secondary">
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
