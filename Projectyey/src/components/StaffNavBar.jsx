// src/components/StaffNavBar.jsx
import React from 'react';
import { Box, TextField, IconButton, Avatar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const StaffNavBar = () => {
  const { staff, logoutStaff } = useAuth(); // Access staff and logout function

  return (
    <Box sx={{ display: 'flex', padding: 1, justifyContent: 'flex-end', width: '100%' }}>
      <TextField
        variant="outlined"
        placeholder="Search Here"
        size="small"
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
        sx={{ marginRight: 2, width: '20%' }}
      />
      <IconButton>
        <NotificationsIcon />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
        <Avatar sx={{ width: 40, height: 40, marginRight: 1 }} />
        <Box>
          <Typography variant="body1">
            {staff ? `${staff.firstname} ${staff.lastname}` : 'Guest'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StaffNavBar;
