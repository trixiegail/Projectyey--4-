import React, { useState, createContext, useContext, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
        FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import { useNavigate } from 'react-router-dom';

export const ApplicantsContext = createContext();

const programsByDepartment = {
  'COLLEGE OF ENGINEERING AND ARCHITECTURE': [
    'BS Architecture',
    'BS Chemical Engineering',
    'BS Civil Engineering',
    'BS Computer Engineering',
    'BS Electrical Engineering',
    'BS Electronics Engineering',
    'BS Industrial Engineering',
    'BS Mechanical Engineering',
    'BS Mining Engineering',
  ],
  'COLLEGE OF MANAGEMENT, BUSINESS & ACCOUNTANCY': [
    'BS Accountancy',
    'BS Accounting Information Systems',
    'BS Management Accounting',
    'BS Business Administration',
    'BS Hospitality Management',
    'BS Tourism Management',
    'BS Office Administration',
    'Bachelor in Public Administration',
  ],
  'COLLEGE OF ARTS, SCIENCES, & EDUCATION': [
    'AB Communication',
    'AB English with Applied Linguistics',
    'Bachelor of Elementary Education',
    'Bachelor of Secondary Education',
    'Bachelor of Multimedia Arts',
    'BS Biology',
    'BS Math with Applied Industrial Mathematics',
    'BS Psychology',
  ],
  'COLLEGE OF NURSING & ALLIED HEALTH SCIENCES': [
    'BS Nursing',
    'BS Pharmacy',
  ],
  'COLLEGE OF COMPUTER STUDIES': [
    'BS Computer Science',
    'BS Information Technology',
  ],
  'COLLEGE OF CRIMINAL JUSTICE': [
    'BS Criminology',
  ],
};

const PatientList = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { applicants, setApplicants } = useContext(ApplicantsContext);
  const navigate = useNavigate();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  // Sorting and filtering logic
  const sortedApplicants = [...applicants].sort((a, b) => {
    const timeA = a.time ? a.time.split(' - ')[0] : '';
    const timeB = b.time ? b.time.split(' - ')[0] : '';
  
    const dateA = new Date(a.date + ' ' + timeA);
    const dateB = new Date(b.date + ' ' + timeB);
  
    return dateA - dateB; // Sort in ascending order
  });

  const filteredApplicants = sortedApplicants.filter((applicant) => {
    if (filterPriority === 'Priority List' && applicant.yearLevel !== 4) {
      return false;
    }
    if (filterDepartment && filterDepartment !== applicant.department) {
      return false;
    }
    if (filterProgram && filterProgram !== applicant.program) {
      return false;
    }
    if (filterYear && filterYear !== '' && filterYear !== (applicant.yearLevel ? applicant.yearLevel.toString() : '')) {
      return false;
    }
    if (filterDate && filterDate !== '' && filterDate !== applicant.date) {
      return false;
    }
    return true;
  });

  const handleDepartmentChange = (department) => {
    setFilterDepartment(department);
    setFilterProgram(''); 
  };

  const handleRowClick = (applicant) => {
    navigate(`/PatientForm/${applicant.studentIdNumber}`, { state: { applicant } });
  };

  // This prevents navigation to the CheckupForm when clicking the "Done" button
  const handleDone = (event, applicantId) => {
    event.stopPropagation(); // Prevents row click event
    setSelectedApplicantId(applicantId);  // Store the applicant ID to be deleted
    setOpenConfirmDialog(true);  
    handleDeleteEvent();
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

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);  
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

  return (
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
          sx={{ fontWeight: 'bold', color: '#90343c', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} 
        >
          Patients
        </Typography>
        <DocNavBar />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} width="100%">
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>List</InputLabel>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            label="List"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Priority List">Priority List</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ minWidth: 300 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filterDepartment}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            label="Department"
          >
            <MenuItem value="">All</MenuItem>
            {Object.keys(programsByDepartment).map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="center" mt={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
        <TableHead>
            <TableRow style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>ID Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Full Name</TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150, marginLeft: 10 }}>
                  <InputLabel style={{ color: '#FFFFFF' }}>Program</InputLabel>
                  <Select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    label="Program"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterDepartment && programByDepartment[filterDepartment].map((program) => (
                      <MenuItem key={program} value={program}>{program}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 100, marginLeft: 10 }}>
                  <InputLabel style={{ color: '#FFFFFF' }}>Year</InputLabel>
                  <Select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    label="Year"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>
                Date & Time
                <TextField
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  size="small"
                  style={{ marginLeft: 10 }}
                />
              </TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplicants.map((applicant) => (
              <TableRow key={applicant.id} onClick={() => handleRowClick(applicant)} style={{ cursor: 'pointer', backgroundColor:'white' }}>
              <TableCell style={{ paddingLeft: 15, fontSize: '16px' }}>{applicant.studentIdNumber}</TableCell>
              <TableCell style={{ paddingLeft: 15, fontSize: '16px' }}>{applicant.fullName}</TableCell>
              <TableCell style={{ paddingLeft: 30, fontSize: '16px' }}>{applicant.program}</TableCell>
              <TableCell style={{ paddingLeft: 70, fontSize: '16px' }}>{applicant.yearLevel}</TableCell>
              <TableCell style={{ paddingLeft: 20, fontSize: '16px' }}>
                {applicant.date} <strong>&emsp;&emsp;{applicant.time}</strong>
              </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={(event) => handleDone(event, applicant.id)}
                    style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}
                  >
                    Done
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

    </Box>
  );
};

const Patients = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/patients/')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApplicants(data); // Set the applicants in state
        } else {
          console.error('Expected an array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching reservations:', error));
  }, []);

  return (
    <ApplicantsContext.Provider value={{ applicants, setApplicants }}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar /> 
        <PatientList />
      </Box>
    </ApplicantsContext.Provider>
  );
};

export default Patients;
