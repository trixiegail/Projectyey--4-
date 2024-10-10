import React from "react";
import Nav from '../components/NavNurseDentist';
import { Link, useLocation } from 'react-router-dom';
import { Box, Grid, Card, Typography, Button, TextField, IconButton, List, ListItem, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const NurseDashboard = () => {
  const location = useLocation();
  return (
    <><Nav />    
        <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              sx={{ mr: 2 }}
            />
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar src="src/image/doctor-profile.png" alt="Profile" sx={{ width: 40, height: 40, mr: 1 }} />
              <Box>
                <Typography variant="body1">Dr. Maria Luz M. Lumayno</Typography>
                <Typography variant="body2" color="textSecondary">Practical Dentist</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Statistic Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {['Patients Today', 'Total Patients', 'For Recall', 'Requests'].map((title, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ p: 2, backgroundColor: '#8B232A', color: '#FFFFFF', textAlign: 'center' }}>
                <Typography variant="subtitle1">{title}</Typography>
                <Typography variant="h5">0</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={2}>
          {/* Appointments Statistics */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Appointments Statistics</Typography>
            <Card sx={{ p: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" color="textSecondary">[Chart Placeholder]</Typography>
              </Box>
            </Card>

            {/* Latest Patients */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Latest Patient</Typography>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2" color="textSecondary">[Patients Data Placeholder]</Typography>
            </Card>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{ flex: 1, backgroundColor: '#1976d2' }}
                >
                  Make an Appointment
                </Button>
                <Button
                  variant="outlined"
                  sx={{ flex: 1 }}
                >
                  Add Patient
                </Button>
              </Box>
            </Card>


            <Card sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>October 2021</Typography>
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
                    <Typography variant="caption" color="textSecondary">{index === 0 ? 'Consultation' : 'Wisdom Teeth Removal'}</Typography>
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
    </>

  );
};

export default NurseDashboard;
