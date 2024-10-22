import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Button, IconButton, Badge, List, ListItem, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF1493', '#6A5ACD'];

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [patientData, setPatientData] = useState({
    totalPatients: 150,
    withCavities: 40,
    withGumDisease: 30,
    withFilledTeeth: 20,
    withMissingTeeth: 10,
    withOrthodonticIssues: 25,
    withPlaqueTartar: 25,
    services: {
      toothExtraction: 50,
      teethCleaning: 50,
      consultation: 50,
    },
    patientsPerYear: [
      { year: 2017, patients: 80 },
      { year: 2018, patients: 90 },
      { year: 2019, patients: 100 },
      { year: 2020, patients: 110 },
      { year: 2021, patients: 120 },
      { year: 2022, patients: 130 },
      { year: 2023, patients: 140 },
    ],
  });

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('doctorNotifications')) || [];
    setNotifications(savedNotifications);
  }, []);

  const patientPieData = [
    { name: 'With Cavities', value: patientData.withCavities },
    { name: 'With Gum Disease', value: patientData.withGumDisease },
    { name: 'With Filled Teeth', value: patientData.withFilledTeeth },
    { name: 'With Missing Teeth', value: patientData.withMissingTeeth },
    { name: 'With Orthodontic Issues', value: patientData.withOrthodonticIssues },
    { name: 'With Plaque & Tartar', value: patientData.withPlaqueTartar },
  ];

  const servicePieData = [
    { name: 'Tooth Extractions', value: patientData.services.toothExtraction },
    { name: 'Teeth Cleaning', value: patientData.services.teethCleaning },
    { name: 'Consultation', value: patientData.services.consultation },
  ];
                    {/* Notification Icon with Badge */}
                    {/*<IconButton color="inherit">*/}
                    {/*    <Badge badgeContent={notifications.length} color="error">*/}
                    {/*        <NotificationsIcon />*/}
                    {/*    </Badge>*/}
                    {/*</IconButton>*/}

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#90343c' }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
              <Typography variant="h5">{patientData.totalPatients}</Typography>
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
              Appointments Statistics (Patients per Year)
            </Typography>
            <Card sx={{ p: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <LineChart
                  width={500}
                  height={300}
                  data={patientData.patientsPerYear}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#8884d8" />
                </LineChart>
              </Box>
            </Card>

            {/* Patients with Dental Conditions */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Patients with Dental Conditions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* Counters for Patients with Dental Conditions */}
                <Grid container spacing={2}>
                  {[
                    { label: 'With Cavities', value: patientData.withCavities },
                    { label: 'With Gum Disease', value: patientData.withGumDisease },
                    { label: 'With Filled Teeth', value: patientData.withFilledTeeth },
                    { label: 'With Missing Teeth', value: patientData.withMissingTeeth },
                    { label: 'With Orthodontic Issues', value: patientData.withOrthodonticIssues },
                    { label: 'With Plaque & Tartar', value: patientData.withPlaqueTartar },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          boxShadow: 2,
                          backgroundColor: '#FFFFFF', // White background
                          transition: 'background-color 0.3s ease', // Smooth transition
                          '&:hover': {
                            backgroundColor: 'rgb(139, 35, 42)', // Change color to maroon on hover
                            color: '#FFFFFF', // Change text color to white
                          },
                        }}
                      >
                        <Typography>{item.label}</Typography>
                        <Typography variant="h5">{item.value}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                {/* Pie Chart for Patients with Dental Conditions */}
                <Card sx={{ p: 3, mb: 3 }}>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={patientPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {patientPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </Card>
              </Grid>
            </Grid>

            {/* Services Provided */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Services Provided</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* Counters for Services */}
                <Grid container spacing={2}>
                  {[
                    { label: 'Tooth Extractions', value: patientData.services.toothExtraction },
                    { label: 'Teeth Cleaning', value: patientData.services.teethCleaning },
                    { label: 'Consultation', value: patientData.services.consultation },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          boxShadow: 2,
                          backgroundColor: '#FFFFFF', // White background
                          transition: 'background-color 0.3s ease', // Smooth transition
                          '&:hover': {
                            backgroundColor: 'rgb(139, 35, 42)', // Change color to maroon on hover
                            color: '#FFFFFF', // Change text color to white
                          },
                        }}
                      >
                        <Typography>{item.label}</Typography>
                        <Typography variant="h5">{item.value}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                {/* Pie Chart for Services Provided */}
                <Card sx={{ p: 3, mb: 3 }}>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={servicePieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {servicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Notifications Card */}
            <Card sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
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

            {/* Calendar Section */}
            <Card sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>October 2021</Typography>
              <Typography variant="body2" color="textSecondary">[Calendar Placeholder]</Typography>
            </Card>

            {/* Upcoming Appointments */}
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

            {/* Tomorrow's Appointment */}
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
