import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import './dashboard.css';

const Dashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [declinedAppointments, setDeclinedAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch Applicants
    fetch('https://dentalmanagement.azurewebsites.net/api/reservations/reservations')
      .then((response) => response.json())
      .then((data) => setApplicants(data))
      .catch((error) => console.error('Error fetching applicants:', error));

    // Fetch Completed Appointments
    fetch('https://dentalmanagement.azurewebsites.net/api/completed-appointments')
      .then((response) => response.json())
      .then((data) => setCompletedAppointments(data))
      .catch((error) => console.error('Error fetching completed appointments:', error));

    // Fetch Declined Appointments
    fetch('https://dentalmanagement.azurewebsites.net/api/declined-appointments')
      .then((response) => response.json())
      .then((data) => setDeclinedAppointments(data))
      .catch((error) => console.error('Error fetching declined appointments:', error));

    // Fetch Patients
    fetch('https://dentalmanagement.azurewebsites.net/api/patients/')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  // Summary Metrics
  const totalApplicants = applicants.length;
  const totalCompleted = completedAppointments.length;
  const totalDeclined = declinedAppointments.length;
  const totalPatients = patients.length;

  // Pie Chart Data (Department Distribution)
  const departmentCounts = applicants.reduce((acc, applicant) => {
    acc[applicant.department] = (acc[applicant.department] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(departmentCounts).map((key) => ({
    name: key,
    value: departmentCounts[key],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

  // Bar Chart Data (Category Comparison)
  const barChartData = [
    { name: 'Applicants', count: totalApplicants },
    { name: 'Completed', count: totalCompleted },
    { name: 'Declined', count: totalDeclined },
    { name: 'Patients', count: totalPatients },
  ];

  return (
    <Box className="dashboard-container"sx={{ display: 'flex', minHeight: '100vh', backgroundColor:'white' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <DocNavBar />

        {/* Dashboard Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Applicants</Typography>
                <Typography variant="h4" color="primary">{totalApplicants}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Patients</Typography>
                <Typography variant="h4" color="secondary">{totalPatients}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="h4" color="success">{totalCompleted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Declined</Typography>
                <Typography variant="h4" color="error">{totalDeclined}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Applicants by Department
            </Typography>
            <Card>
            <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </CardContent>
           </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Category Comparison
            </Typography>
            <Card>
            <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            </CardContent>
           </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
