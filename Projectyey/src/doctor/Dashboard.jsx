import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Button, IconButton, Badge, List, ListItem, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../components/DocSidebar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import DocNavBar from '../components/DocNavBar';

const Dashboard = () => {
    const [notifications, setNotifications] = useState([]);

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
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#90343c' }}>
                        Dashboard
                    </Typography>

                    {/* Notification Icon with Badge */}
                    {/*<IconButton color="inherit">*/}
                    {/*    <Badge badgeContent={notifications.length} color="error">*/}
                    {/*        <NotificationsIcon />*/}
                    {/*    </Badge>*/}
                    {/*</IconButton>*/}

                    <DocNavBar />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                p: 2,
                                backgroundColor: '#8B232A',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                '&:hover': { backgroundColor: '#6E1D22' }, // Darken on hover
                            }}
                            onClick={() => alert('Patients Today button clicked!')}
                        >
                            <Typography variant="subtitle1">Patients Today</Typography>
                            <Typography variant="h5">0</Typography>
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                p: 2,
                                backgroundColor: '#8B232A',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                '&:hover': { backgroundColor: '#6E1D22' }, // Darken on hover
                            }}
                            onClick={() => alert('Total Patients button clicked!')}
                        >
                            <Typography variant="subtitle1">Total Patients</Typography>
                            <Typography variant="h5">0</Typography>
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                p: 2,
                                backgroundColor: '#8B232A',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                '&:hover': { backgroundColor: '#6E1D22' }, // Darken on hover
                            }}
                            onClick={() => alert('For Recall button clicked!')}
                        >
                            <Typography variant="subtitle1">For Recall</Typography>
                            <Typography variant="h5">0</Typography>
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                p: 2,
                                backgroundColor: '#8B232A',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                '&:hover': { backgroundColor: '#6E1D22' }, // Darken on hover
                            }}
                            onClick={() => alert('Requests button clicked!')}
                        >
                            <Typography variant="subtitle1">Requests</Typography>
                            <Typography variant="h5">0</Typography>
                        </Button>
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Grid container spacing={2}>
                    {/* Appointments Statistics */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Appointments Statistics
                        </Typography>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    [Chart Placeholder]
                                </Typography>
                            </Box>
                        </Card>

                        {/* Latest Patients */}
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Latest Patient
                        </Typography>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                [Patients Data Placeholder]
                            </Typography>
                        </Card>
                    </Grid>

                    {/* Right Sidebar */}
                    <Grid item xs={12} md={4}>
                        {/* Notifications Card */}
                        <Card sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Notifications
                            </Typography>
                            {notifications.length === 0 ? (
                                <Typography>No new notifications</Typography>
                            ) : (
                                <List>
                                    {notifications.map((notification, index) => (
                                        <ListItem key={index}>
                                            <Typography>{notification.message}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(notification.date).toLocaleString()}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            {notifications.length > 0 && (
                                <Button variant="contained" color="error" onClick={handleClearNotifications}>
                                    Clear Notifications
                                </Button>
                            )}
                        </Card>

                        <Card sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>October 2024</Typography>
                            <Typography variant="body2" color="textSecondary">[Calendar Placeholder]</Typography>
                        </Card>

                        <Card sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Upcoming Appointments</Typography>
                            <List>
                                {['Mike Robin', 'Jane Black'].map((name, index) => (
                                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                                <EventAvailableIcon />
                                            </Avatar>
                                            <Typography>{name}</Typography>
                                        </Box>
                                        <Typography variant="caption" color="textSecondary">
                                            {index === 0 ? 'Consultation' : 'Wisdom Teeth Removal'}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>

                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tomorrow's Appointment</Typography>
                            <List>
                                {['Baba Kaothat', 'Damilarie Usman', 'Nneka Chukwu', 'Desmond Tutu'].map((name, index) => (
                                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Typography>{name}</Typography>
                                        </Box>
                                        <Button size="small" variant="outlined">Contact</Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
