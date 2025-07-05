import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Button, Collapse, Card, CardContent, CardActions, TextField, Typography, Drawer, DialogContentText, 
  Tabs, Tab, List, ListItem, ListItemText, Grid, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';


const MedicalForm = () => {
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const applicant = location.state?.applicant || {};
  const [intraoralRecordsFetched, setIntraoralRecordsFetched] = useState(false);
  const [expandedDates, setExpandedDates] = useState({});
  const navigate = useNavigate();

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

  const resetForm = () => {
    setFormValues({
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
  };

  const [medicalRecords, setMedicalRecords] = useState([]); 
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [formChanged, setFormChanged] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false); 
  const [activeTab, setActiveTab] = useState('checkup'); 
  const [showIncompleteFieldsDialog, setShowIncompleteFieldsDialog] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // State for confirmation modal
  const [intraoralRecords, setIntraoralRecords] = useState([]); 

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`https://dentalmanagement-app.onrender.com/student/students/${applicant.studentIdNumber}`);
  
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
        const response = await fetch(`https://dentalmanagement-app.onrender.com/api/checkups/save?idNumber=${applicant.studentIdNumber}`, {
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
        resetForm();
        console.log('Checkup saved successfully');
      } catch (error) {
        console.error('Error saving checkup:', error);
      }
    }
  };

  // Toggle the medical records drawer
  const handleMedicalRecords = async () => {
    try {
      const response = await fetch(`https://dentalmanagement-app.onrender.com/api/checkups/student/${applicant.studentIdNumber}`);
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

  const toggleDateExpansion = (date) => {
    setExpandedDates(prevState => ({
      ...prevState,
      [date]: !prevState[date] 
    }));
  };

  const handleAllToothStatuses = async () => {

    try {
        console.log('Fetching all tooth statuses for:', applicant.studentIdNumber);
        const response = await fetch(`https://dentalmanagement-app.onrender.com/student/${applicant.studentIdNumber}/tooth-statuses`);
  
        if (response.ok) {
            const records = await response.json();
            const sortedRecords = records.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
            setIntraoralRecords(sortedRecords);
            setShowMedicalRecords(true);
        } else {
            console.error('Failed to fetch all tooth statuses', response.status, response.statusText);
            alert(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching all tooth statuses:', error);
        alert(`Error fetching data: ${error.message}`);
    }
  };

  const handleNavigateToDentalRecord = () => {
    navigate('/dental-record-drawer', {
      state: {
        studentData: formData, // Pass the student data as state
        medicalRecords,        // Pass medical records
        intraoralRecords,      // Pass intraoral records if needed
      },
    });
  };
  
  
  // Fetch Intraoral Examination data when the drawer opens
  useEffect(() => {
    if (showMedicalRecords) {
      handleAllToothStatuses(); // Fetch intraoral records when the drawer opens
    }
  }, [showMedicalRecords]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor:'white' }}>
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
          <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#90343c' }} 
          >
            Checkup and Records
          </Typography>
          </Box>
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
            Dental Records
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
  <Box
    sx={{
      width: 400,
      padding: 2,
      display: "flex",
      flexDirection: "column",
      height: "100vh", 
      boxSizing: "border-box", 
    }}
  >
    {/* Header */}
    <Typography variant="h6" gutterBottom align="center">
      Dental Records
    </Typography>
    <Tabs
      value={activeTab}
      onChange={(event, newValue) => {
        setActiveTab(newValue);
        if (newValue === "intraoral") {
          handleAllToothStatuses(); 
          setSelectedRecord(null);
        }
      }}
      aria-label="medical records tabs"
    >
      <Tab label="Checkup" value="checkup" />
      <Tab label="Intraoral Examination" value="intraoral" />
    </Tabs>

    {/* Content Container */}
    <Box
      sx={{
        flexGrow: 1, 
        overflowY: "auto", 
        marginBottom: "70px", 
      }}
    >
      {/* Checkup Tab */}
      {activeTab === "checkup" && (
        <List>
          {medicalRecords.map((record, index) => (
            <ListItem key={index} button onClick={() => setSelectedRecord(record)}>
              <ListItemText
                primary={`${new Date(record.date).toDateString()} - ${new Date(record.date).toLocaleTimeString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Intraoral Examination Tab */}
      {activeTab === "intraoral" && (
  <List>
    {intraoralRecords && intraoralRecords.length > 0 ? (
      Object.keys(
        intraoralRecords.reduce((acc, record) => {
          const date = new Date(record.savedAt).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(record);
          return acc;
        }, {})
      ).map((date, index) => (
        <div key={index}>
          <ListItem button onClick={() => toggleDateExpansion(date)}>
            <ListItemText primary={`${date}`} />
          </ListItem>
          <Collapse in={expandedDates[date]} timeout="auto" unmountOnExit>
            {intraoralRecords
              .filter((record) => new Date(record.savedAt).toLocaleDateString() === date)
              .map((record, i) => (
                <Card key={i} sx={{ marginBottom: 2, marginLeft: 3 }}>
                  <CardContent>
                    <Typography variant="body1">
                      Tooth Number: <strong>{record.toothNumber}</strong>
                    </Typography>
                    <Typography variant="body1">Status: {record.status}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Saved At: {new Date(record.savedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Collapse>
        </div>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
        No Intraoral Examination records available.
      </Typography>
    )}
  </List>
)}

{/* Display selected record details only if in Checkup tab */}
{activeTab === 'checkup' && selectedRecord && (
      <div>
        <Typography variant="h6" gutterBottom>
          Records for {new Date(selectedRecord.date || selectedRecord.savedAt).toDateString()} - {new Date(selectedRecord.date || selectedRecord.savedAt).toLocaleTimeString()}
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

    {/* Print Records Button Fixed at Bottom */}
    <Box
      sx={{
        position: "fixed", 
        bottom: 10, 
      }}
    >
      <Button
        variant="contained"
        onClick={handleNavigateToDentalRecord}
        sx={{
          backgroundColor: "#88343b",
          color: "#FFFFFF",
          width: "260%", 
          "&:hover": {
            backgroundColor: "#F7C301",
          },
        }}
      >
        View Records
      </Button>
    </Box>
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
