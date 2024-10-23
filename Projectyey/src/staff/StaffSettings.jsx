import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Switch, FormControlLabel } from '@mui/material';
import Sidebar from '../components/StaffSidebar';
import StaffNavBar from '../components/StaffNavBar';
import axios from 'axios'; // Import axios for HTTP requests
import { useAuth } from '../contexts/AuthContext'; // Access logged-in staff info

function Settings() {
  const { staff } = useAuth(); // Get logged-in staff from context
  const [loading, setLoading] = useState(true); // Track loading state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });
  const [darkMode, setDarkMode] = useState(false);

  // Fetch staff data from backend
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (staff && staff.id) {
          const response = await axios.get(`http://localhost:8080/user/profile/${staff.id}`);
          const staffData = response.data;

          // Populate form with fetched data
          setFormData({
            username: staffData.username,
            email: staffData.email,
            password: '', // Do not pre-fill password for security
          });
          setNotifications({
            emailNotifications: staffData.emailNotifications,
            smsNotifications: staffData.smsNotifications,
          });
          setDarkMode(staffData.darkMode);
        }
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchStaffData();
  }, [staff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        emailNotifications: notifications.emailNotifications,
        smsNotifications: notifications.smsNotifications,
        darkMode,
      };

      await axios.put(`http://localhost:8080/user/profile/${staff.id}`, updatedData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

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
            Settings
          </Typography>
          <StaffNavBar />
        </Box>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Account Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Enter a new password"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
              Notification Preferences
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.smsNotifications}
                  onChange={handleNotificationChange}
                  name="smsNotifications"
                  color="primary"
                />
              }
              label="SMS Notifications"
            />

            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
              Appearance
            </Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={handleDarkModeToggle} color="primary" />}
              label="Dark Mode"
            />

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Settings;
