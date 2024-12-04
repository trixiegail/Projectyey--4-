import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import './dashboard.css';
import { format, getYear, getMonth, startOfWeek, endOfWeek, isWithinInterval  } from 'date-fns';

const Dashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [declinedAppointments, setDeclinedAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [appointmentsTomorrow, setAppointmentsTomorrow] = useState([]);
  const [applicantsCount, setApplicantsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState('year'); // Default view is 'year'

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

  useEffect(() => {
    // Fetch counts
    fetch('https://dentalmanagement.azurewebsites.net/api/reservations/reservations')
      .then((response) => response.json())
      .then((data) => setApplicantsCount(data.length))
      .catch((error) => console.error('Error fetching applicants:', error));

    fetch('hhttps://dentalmanagement.azurewebsites.net/api/patients/')
      .then((response) => response.json())
      .then((data) => {
        setPatientsCount(data.length);

        // Filter today's and tomorrow's appointments
        const today = format(new Date(), 'yyyy-MM-dd');
        const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

        const todayAppointments = data.filter((patient) => {
          const appointmentDate = patient.date; // Replace with the correct field name from the backend
          return appointmentDate && format(new Date(appointmentDate), 'yyyy-MM-dd') === today;
        });

        const tomorrowAppointments = data.filter((patient) => {
          const appointmentDate = patient.date; // Replace with the correct field name from the backend
          return appointmentDate && format(new Date(appointmentDate), 'yyyy-MM-dd') === tomorrow;
        });

        setAppointmentsToday(todayAppointments);
        setAppointmentsTomorrow(tomorrowAppointments);
      })
      .catch((error) => console.error('Error fetching patients:', error));

    fetch('https://dentalmanagement.azurewebsites.net/api/completed-appointments')
      .then((response) => response.json())
      .then((data) => setCompletedCount(data.length))
      .catch((error) => console.error('Error fetching completed appointments:', error));

    fetch('https://dentalmanagement.azurewebsites.net/api/declined-appointments')
      .then((response) => response.json())
      .then((data) => setDeclinedCount(data.length))
      .catch((error) => console.error('Error fetching declined appointments:', error));
  }, []);
  
  useEffect(() => {
    // Fetch completed appointments
    fetch('https://dentalmanagement.azurewebsites.net/api/completed-appointments')
      .then((response) => response.json())
      .then((data) => {
        setCompletedAppointments(data);
        updateChartData('year', data); // Set default chart data
      })
      .catch((error) => console.error('Error fetching completed appointments:', error));
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
    { name: 'Patients', count: totalPatients },
    { name: 'Completed', count: totalCompleted },
    { name: 'Declined', count: totalDeclined },
  ];

  const groupByProgram = (data) => {
    return data.reduce((acc, item) => {
      acc[item.program] = (acc[item.program] || 0) + 1;
      return acc;
    }, {});
  };

  const formatChartData = (groupedData) => {
    return Object.keys(groupedData).map((key) => ({
      name: key,
      value: groupedData[key],
    }));
  };

  const updateChartData = (type, data) => {
    if (type === 'year') {
      setChartData(generateYearlyData(data));
    } else if (type === 'month') {
      setChartData(generateMonthlyData(data));
    } else if (type === 'week') {
      setChartData(generateWeeklyData(data));
    }
  };

  const generateYearlyData = (data) => {
    const currentYear = getYear(new Date());
    const months = Array.from({ length: 12 }, (_, i) => i); // 0 to 11 for months
    return months.map((month) => ({
      name: format(new Date(currentYear, month), 'MMM'), // Format month as "Jan", "Feb", etc.
      count: data.filter(
        (appointment) =>
          getYear(new Date(appointment.completedDate)) === currentYear &&
          getMonth(new Date(appointment.completedDate)) === month
      ).length,
    }));
  };

  const generateMonthlyData = (data) => {
    const currentYear = getYear(new Date());
    const currentMonth = getMonth(new Date());
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Days in current month
    return Array.from({ length: daysInMonth }, (_, i) => ({
      name: i + 1, // Day of the month
      count: data.filter(
        (appointment) =>
          getYear(new Date(appointment.completedDate)) === currentYear &&
          getMonth(new Date(appointment.completedDate)) === currentMonth &&
          new Date(appointment.completedDate).getDate() === i + 1
      ).length,
    }));
  };

  const generateWeeklyData = (data) => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Week starts on Monday
    const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentWeekStart);
      day.setDate(day.getDate() + i); // Add days to start of the week
      return {
        name: format(day, 'EEE'), // Format day as "Mon", "Tue", etc.
        count: data.filter((appointment) =>
          isWithinInterval(new Date(appointment.completedDate), {
            start: startOfWeek(new Date(), { weekStartsOn: 1 }),
            end: endOfWeek(new Date(), { weekStartsOn: 1 }),
          })
        ).length,
      };
    });
  };

  const handleViewChange = (event) => {
    const selectedView = event.target.value;
    setView(selectedView);
    updateChartData(selectedView, completedAppointments);
  };

  const applicantsByProgram = formatChartData(groupByProgram(applicants));
  const patientsByProgram = formatChartData(groupByProgram(patients));
  const completedByProgram = formatChartData(groupByProgram(completedAppointments));
  const declinedByProgram = formatChartData(groupByProgram(declinedAppointments));


  return (
    <Box className="dashboard-container"sx={{ display: 'flex', minHeight: '100vh', backgroundColor:'white' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <DocNavBar />

        {/* Dashboard Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Dashboard
        </Typography>

        {/* Horizontal Row with Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Applicants</Typography>
                <Typography variant="h4" color="primary">
                  {applicantsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Patients</Typography>
                <Typography variant="h4" color="secondary">
                  {patientsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="h4" color="success">
                  {completedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Declined</Typography>
                <Typography variant="h4" color="error">
                  {declinedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Vertical Stack for Appointments Today and Tomorrow */}
          <Grid item xs={12} sm={6} md={2.4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Appointments
          </Typography>
            <Grid container spacing={3} direction="column">
              {/* Appointments Today */}
              <Grid item>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Today</Typography>
                    <Typography variant="h4" color="info.main">
                      {appointmentsToday.length}
                    </Typography>
                    <List>
                      {appointmentsToday.map((appointment) => (
                        <ListItem key={appointment.id} sx={{ pl: 0 }}>
                          <ListItemText
                            primary={appointment.fullName}
                            secondary={`Time: ${appointment.time}`} // Replace `time` with correct field if needed
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Appointments Tomorrow */}
              <Grid item>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Tomorrow</Typography>
                    <Typography variant="h4" color="warning.main">
                      {appointmentsTomorrow.length}
                    </Typography>
                    <List>
                      {appointmentsTomorrow.map((appointment) => (
                        <ListItem key={appointment.id} sx={{ pl: 0 }}>
                          <ListItemText
                            primary={appointment.fullName}
                            secondary={`Time: ${appointment.time}`} // Replace `time` with correct field if needed
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>


        <Grid container spacing={3} mt={-25}>
  {/* Left Column - Completed Patients Statistics */}
  <Grid item xs={12} md={6}>
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Completed Patients Statistics
      </Typography>

      {/* Dropdown to switch views */}
      <FormControl variant="outlined" sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel>View By</InputLabel>
        <Select value={view} onChange={handleViewChange} label="View By">
          <MenuItem value="year">Year</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
        </Select>
      </FormControl>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  </Grid>

  {/* Right Column - Category Comparison */}
  <Grid item xs={12} md={3.5}>
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Category Comparison
      </Typography>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </Grid>
</Grid>


       {/* New Section: Program-Based Statistics */}
<Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 5 }}>
  {/* Adjusting the alignment of the grid */}
  <Grid container spacing={3} sx={{ maxWidth: '80%' }}>
    <Grid item xs={12} md={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Applicants
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={applicantsByProgram}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {applicantsByProgram.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Patients
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={patientsByProgram}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {patientsByProgram.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Completed
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={completedByProgram}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {completedByProgram.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Declined
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={declinedByProgram}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {declinedByProgram.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>


      </Box>
    </Box>
  );
};

export default Dashboard;
