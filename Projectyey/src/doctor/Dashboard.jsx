import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import axios from 'axios';
import './dashboard.css';
import { format, getYear, getMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval  } from 'date-fns';
import PersonIcon from '@mui/icons-material/Person'; // For Applicants
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // For Doctors
import PeopleIcon from '@mui/icons-material/People'; // For Patients
import DoneIcon from '@mui/icons-material/Done'; // For Completed
import BlockIcon from '@mui/icons-material/Block'; // For Declined

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
  const [doctorCount, setDoctorCount] = useState(0);

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

    fetch('https://dentalmanagement.azurewebsites.net/api/patients/')
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


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://dentalmanagement.azurewebsites.net/doctor/getDoctors?archived=false');
        if (response.status === 200) {
          setDoctorCount(response.data.length); // Update count based on doctors array length
        } else {
          throw new Error('Failed to fetch doctor accounts');
        }
      } catch (error) {
        console.error('Error fetching doctor accounts:', error);
      }
    };

    fetchDoctors();
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

  const [patientsView, setPatientsView] = useState("Today"); 
  const [filteredAppointments, setFilteredAppointments] = useState([]); 
  
  // Initialize Patients Section with Today's Appointments
useEffect(() => {
  if (patients.length > 0) {
    const today = new Date();
    setFilteredAppointments(filterAppointmentsByDate(today)); 
  }
}, [patients]); 


  // Helper Functions
  const filterAppointmentsByDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return patients.filter((patient) => patient.date === formattedDate); // Replace 'date' with your backend field
  };

  const filterAppointmentsByWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return patients.filter((patient) =>
      isWithinInterval(new Date(patient.date), { start, end })
    );
  };

  const filterAppointmentsByMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return patients.filter((patient) =>
      isWithinInterval(new Date(patient.date), { start, end })
    );
  };

  const generateDistinctMaroonShades = (numShades) => {
    const baseHue = 350; 
    const baseSaturation = 65; 
    const baseLightness = 29;
    const hueStep = 10; 
    const lightnessStep = 5; 
    const saturationStep = 4; 
  
    const shades = [];
  
    for (let i = 0; i < numShades; i++) {
      const hue = (baseHue + i * hueStep) % 360; 
      const saturation = Math.max(baseSaturation - i * saturationStep, 20); 
      const lightness = Math.min(baseLightness + i * lightnessStep, 80); 
  
      shades.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
  
    return shades;
  };
  
  const DISTINCT_MAROON_SHADES = generateDistinctMaroonShades(30); 
  
  

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor:'#fafafa' }}>
       <Sidebar /> 
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#90343c' }} 
          >
            Dashboard
          </Typography>
          <DocNavBar />
        </Box>

        <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={9}>
          {/* Top Row: Summary Cards */}
          <Grid container spacing={2}>
           {/* Doctors Card */}
          <Grid item xs={2} sm={2.4}>
            <Card sx={{ borderBottom: '4px solid #f57c00' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocalHospitalIcon sx={{ fontSize: 40, color: '#f57c00' }} />
                </Box>
                <Box>
                  <Typography variant="h6">Doctors</Typography>
                  <Typography variant="h4" sx={{ color: '#f57c00' }}>
                    {doctorCount} {/* Dynamic count */}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Applicants */}
          <Grid item xs={2} sm={2.4}>
            <Card sx={{ borderBottom: '4px solid #1976d2' }}> {/* Add bottom border */}
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PersonIcon sx={{ fontSize: 40, color: '#1976d2' }} /> {/* Icon color matches border */}
                </Box>
                <Box>
                  <Typography variant="h6">
                    Applicants
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1976d2' }}>
                    {applicantsCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Patients */}
          <Grid item xs={2} sm={2.4}>
            <Card sx={{ borderBottom: '4px solid #90242c' }}> {/* Add bottom border */}
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#90242c' }} /> {/* Icon color matches border */}
                </Box>
                <Box>
                  <Typography variant="h6">
                    Patients
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#90242c' }}>
                    {patientsCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed */}
          <Grid item xs={2} sm={2.4}>
            <Card sx={{ borderBottom: '4px solid #388e3c' }}> {/* Add bottom border */}
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DoneIcon sx={{ fontSize: 40, color: '#388e3c' }} /> {/* Icon color matches border */}
                </Box>
                <Box>
                  <Typography variant="h6">
                    Completed
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#388e3c' }}>
                    {completedCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Declined */}
          <Grid item xs={2} sm={2.4}>
            <Card sx={{ borderBottom: '4px solid #d32f2f' }}> {/* Add bottom border */}
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BlockIcon sx={{ fontSize: 40, color: '#d32f2f' }} /> {/* Icon color matches border */}
                </Box>
                <Box>
                  <Typography variant="h6">
                    Declined
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#d32f2f' }}>
                    {declinedCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          </Grid>

          {/* Bottom Row: Completed Patients Statistics and Category Comparison */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={8}>
  <Card sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Completed Patients Statistics
    </Typography>
    <FormControl variant="outlined" sx={{ minWidth: 200, mb: 3 }}>
      <InputLabel>View By</InputLabel>
      <Select value={view} onChange={handleViewChange} label="View By">
        <MenuItem value="year">Year</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="week">Week</MenuItem>
      </Select>
    </FormControl>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* Change the stroke color to #90242c */}
        <Line type="monotone" dataKey="count" stroke="#90242c" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
</Grid>


            <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Category Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {/* Change the fill color to #88343b */}
                  <Bar dataKey="count" fill="#90242c" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>


        {/* Pie Charts */}
<Grid container spacing={3} sx={{ mt: 1, ml: 0.5 }}>
  <Grid item xs={10} md={3}>
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
                <Cell
                  key={`cell-${index}`}
                  fill={DISTINCT_MAROON_SHADES[index % DISTINCT_MAROON_SHADES.length]}
                />
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
                <Cell
                  key={`cell-${index}`}
                  fill={DISTINCT_MAROON_SHADES[index % DISTINCT_MAROON_SHADES.length]}
                />
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
                <Cell
                  key={`cell-${index}`}
                  fill={DISTINCT_MAROON_SHADES[index % DISTINCT_MAROON_SHADES.length]}
                />
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
                <Cell
                  key={`cell-${index}`}
                  fill={DISTINCT_MAROON_SHADES[index % DISTINCT_MAROON_SHADES.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </Grid>
</Grid>


          </Grid>
        </Grid>

        {/* Right Column */}
<Grid item xs={12} md={3}>
  {/* Patients Section */}
  <Card sx={{ mb: 3, p: 3 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Patients
  </Typography>
    <CardContent>
      <FormControl variant="outlined" sx={{ minWidth: 200, mb: 3 , ml: -2}}>
        <InputLabel>View By</InputLabel>
        <Select
          value={patientsView} // Use patientsView for this section
          onChange={(e) => {
            setPatientsView(e.target.value); // Update section-specific view state
            const selectedView = e.target.value;
            if (selectedView === "Today") {
              setFilteredAppointments(filterAppointmentsByDate(new Date()));
            } else if (selectedView === "Tomorrow") {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              setFilteredAppointments(filterAppointmentsByDate(tomorrow));
            } else if (selectedView === "This Week") {
              setFilteredAppointments(filterAppointmentsByWeek(new Date()));
            } else if (selectedView === "This Month") {
              setFilteredAppointments(filterAppointmentsByMonth(new Date()));
            }
          }}
          label="View By"
        >
          <MenuItem value="Today">Today</MenuItem>
          <MenuItem value="Tomorrow">Tomorrow</MenuItem>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="h4" color="#90242c" sx={{ mb: 2 }}>
        {filteredAppointments.length}
      </Typography>
      <List>
        {filteredAppointments.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemText
              primary={appointment.fullName}
              secondary={`Time: ${appointment.time}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
</Grid>


      </Grid>


       



     

      </Box>
    </Box>
  );
};

export default Dashboard;
