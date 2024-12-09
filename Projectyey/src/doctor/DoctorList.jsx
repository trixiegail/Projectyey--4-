import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Avatar,
  Divider,
  InputBase,
  IconButton,
} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import { Email, Badge, Cake } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import DocNavBar from '../components/DocNavBar';
import '../doctor/dashboard.css';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('https://dentalmanagement.azurewebsites.net/doctor/getDoctors?archived=false');
      if (response.status === 200) {
        setDoctors(response.data);
        setFilteredDoctors(response.data); 
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

  useEffect(() => {
    // Filter doctors based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = doctors.filter((doctor) =>
      (doctor.firstname?.toLowerCase() || '').includes(lowercasedQuery) ||
      (doctor.lastname?.toLowerCase() || '').includes(lowercasedQuery) ||
      (doctor.idNumber?.toLowerCase() || '').includes(lowercasedQuery) ||
      (doctor.email?.toLowerCase() || '').includes(lowercasedQuery)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const handleCardClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };
  

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
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
            Doctors
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: 2,
                padding: '0 0.5rem',
                width: 500,
                marginRight: -20,
            }}
          >
            <SearchIcon sx={{ color: '#ccc', marginRight: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Box>
          <IconButton>
            </IconButton>
          <DocNavBar />
          </Box>
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
            {filteredDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <Card
                onClick={() => handleCardClick(doctor.email)} 
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#90343c', marginRight: 2 }}>
                        {doctor.firstname.charAt(0)}
                        {doctor.lastname.charAt(0)}
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
