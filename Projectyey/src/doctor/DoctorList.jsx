import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Grid, Box, Avatar, Divider , TextField , IconButton } from '@mui/material';
import Sidebar from '../components/DocSidebar';
import { Email, Badge, Cake } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DocNavBar from '../components/DocNavBar';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/doctor/getDoctors?archived=false');
      if (response.status === 200) {
        setDoctors(response.data);
      } else {
        throw new Error('Failed to fetch doctor accounts');
      }
    } catch (error) {
      console.error('Error fetching doctor accounts:', error);
      setError('Failed to load doctor accounts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
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
            Doctors
          </Typography>
          <DocNavBar />
        </Box>


        {loading ? (
          <Box display="flex" justifyContent="left" alignItems="left" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" align="left">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="left">
            {doctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <Card
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#90343c', marginRight: 2 }}>
                        {doctor.firstname.charAt(0)}{doctor.lastname.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Dr. {doctor.firstname} {doctor.lastname}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ marginY: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Badge sx={{ marginRight: 1, color: '#90343c' }} />
                      <Typography variant="body2" color="textSecondary">
                        ID Number: {doctor.idNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Cake sx={{ marginRight: 1, color: '#90343c' }} />
                      <Typography variant="body2" color="textSecondary">
                        Birthdate: {doctor.birthdate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ marginRight: 1, color: '#90343c' }} />
                      <Typography variant="body2" color="textSecondary">
                        Email: {doctor.email}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default DoctorList;
