import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, Button, Collapse, Card, CardContent, CardActions, TextField, Typography, Drawer, 
  Tabs, Tab, List, ListItem, ListItemText, Grid, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';


const MedicalForm = () => {
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const applicant = location.state?.applicant || {};

  const [formValues, setFormValues] = useState({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oralHealthStatus: '',
    presenceOfCavities: '',
    gumHealth: '',
    generalHealthCondition: '',
    specificHealthConcerns: ''
  });

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    department: '',
    course: '',
    year: '',
    dateOfBirth: '',
    email: ''
  });

  const [medicalRecords, setMedicalRecords] = useState([]); 
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [formChanged, setFormChanged] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false); 
  const [activeTab, setActiveTab] = useState('checkup'); 
  const [showIncompleteFieldsDialog, setShowIncompleteFieldsDialog] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // State for confirmation modal

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/student/students/${applicant.studentIdNumber}`);
  
        if (!response.ok) {
          throw new Error(`Error fetching student data: ${response.statusText}`);
        }
  
        const rawResponse = await response.text();
        console.log('Raw Response from Server:', rawResponse); // Debug the raw response
  
        const studentData = JSON.parse(rawResponse);
        setFormData({
          fullName: `${studentData.firstname} ${studentData.lastname}`,
          idNumber: studentData.idNumber || '',
          department: studentData.department || '',
          course: studentData.program || '',
          year: studentData.yearLevel || '',
          dateOfBirth: studentData.birthdate || '',
          email: studentData.email || ''
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
  
    if (applicant.studentIdNumber) {
      fetchStudentData();
    }
  }, [applicant.studentIdNumber]);
  

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setFormChanged(true);
  };

  const isFormChanged = () => Object.values(formValues).some(value => value !== '');
  const isFormEmpty = () => Object.values(formValues).every(value => value === '');

  // Triggered when Save button is clicked, opens confirmation modal
  const handleSaveButtonClick = () => {
    setOpenConfirmModal(true); // Open confirmation modal
  };

  // Handles the save operation after confirmation
  const handleConfirmSave = async () => {
    setOpenConfirmModal(false); // Close confirmation modal after confirming

    if (!isFormChanged()) {
      setShowIncompleteFieldsDialog(true);
    } else {
      const checkupData = {
        bloodPressure: formValues.bloodPressure,
        heartRate: formValues.heartRate,
        respiratoryRate: formValues.respiratoryRate,
        temperature: formValues.temperature,
        oralHealthStatus: formValues.oralHealthStatus,
        presenceOfCavities: formValues.presenceOfCavities,
        gumHealth: formValues.gumHealth,
        generalHealthCondition: formValues.generalHealthCondition,
        specificHealthConcerns: formValues.specificHealthConcerns,
        date: new Date().toISOString(),
        studentIdNumber: applicant.studentIdNumber 
      };

      try {
        const response = await fetch(`http://localhost:8080/api/checkups/save?idNumber=${applicant.studentIdNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkupData)
        });

        if (!response.ok) {
          throw new Error('Failed to save checkup');
        }

        const newRecord = await response.json();

        setMedicalRecords([...medicalRecords, newRecord]);
        setFormChanged(false);
        setOpenSuccessModal(true); 
        console.log('Checkup saved successfully');
      } catch (error) {
        console.error('Error saving checkup:', error);
      }
    }
  };

  // Toggle the medical records drawer
  const handleMedicalRecords = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/checkups/student/${applicant.studentIdNumber}`);
      if (response.ok) {
        const records = await response.json(); // Parse the JSON response
        // Sort the records by date (newest first)
        const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMedicalRecords(sortedRecords); // Set the sorted records
        setShowMedicalRecords(true); // Open the drawer
      } else {
        console.error('Failed to fetch medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  // Handle record click from the Checkup tab
  const handleRecordClick = (record) => {
    setSelectedRecord(record);
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
            Medical Checkup and Records
          </Typography>
          <DocNavBar />
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} backgroundColor="white" padding={2} borderRadius={1}>
          <TextField label="Full Name" value={formData.fullName} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="ID Number" value={formData.idNumber} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Department" value={formData.department} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Course" value={formData.course} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Year" value={formData.year} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Date of Birth" value={formData.dateOfBirth} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Email" value={formData.email} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
        </Box> 
        <br/>

        {/* Buttons to toggle form and records */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}} onClick={() => setShowForm(!showForm)}>
            Check Student
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}} onClick={handleMedicalRecords}>
            Medical Records
          </Button>
        </Box>

        {/* Collapsible Checkup Form */}
        <Collapse in={showForm} unmountOnExit>
          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="Blood Pressure" name="bloodPressure" value={formValues.bloodPressure} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Heart Rate" name="heartRate" value={formValues.heartRate} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Respiratory Rate" name="respiratoryRate" value={formValues.respiratoryRate} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Temperature" name="temperature" value={formValues.temperature} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Oral Health Status" name="oralHealthStatus" value={formValues.oralHealthStatus} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Presece of Cavities" name="presenceOfCavities" value={formValues.presenceOfCavities} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Gum Health" name="gumHealth" value={formValues.gumHealth} onChange={handleFormChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="General Health Condition" name="generalHealthCondition" value={formValues.generalHealthCondition} onChange={handleFormChange}  fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Specific Health Condition" name="specificHealthConcerns" value={formValues.specificHealthConcerns} onChange={handleFormChange}  fullWidth variant="outlined" />
                </Grid>
                {/* Other form fields */}
              </Grid>
            </CardContent>
            <CardActions>
              <Button variant="contained" sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}} onClick={handleSaveButtonClick} disabled={!isFormChanged() || isFormEmpty()}>
                Save
              </Button>
            </CardActions>
          </Card>
        </Collapse>

         {/* Confirmation Modal */}
         <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to save this medical checkup?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmModal} color="secondary">Cancel</Button>
            <Button onClick={handleConfirmSave} color="primary">Yes, Save</Button>
          </DialogActions>
        </Dialog>

         {/* Success Modal */}
         <Dialog open={openSuccessModal} onClose={handleCloseSuccessModal}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>Checkup Successfully Saved!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessModal} color="primary">OK</Button>
          </DialogActions>
        </Dialog>

        {/* Drawer for Medical Records */}
        <Drawer anchor="right" open={showMedicalRecords} onClose={() => setShowMedicalRecords(false)}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant="h6" gutterBottom align="center">
            Medical Records
          </Typography>
          <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} aria-label="medical records tabs">
            <Tab label="Checkup" value="checkup" />
            {/* <Tab label="Dental Treatment" value="dental" /> */}
          </Tabs>

          {/* Checkup Tab */}
          {activeTab === 'checkup' && (
            <List>
              {medicalRecords.map((record, index) => (
                <ListItem key={index} button onClick={() => handleRecordClick(record)}>
                  <ListItemText primary={`${new Date(record.date).toDateString()} - ${new Date(record.date).toLocaleTimeString()}`} />
                </ListItem>
              ))}
            </List>
          )}
            
            

            {/* Display selected record */}
            {selectedRecord && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Records for {new Date(selectedRecord.date).toDateString()} - {new Date(selectedRecord.date).toLocaleTimeString()}
                </Typography>
                <Card sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="body2">Blood Pressure: {selectedRecord.bloodPressure}</Typography>
                    <Typography variant="body2">Heart Rate: {selectedRecord.heartRate}</Typography>
                    <Typography variant="body2">Respiratory Rate: {selectedRecord.respiratoryRate}</Typography>
                    <Typography variant="body2">Temperature: {selectedRecord.temperature}</Typography>
                    <Typography variant="body2">Oral Health Status: {selectedRecord.oralHealthStatus}</Typography>
                    <Typography variant="body2">Gum Health: {selectedRecord.gumHealth}</Typography>
                    <Typography variant="body2">Cavities: {selectedRecord.presenceOfCavities}</Typography>
                    <Typography variant="body2">General Health Condition: {selectedRecord.generalHealthCondition}</Typography>
                    <Typography variant="body2">Specific Health Condition: {selectedRecord.specificHealthConcerns}</Typography>
                  </CardContent>
                </Card>
              </div>
            )}
          </Box>
        </Drawer>

        {/* Incomplete Fields Dialog */}
        <Dialog open={showIncompleteFieldsDialog} onClose={() => setShowIncompleteFieldsDialog(false)}>
          <DialogTitle>Incomplete Fields</DialogTitle>
          <DialogContent>
            <Typography>Please fill in all fields before saving the form.</Typography>
          </DialogContent>
          <DialogActions>
            <Button sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}} onClick={() => setShowIncompleteFieldsDialog(false)}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MedicalForm;
