import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Drawer,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Collapse,
  Button,
  IconButton,
  InputBase,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

import DocNavBar from '../components/DocNavBar';
import Sidebar from '../components/DocSidebar';
import '../doctor/dashboard.css';

const DeclinedAppointments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [declinedAppointments, setDeclinedAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [intraoralRecords, setIntraoralRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('checkup');
  const [expandedDates, setExpandedDates] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  const appointment = location.state?.appointment || {};

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

  
  const fetchStudentData = async (studentIdNumber) => {
  if (!studentIdNumber) {
    console.error('No student ID provided.');
    return;
  }

  try {
    const response = await fetch(`https://dentalmanagement.azurewebsites.net/student/students/${studentIdNumber}`);

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


  useEffect(() => {
    const fetchDeclinedAppointments = async () => {
      try {
        const response = await fetch('https://dentalmanagement.azurewebsites.net/api/declined-appointments');
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.declinedDate) - new Date(a.declinedDate));
        setDeclinedAppointments(sortedData);
        setFilteredAppointments(sortedData);
      } catch (error) {
        console.error('Error fetching declined appointments:', error);
      }
    };

    fetchDeclinedAppointments();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = declinedAppointments.filter((appt) => {
      return (
        (appt.studentIdNumber?.toLowerCase() || "").includes(lowercasedQuery) ||
        (appt.fullName?.toLowerCase() || "").includes(lowercasedQuery) ||
        (appt.program?.toLowerCase() || "").includes(lowercasedQuery) ||
        (appt.yearLevel?.toLowerCase() || "").includes(lowercasedQuery) ||
        (appt.date?.toLowerCase() || "").includes(lowercasedQuery) ||
        (appt.time?.toLowerCase() || "").includes(lowercasedQuery) ||
        (new Date(appt.declinedDate).toLocaleDateString().toLowerCase().includes(lowercasedQuery))
      );
    });
    setFilteredAppointments(filtered);
  }, [searchQuery, declinedAppointments]);

  const handleRowClick = async (studentIdNumber) => {
    if (!studentIdNumber) {
      console.error('No studentIdNumber provided for fetching records.');
      return;

      
    }
  
    fetchStudentData(studentIdNumber);

    try {
      // Fetch Checkup Records
      const checkupResponse = await fetch(`https://dentalmanagement.azurewebsites.net/api/checkups/student/${studentIdNumber}`);
      const checkupRecords = await checkupResponse.json();
      const sortedCheckupRecords = checkupRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMedicalRecords(sortedCheckupRecords);
  
      // Fetch Intraoral Records
      const intraoralResponse = await fetch(`https://dentalmanagement.azurewebsites.net/student/${studentIdNumber}/tooth-statuses`);
      const intraoralRecords = await intraoralResponse.json();
      const sortedIntraoralRecords = intraoralRecords.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      setIntraoralRecords(sortedIntraoralRecords);
  
      // Set selected record
      setSelectedRecord({ studentIdNumber });
  
      // Open drawer
      setShowMedicalRecords(true);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prevState => ({
      ...prevState,
      [date]: !prevState[date] 
    }));
  };
  

  const handleAllToothStatuses = async (studentIdNumber) => {
    if (!studentIdNumber) {
      console.error('Student ID Number is not provided.');
      return;
    }
  
    try {
      console.log('Fetching all tooth statuses for:', studentIdNumber);
      const response = await fetch(`https://dentalmanagement.azurewebsites.net/student/${studentIdNumber}/tooth-statuses`);
  
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
        studentData: formData,
        medicalRecords,
        intraoralRecords,
      },
    });
  };


  return (
    <Box className="dashboard-container" sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#90343c',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            Declined Appointments
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

        <Box display="flex" justifyContent="center" mt={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#90242c' }}>
                <TableCell style={{ color: '#FFFFFF' }}>ID Number</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>Full Name</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>Program</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>Year</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>Date & Time</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>Declined Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appt) => (
                <TableRow
                  key={appt.id}
                  onClick={() => handleRowClick(appt.studentIdNumber)} // Pass studentIdNumber here
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#eaf6ff' },
                  }}
                >
                  <TableCell>{appt.studentIdNumber}</TableCell>
                  <TableCell>{appt.fullName}</TableCell>
                  <TableCell>{appt.program}</TableCell>
                  <TableCell>{appt.yearLevel}</TableCell>
                  <TableCell>{`${appt.date} ${appt.time}`}</TableCell>
                  <TableCell>{new Date(appt.declinedDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Box>
      </Box>

      {/* Medical Records Drawer */}
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
    if (newValue === "intraoral" && selectedRecord?.studentIdNumber) {
      handleAllToothStatuses(selectedRecord.studentIdNumber);
    }
  }}
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
          {medicalRecords && medicalRecords.length > 0 ? (
            medicalRecords.map((record, index) => (
              <ListItem key={index} button onClick={() => setSelectedRecord(record)}>
                <ListItemText
                  primary={`${new Date(record.date).toDateString()} - ${new Date(record.date).toLocaleTimeString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "center", marginTop: 2 }}
            >
              No Checkup Records available.
            </Typography>
          )}
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
{activeTab === 'checkup' && selectedRecord && medicalRecords.length > 0 && (
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

    </Box>
  );
};

export default DeclinedAppointments;
