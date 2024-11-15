import React, { useEffect, useState, useRef  } from 'react';
import { useLocation , useNavigate  } from 'react-router-dom';
import { 
  Box, Button, Collapse, Card, CardContent, CardActions, TextField, Typography, Drawer, DialogContentText, 
  Tabs, Tab, List, ListItem, ListItemText, Grid, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import '../doctor/style.css';
import '../doctor/teethchart.css';
import '../doctor/style.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


const PatientForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [showIntraoralExam, setShowIntraoralExam] = useState(false);
  const location = useLocation();
  const applicant = location.state?.applicant || {};
  const navigate = useNavigate();
  const [lastToothClicked, setLastToothClicked] = useState(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [currentTooth, setCurrentTooth] = useState(null); 
  const [showWarningModal, setShowWarningModal] = useState(false);  
  const [warningTooth, setWarningTooth] = useState(null); 
  const [openSuccessModalTeeth, setOpenSuccessModalTeeth] = useState(false); 
  const [intraoralRecordsFetched, setIntraoralRecordsFetched] = useState(false);
  const [expandedDates, setExpandedDates] = useState({});
  const printRef = useRef();


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
  

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    department: '',
    course: '',
    year: '',
    dateOfBirth: '',
    email: '',
    toothStatus: [], 
    teethStatuses: [] ,
    customCondition: ''
  });

  const teethUpper = [
    { id: 11, label: '11' }, { id: 12, label: '12' }, { id: 13, label: '13' },
    { id: 14, label: '14' }, { id: 15, label: '15' }, { id: 16, label: '16' },
    { id: 17, label: '17' }, { id: 18, label: '18' }, { id: 21, label: '21' },
    { id: 22, label: '22' }, { id: 23, label: '23' }, { id: 24, label: '24' },
    { id: 25, label: '25' }, { id: 26, label: '26' }, { id: 27, label: '27' },
    { id: 28, label: '28' },
  ];
  
  const teethLower = [
    { id: 31, label: '31' }, { id: 32, label: '32' }, { id: 33, label: '33' },
    { id: 34, label: '34' }, { id: 35, label: '35' }, { id: 36, label: '36' },
    { id: 37, label: '37' }, { id: 38, label: '38' }, { id: 41, label: '41' },
    { id: 42, label: '42' }, { id: 43, label: '43' }, { id: 44, label: '44' },
    { id: 45, label: '45' }, { id: 46, label: '46' }, { id: 47, label: '47' },
    { id: 48, label: '48' },
  ];

  const [medicalRecords, setMedicalRecords] = useState([]); 
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [formChanged, setFormChanged] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false); 
  const [activeTab, setActiveTab] = useState('checkup'); 
  const [showIncompleteFieldsDialog, setShowIncompleteFieldsDialog] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false); 
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toothNumber, setToothNumber] = useState(''); 
  const [customCondition, setCustomCondition] = useState('');
  const [toothStatuses, setToothStatuses] = useState({});
  const [selectedToothId, setSelectedToothId] = useState(null); 
  const [editStatus, setEditStatus] = useState(''); 
  const [intraoralRecords, setIntraoralRecords] = useState([]); 


  // Handler to toggle intraoral examination form
  const handleIntraoralExamClick = () => {
    setShowIntraoralExam(!showIntraoralExam);
    setShowForm(false); // Close the other form
  };

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
        console.log('Raw Response from Server:', rawResponse); 
  
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

  const handleSaveButtonClick = () => {
    setOpenConfirmModal(true); 
  };

  const handleConfirmSave = async () => {
    setOpenConfirmModal(false); 

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
        resetForm();
        console.log('Checkup saved successfully');
      } catch (error) {
        console.error('Error saving checkup:', error);
      }
    }
  };

  const handleMedicalRecords = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/checkups/student/${applicant.studentIdNumber}`);
      if (response.ok) {
        const records = await response.json(); 
        const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMedicalRecords(sortedRecords);
        setShowMedicalRecords(true); 
      } else {
        console.error('Failed to fetch medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleIntraoralExamination = async () => {
    const studentId = applicant.studentIdNumber;
    const date = '2024-11-15'; 

    try {
        const response = await fetch(`http://localhost:8080/student/toothStatusesByDate?studentId=${studentId}&date=${date}`);
        if (response.ok) {
            const records = await response.json(); 
            const sortedRecords = records.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)); 
            setIntraoralRecords(sortedRecords); 
            setShowMedicalRecords(true);
        } else {
            console.error('Failed to fetch intraoral examination records');
        }
    } catch (error) {
        console.error('Error fetching intraoral examination records:', error);
    }
};

