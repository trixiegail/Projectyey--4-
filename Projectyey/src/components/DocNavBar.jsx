import React, { useEffect, useState } from 'react';
import { Box, TextField, IconButton, Avatar, Typography, Badge, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DocNavBar = () => {
    const { doctor, logoutDoctor } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [profilePicture, setProfilePicture] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (doctor && doctor.id) {
                try {
                    const response = await axios.get(`http://localhost:8080/doctor/getProfilePicture/${doctor.id}`);
                    setProfilePicture(response.data); // if returning an accessible URL
                    console.log('Picture is fetched successfully')
                } catch (error) {
                    console.error('Error fetching profile picture:', error);
                }
            }
        };
        fetchProfilePicture();
    }, [doctor]);

    useEffect(() => {
        const savedNotifications = JSON.parse(localStorage.getItem('doctorNotifications')) || [];
        setNotifications(savedNotifications);
    }, []);

    const handleClearNotifications = () => {
        setNotifications([]);
        localStorage.setItem('doctorNotifications', JSON.stringify([]));
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        logoutDoctor();
        handleMenuClose();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, justifyContent: 'flex-end', width: '100%' }}>
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
            <IconButton color="inherit" onClick={handleClearNotifications}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                <Avatar sx={{ width: 40, height: 40, marginRight: 1 }} src={profilePicture} />
                <Box>
                    <Typography variant="body1">
                        Dr. {doctor ? `${doctor.firstname} ${doctor.lastname}` : 'Guest'}
                    </Typography>
                </Box>
            </Box>
            <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default DocNavBar;
