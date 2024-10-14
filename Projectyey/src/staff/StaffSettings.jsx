import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Switch, FormControlLabel } from '@mui/material';
import Sidebar from '../components/DocSidebar';

function Settings() {
  const [formData, setFormData] = useState({
    username: 'Dr. Maria Luz M. Lumayno',
    email: 'maria.lumayno@gmail.com',
    password: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Settings Form Data:', formData);
    console.log('Notification Preferences:', notifications);
    console.log('Dark Mode:', darkMode);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#90343c' }}>
          Settings
        </Typography>
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