const handleAllToothStatuses = async () => {

  try {
      console.log('Fetching all tooth statuses for:', applicant.studentIdNumber);
      const response = await fetch(`http://localhost:8080/student/${applicant.studentIdNumber}/tooth-statuses`);

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



  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleDone = (event, applicantId) => {
    event.stopPropagation(); 
    setSelectedApplicantId(applicantId); 
    setOpenConfirmDialog(true);  
    handleDeleteEvent();

  };

  const handleDeleteEvent = () => {
    if (selectedApplicantId) {
      fetch(`http://localhost:8080/api/events/${selectedApplicantId}`, {
        method: 'DELETE',
      })
        .then((eventResponse) => {
          if (eventResponse.ok) {
            console.log('Event deleted successfully');
          } else {
            console.error('Failed to delete event:', eventResponse);
          }
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
        });
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);  
  };

  const handleDelete = () => {
    console.log('Attempting to completed applicant ID:', selectedApplicantId);
  
    fetch(`http://localhost:8080/api/completed-appointments/move/${selectedApplicantId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Successfully moved to Completed Appointments History');
  
          return fetch(`http://localhost:8080/api/patients/${selectedApplicantId}`, {
            method: 'DELETE',
          });
        } else {
          throw new Error('Failed to move to Completed Appointments History');
        }
      })
      .then((response) => {
        if (response.ok) {
          console.log('Patient deleted successfully');
          navigate('/patientlist');
  
          if (typeof setApplicants === 'function') {
            setApplicants((prevApplicants) =>
              prevApplicants.filter((applicant) => applicant.id !== selectedApplicantId)
            );
          }
        } else {
          console.error('Failed to delete patient:', response);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setOpenConfirmDialog(false); 
      });
  };

  
  const handleToothClick = (toothId) => {
    const toothExists = Array.isArray(formData.teethStatuses) && formData.teethStatuses.some(status => status.toothNumber === toothId);
  
    if (toothExists) {
      setWarningTooth(toothId); 
      setShowWarningModal(true); 
    } else {
      setLastToothClicked(toothId);
      setCurrentTooth(toothId);
      setToothNumber(toothId);
      setFormData((prevFormData) => ({
        ...prevFormData,
        toothStatus: [],  
      }));
      setCustomCondition(''); 
      setIsModalOpen(true);
    }
  };
  

  const handleConfirmChange = () => {
    console.log(`Changing the status for tooth: ${currentTooth}`);

    setShowConfirmModal(false); 
    setLastToothClicked(currentTooth); 
  };

  const handleCancelChange = () => {
    setShowConfirmModal(false); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "5px",
  };

  
  const handleSave = () => {
    const finalStatus = formData.toothStatus === 'other' ? customCondition : formData.toothStatus;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      teethStatuses: [
        ...prevFormData.teethStatuses,
        { toothNumber, statusList: formData.toothStatus, customStatus: customCondition },
      ],
      toothStatus: [],
      customCondition: '', 
    }));
  
    closeModal();
  };

  const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
  };
  
  const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
    width: '300px',
  };

  const modalButtonStyle = {
    backgroundColor: '#88343b',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const handleSaveAllToothStatuses = () => {
    console.log("Form data before save:", formData);
  
    if (!formData.toothStatus || formData.toothStatus.length === 0) {
      console.error("No tooth statuses to save");
      return;
    }
  
    let statuses = [...formData.toothStatus];
    if (statuses.includes('other') && customCondition.trim() !== '') {
      statuses = statuses.filter(status => status !== 'other'); 
      statuses.push(customCondition); 
    }
  
    const statusEntry = {
      toothNumber: currentTooth,
      status: statuses,
    };
  
    setFormData((prevFormData) => {
      const updatedTeethStatuses = (prevFormData.teethStatuses || []) 
        .map((status) =>
          status.toothNumber === currentTooth ? statusEntry : status 
        );
  
      if (!updatedTeethStatuses.some(status => status.toothNumber === currentTooth)) {
        updatedTeethStatuses.push(statusEntry);
      }
  
      return {
        ...prevFormData,
        teethStatuses: updatedTeethStatuses, 
        toothStatus: [],  
        customCondition: '', 
      };
    });
  
    setIsModalOpen(false); 
    setToothNumber(null); 
    closeModal(); 
  };
  
  
  
  const handleEditRow = (toothId) => {
    const toothStatus = formData.teethStatuses.find(status => status.toothNumber === toothId);
  
    setToothNumber(toothId);
    setCustomCondition('');
    const currentStatus = toothStatus ? toothStatus.status : [];
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      toothStatus: currentStatus,  
    }));
  
    setIsModalOpen(true); 
  };

