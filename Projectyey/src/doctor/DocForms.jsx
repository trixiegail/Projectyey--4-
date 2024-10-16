import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Tabs, Tab, IconButton, Avatar } from '@mui/material';
import Sidebar from '../components/DocSidebar';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DocNavBar from '../components/DocNavBar';

function DocForms() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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
            Forms
          </Typography>
          <DocNavBar />
        </Box>
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Dental Chart" />
          <Tab label="Intraoral Form" />
        </Tabs>
      </Paper>
      {selectedTab === 0 && <DentalChartForm />}
      {selectedTab === 1 && <IntraoralForm />}
    </Box>
    </Box>
        
  );
}

function DentalChartForm() {
  const [formData, setFormData] = useState({
    toothCondition: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Dental Chart Form Data:', formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Dental Chart
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tooth Condition"
              name="toothCondition"
              value={formData.toothCondition}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

function IntraoralForm() {
  const [formData, setFormData] = useState({
    gumHealth: '',
    oralHygiene: '',
    observations: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Intraoral Form Data:', formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Intraoral Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gum Health"
              name="gumHealth"
              value={formData.gumHealth}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Oral Hygiene"
              name="oralHygiene"
              value={formData.oralHygiene}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default DocForms;
