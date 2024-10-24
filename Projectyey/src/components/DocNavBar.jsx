import React, { useEffect, useState } from 'react';
import { Box, TextField, IconButton, Avatar, Typography, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import axios from 'axios';

const DocNavBar = () => {
    const { doctor, logoutDoctor } = useAuth(); // Access doctor and logout function
    const [notifications, setNotifications] = useState([]);
    const [profilePicture, setProfilePicture] = useState('');

    // Fetch profile picture on component mount
    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (doctor && doctor.id) {
                const response = await axios.get(`http://localhost:8080/doctor/getProfilePicture/${doctor.id}`);
                setProfilePicture(response.data.profilePicture);
            }
        };
        fetchProfilePicture();
    }, [doctor]);

    // Fetch notifications from local storage when the component mounts
    useEffect(() => {
        const savedNotifications = JSON.parse(localStorage.getItem('doctorNotifications')) || [];
        setNotifications(savedNotifications);
    }, []);

    // Function to clear notifications
    const handleClearNotifications = () => {
        setNotifications([]);
        localStorage.setItem('doctorNotifications', JSON.stringify([]));
    };

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
            <IconButton color="inherit">
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
        </Box>
    );
};

export default DocNavBar;