const handleDeleteRow = (toothId) => {
  console.log("Deleting tooth status for Tooth Number:", toothId);

  setFormData((prevFormData) => ({
    ...prevFormData,
    teethStatuses: prevFormData.teethStatuses.filter(status => status.toothNumber !== toothId),
  }));
};
  
  
const handleSaveAll = async () => {
  try {
    const dataToSave = formData.teethStatuses.map(status => ({
      toothNumber: status.toothNumber,
      status: status.status.join(', '),  
      studentIdNumber: formData.idNumber, 
      studentNumber: formData.studentNumber,  
      customStatus: formData.customCondition || null,  
      date: new Date().toISOString(),  
    }));

    const response = await fetch(`http://localhost:8080/student/saveToothStatuses?studentIdNumber=${formData.idNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      throw new Error('Failed to save all statuses');
    }

    setOpenSuccessModalTeeth(true);


  } catch (error) {
    console.error('Error saving statuses:', error);
  }
};

const toggleDateExpansion = (date) => {
  setExpandedDates(prevState => ({
    ...prevState,
    [date]: !prevState[date] 
  }));
};


const handlePrint = () => {
  if (printRef.current) {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); 
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
          <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#90343c' }} 
          >
            Medical Checkup and Records
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
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}> {/* Stack vertically */}
        {/* Button section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}> {/* Add margin bottom */}
          {/* Left-aligned buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" 
              sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}}
              onClick={() => setShowForm(!showForm)}
            >
              Check Student
            </Button>
            <Button variant="contained"
              sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}}
              onClick={() => setShowIntraoralExam(!showIntraoralExam)}
            >
              Intraoral Examination
            </Button>
            <Button variant="contained"
              sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}}
              onClick={handleMedicalRecords}
            >
              Medical Records
            </Button>
          </Box>

          {/* Right-aligned Done button */}
          <Button
            variant="contained"
            onClick={(event) => handleDone(event, applicant.id)}
            style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}
          >
            Done
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

         <Dialog open={openSuccessModal} onClose={handleCloseSuccessModal}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>Checkup Successfully Saved!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessModal} color="primary">OK</Button>
          </DialogActions>
        </Dialog>

        <Drawer anchor="right" open={showMedicalRecords} onClose={() => setShowMedicalRecords(false)}>
  <Box sx={{ width: 400, padding: 2 }}>
    <Typography variant="h6" gutterBottom align="center">
      Medical Records
    </Typography>
    <Tabs
      value={activeTab}
      onChange={(event, newValue) => {
        setActiveTab(newValue);
        if (newValue === 'intraoral') {
          handleAllToothStatuses(); // Fetch intraoral records when the tab is switched
          setSelectedRecord(null); // Clear selectedRecord when switching to Intraoral Examination
        }
      }}
      aria-label="medical records tabs"
    >
      <Tab label="Checkup" value="checkup" />
      <Tab label="Intraoral Examination" value="intraoral" />
    </Tabs>

    {/* Checkup Tab */}
    {activeTab === 'checkup' && (
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
    {activeTab === 'intraoral' && (
      <List>
        {Object.keys(
          intraoralRecords.reduce((acc, record) => {
            const date = new Date(record.savedAt).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(record);
            return acc;
          }, {})
        ).map((date, index) => (
          <div key={index}>
            {/* Date item that can be clicked to expand or collapse */}
            <ListItem button onClick={() => toggleDateExpansion(date)}>
              <ListItemText primary={`${date}`} />
            </ListItem>

            {/* Expandable content for each date */}
            <Collapse in={expandedDates[date]} timeout="auto" unmountOnExit>
              {intraoralRecords
                .filter(record => new Date(record.savedAt).toLocaleDateString() === date)
                .map((record, i) => (
                  <Card key={i} sx={{ marginBottom: 2, marginLeft: 3 }}>
                    <CardContent>
                      <Typography variant="body1">
                        Tooth Number: <strong>{record.toothNumber}</strong>
                      </Typography>
                      <Typography variant="body1">
                        Status: {record.status}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Saved At: {new Date(record.savedAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Collapse>
          </div>
        ))}
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

    {/* Print Button for each tab */}
    {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      {activeTab === 'checkup' && selectedRecord && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePrint('checkup')}
        >
          Print Checkup
        </Button>
      )}
      {activeTab === 'intraoral' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePrint('intraoral')}
        >
          Print Intraoral Examination
        </Button>
      )}
    </Box> */}
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

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>{"Complete Patient"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark this patient as Done?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} style={{ color: '#88343B' }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} style={{ color: '#cc9999' }} autoFocus>
              Yes, Complete
            </Button>
          </DialogActions>
        </Dialog>

        <Collapse in={showIntraoralExam} unmountOnExit>
  <Card sx={{ marginTop: 2, width: '100%' }}>
    <CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left column: Tooth chart */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <div className="teeth-chart-container">
            <div className="teeth-chart" style={{ marginBottom: '-50px', marginTop: '-60px' }}>
              <img src="../teeth.png" alt="Teeth Chart" />
              <div className="teeth-buttons">
                {/* Upper Teeth Buttons */}
                {teethUpper.map((tooth) => (
                  <button
                    key={tooth.id}
                    className={`tooth-button tooth-upper-${tooth.id}`}
                    onClick={() => handleToothClick(tooth.id)}
                  >
                    {tooth.label}
                  </button>
                ))}
                {/* Lower Teeth Buttons */}
                {teethLower.map((tooth) => (
                  <button
                    key={tooth.id}
                    className={`tooth-button tooth-lower-${tooth.id}`}
                    onClick={() => handleToothClick(tooth.id)}
                  >
                    {tooth.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  {/* Upper Teeth Status Table */}
  <Box>
    <Typography variant="h6">Upper Tooth Statuses:</Typography>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Tooth Number</th>
          <th style={tableHeaderStyle}>Status</th>
          <th style={tableHeaderStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(formData.teethStatuses) && formData.teethStatuses.length > 0
          ? formData.teethStatuses
              .filter(status => teethUpper.some(tooth => tooth.id === status.toothNumber)) // Filter for upper teeth
              .map((status) => (
                <tr key={status.toothNumber}> {/* Ensure key is unique */}
                  <td style={tableCellStyle}>{status.toothNumber}</td>
                  <td style={tableCellStyle}>{status.status.join(', ')}</td>
                  <td style={tableCellStyle}>
                    {/* Edit Button */}
                    <IconButton 
                      onClick={() => handleEditRow(status.toothNumber)}
                      size="small"
                    >
                      <EditIcon style={{ color: '#88343B'}}/>
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton 
                      onClick={() => handleDeleteRow(status.toothNumber)}
                      size="small"
                    >
                      <DeleteIcon style={{ color: 'maroon'}}/>
                    </IconButton>
                  </td>
                </tr>
              ))
          : (
            <tr>
              <td colSpan="3" style={tableCellStyle}>No upper tooth statuses added yet.</td>
            </tr>
          )}
      </tbody>
    </table>
  </Box>

  {/* Lower Teeth Status Table */}
  <Box>
    <Typography variant="h6">Lower Tooth Statuses:</Typography>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Tooth Number</th>
          <th style={tableHeaderStyle}>Status</th>
          <th style={tableHeaderStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(formData.teethStatuses) && formData.teethStatuses.length > 0
          ? formData.teethStatuses
              .filter(status => teethLower.some(tooth => tooth.id === status.toothNumber)) // Filter for lower teeth
              .map((status) => (
                <tr key={status.toothNumber}> {/* Ensure key is unique */}
                  <td style={tableCellStyle}>{status.toothNumber}</td>
                  <td style={tableCellStyle}>{status.status.join(', ')}</td>
                  <td style={tableCellStyle}>
                    {/* Edit Button */}
                    <IconButton 
                      onClick={() => handleEditRow(status.toothNumber)}
                      size="small"
                    >
                      <EditIcon style={{ color: '#88343B'}}/>
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton 
                      onClick={() => handleDeleteRow(status.toothNumber)}
                      size="small"
                    >
                      <DeleteIcon style={{ color: 'maroon'}}/>
                    </IconButton>
                  </td>
                </tr>
              ))
          : (
            <tr>
              <td colSpan="3" style={tableCellStyle}>No lower tooth statuses added yet.</td>
            </tr>
          )}
      </tbody>
    </table>
  </Box>
</Box>


      </div>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
  <Button
    variant="contained"
    color="primary"
    onClick={handleSaveAll}
    sx={{ backgroundColor: '#88343B', '&:hover': { backgroundColor: '#F7C301' } }}
  >
    Save All
  </Button>
</Box>
    </CardContent>
  </Card>
</Collapse>




      {/* Modal for selecting tooth status */}
{isModalOpen && (
  <div style={modalOverlayStyle}>
    <div style={modalStyle}>
      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#88343b',
        }}
      >
        &times;
      </button>

      <h2>Tooth Number <strong>{toothNumber}</strong></h2><br />

      <label style={styles.checkboxContainer}>
        Tooth Status:
        <div style={{ ...styles.input, backgroundColor: 'white', padding: '10px' }}>
          {['/', 'D', 'F', 'M', 'Dx', 'Un', 'S', 'JC', 'P', 'Rf', 'Imp', 'other'].map((status) => (
            <div key={status}>
              <label style={{ ...styles.checkbox, display: 'flex', alignItems: 'center' }} className="custom-checkbox">
                <input
                  type="checkbox"
                  name="toothStatus"
                  value={status}
                  checked={formData.toothStatus.includes(status)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prevFormData) => {
                      const newStatuses = prevFormData.toothStatus.includes(value)
                        ? prevFormData.toothStatus.filter((s) => s !== value)
                        : [...prevFormData.toothStatus, value];
                      return { ...prevFormData, toothStatus: newStatuses };
                    });
                    if (value === 'other') {
                      setCustomCondition(''); // Reset custom condition when "other" is selected
                    }
                  }}
                />
                <span style={{ marginLeft: '50px', minWidth: '30px', textAlign: 'left' }}>{status}</span>
              </label>
            </div>
          ))}
        </div>
      </label>
      <br />

      {formData.toothStatus.includes('other') && (
        <label style={styles.label}>
          Custom Status:
          <input
            type="text"
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            style={styles.input}
          />
        </label>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setIsModalOpen(false)} style={modalButtonStyle}>Close</button>
        <button
          onClick={handleSaveAllToothStatuses}
          style={modalButtonStyle}
          disabled={formData.toothStatus.includes('other') && !customCondition.trim()}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



{/* Warning Modal for same tooth click */}
<Dialog open={showWarningModal} onClose={() => setShowWarningModal(false)}>
  <DialogTitle>Tooth Status Exists</DialogTitle>
  <DialogContent>
    <Typography>
      Tooth number {warningTooth} already has a status. Please change the status or select a different tooth.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowWarningModal(false)} sx={{ color: 'black' }}>
      Ok
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={openSuccessModalTeeth} onClose={() => setOpenSuccessModalTeeth(false)}>
  <DialogTitle>Success</DialogTitle>
  <DialogContent>
    <Typography>All tooth statuses saved successfully!</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenSuccessModalTeeth(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>



         
        </Box>
      </Box>
  );
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', 
    padding: '20px',
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '1000px',
    // overflowY: 'auto',
    // maxHeight: '90vh',
    color: 'black',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: 'black',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    color: 'black',
  },
  input: {
    flex: 1,
    padding: '5px',
    border: 'none',
    borderBottom: '1px solid black',
    color: 'black',
  },
  button: {
    backgroundColor: '#88343b',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    color: 'black',
  },
  dateInput: {
    flex: 1,
    color: 'black',
    backgroundColor: 'white',
    padding: '8px',
    borderBottom: '1px solid black',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  },
};

export default PatientForm;
