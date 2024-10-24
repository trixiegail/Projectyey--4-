import React, { useEffect, useState } from "react";
import Nav from '../components/NavNurseDentist';
import { Box, Grid, Card, Typography, Button, TextField, IconButton, List, ListItem, Avatar } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF1493', '#6A5ACD'];

const NurseDashboard = () => {
  const [patientData, setPatientData] = useState({
    totalPatients: 150,
    withNoMedicalCondition: 60,
    withHighBloodPressure: 20,
    withAllergies: 25,
    withHeartRateIssues: 10,
    withRespiratoryRateIssues: 15,
    withAbnormalBodyTemperature: 20,
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
    const totalConditionCount =
      patientData.withNoMedicalCondition +
      patientData.withHighBloodPressure +
      patientData.withAllergies +
      patientData.withHeartRateIssues +
      patientData.withRespiratoryRateIssues +
      patientData.withAbnormalBodyTemperature;

    if (totalConditionCount !== patientData.totalPatients) {
      console.warn("Mismatch between total patients and patient categories!");
    }
  }, [patientData]);

  const pieData = [
    { name: 'No Medical Condition', value: patientData.withNoMedicalCondition },
    { name: 'High Blood Pressure', value: patientData.withHighBloodPressure },
    { name: 'Allergies', value: patientData.withAllergies },
    { name: 'Heart Rate Issues', value: patientData.withHeartRateIssues },
    { name: 'Respiratory Rate Issues', value: patientData.withRespiratoryRateIssues },
    { name: 'Abnormal Body Temperature', value: patientData.withAbnormalBodyTemperature },
  ];

  return (
    <>
      <Nav />
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
            {/* Appointments Statistics with Linear Chart */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Appointments Statistics (Patients per Year)</Typography>
              <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData.patientsPerYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="patients" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              {/* Patient Categories with Pie Chart and Counters */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Patients with Medical Conditions</Typography>
              <Card sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    {/* Patient Counters */}
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>No Medical Condition</Typography>
                        <Typography variant="h5">{patientData.withNoMedicalCondition}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>High Blood Pressure</Typography>
                        <Typography variant="h5">{patientData.withHighBloodPressure}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>Allergies</Typography>
                        <Typography variant="h5">{patientData.withAllergies}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>Heart Rate Issues</Typography>
                        <Typography variant="h5">{patientData.withHeartRateIssues}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>Respiratory Rate Issues</Typography>
                        <Typography variant="h5">{patientData.withRespiratoryRateIssues}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'black' }}>Abnormal Body Temperature</Typography>
                        <Typography variant="h5">{patientData.withAbnormalBodyTemperature}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    {/* Responsive Pie Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right Sidebar */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Button variant="contained" sx={{ flex: 1, backgroundColor: '#1976d2' }}>Make an Appointment</Button>
                  <Button variant="outlined" sx={{ flex: 1 }}>Add Patient</Button>
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
