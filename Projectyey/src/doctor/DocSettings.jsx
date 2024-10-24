import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Switch, FormControlLabel, Avatar } from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import axios from 'axios'; // Import axios for HTTP requests
import { useAuth } from '../contexts/AuthContext'; // Access logged-in doctor info

function Settings() {
  const { doctor } = useAuth(); // Get logged-in doctor from context
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
  const [profilePicture, setProfilePicture] = useState(null); // New state for profile picture
  const [preview, setPreview] = useState(''); // Preview image URL

  // Fetch doctor data from backend
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (doctor && doctor.id) {
          const response = await axios.get(`http://localhost:8080/doctor/getProfilePicture/${doctor.id}`);
          const doctorData = response.data;

          // Populate form with fetched data
          setFormData({
            username: doctorData.username,
            email: doctorData.email,
            password: '', // Do not pre-fill password for security
          });
          setNotifications({
            emailNotifications: doctorData.emailNotifications,
            smsNotifications: doctorData.smsNotifications,
          });
          setDarkMode(doctorData.darkMode);
          setPreview(doctorData.profilePicture); // Set preview if picture exists
        }
      } catch (error) {
        console.error('Failed to fetch doctor data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDoctorData();
  }, [doctor]);

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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file)); // Show image preview immediately
    }
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

      await axios.post(`http://localhost:8080/doctor/uploadProfilePicture/${doctor.id}`, updatedData);

      if (profilePicture) {
        // Handle profile picture upload
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        await axios.post(`http://localhost:8080/doctor/uploadProfilePicture/${doctor.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

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
            <DocNavBar />
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
                <Grid item xs={12}>
                  <input
                      accept="image/*"
                      type="file"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                      id="profile-picture-input"
                  />
                  <label htmlFor="profile-picture-input">
                    <Button variant="contained" component="span">
                      Upload Profile Picture
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  {preview && (
                      <Avatar src={preview} alt="Profile Picture" sx={{ width: 100, height: 100 }} />
                  )}
                </Grid>
              </Grid>

              {/* Other settings like notifications and dark mode */}
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
