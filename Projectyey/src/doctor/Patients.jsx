import React, { useState, createContext, useContext, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
        FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle , InputBase, IconButton} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import '../doctor/dashboard.css';

export const ApplicantsContext = createContext();


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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState(applicants);

  // Sorting and filtering logic
  const sortedApplicants = [...applicants].sort((a, b) => {
    const timeA = a.time ? a.time.split(' - ')[0] : '';
    const timeB = b.time ? b.time.split(' - ')[0] : '';
  
    const dateA = new Date(a.date + ' ' + timeA);
    const dateB = new Date(b.date + ' ' + timeB);
  
    return dateA - dateB; // Sort in ascending order
  });

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
  
    const filtered = applicants.filter((applicant) => {
      // Safely handle null or undefined yearLevel
      const yearLevelString = applicant.yearLevel != null ? applicant.yearLevel.toString() : '';
  
      // Search filter
      const matchesSearch =
        applicant.studentIdNumber.toLowerCase().includes(lowercasedQuery) ||
        applicant.fullName.toLowerCase().includes(lowercasedQuery) ||
        applicant.program.toLowerCase().includes(lowercasedQuery) ||
        yearLevelString.toLowerCase().includes(lowercasedQuery) ||
        applicant.date.toLowerCase().includes(lowercasedQuery) ||
        applicant.time.toLowerCase().includes(lowercasedQuery);
  
      // Priority filter
      const matchesPriority =
        filterPriority === 'All' || (filterPriority === 'Priority List' && yearLevelString === '4');
  
      // Year filter
      const matchesYear = !filterYear || yearLevelString === filterYear;
  
      // Date filter
      const matchesDate = !filterDate || applicant.date === filterDate;
  
      return matchesSearch && matchesPriority && matchesYear && matchesDate;
    });
  
    setFilteredApplicants(filtered);
  }, [searchQuery, filterPriority, filterYear, filterDate, applicants]);
  


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
  
    fetch(`https://dentalmanagement-app.onrender.com/api/completed-appointments/move/${selectedApplicantId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Successfully moved to Completed Appointments History');
  
          return fetch(`https://dentalmanagement-app.onrender.com/api/patients/${selectedApplicantId}`, {
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
      fetch(`https://dentalmanagement-app.onrender.com/api/events/${selectedApplicantId}`, {
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#90343c',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
          Patients
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={-1} width="100%">
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

         {/* Color Legend */}
         <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '-30px', color: 'black' }}>
          <Box sx={{ backgroundColor: '#fff59d ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>Today</Typography>
          <Box sx={{ backgroundColor: '#fce4ec ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }} >Past Due</Typography>
        </Box>

      </Box>

      <Box display="flex" justifyContent="center" mt={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
        <TableHead>
            <TableRow style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>ID Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Full Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 35 }}>Program</TableCell>
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
              {filteredApplicants.map((applicant) => {
                const applicantDate = new Date(applicant.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset today's time to midnight for comparison

                // Determine row background color based on the date
                let backgroundColor = 'white';
                if (applicantDate.toDateString() === today.toDateString()) {
                  backgroundColor = '#fff59d'; // Pale yellow for today
                } else if (applicantDate < today) {
                  backgroundColor = '#fce4ec'; // Pale red for past dates
                }

                return (
                  <TableRow
                    key={applicant.id}
                    onClick={() => handleRowClick(applicant)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor, 
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f0f0f0', 
                      },
                    }}
            >
              <TableCell style={{ paddingLeft: 15, fontSize: '14px' }}>{applicant.studentIdNumber}</TableCell>
              <TableCell style={{ paddingLeft: 15, fontSize: '14px' }}>{applicant.fullName}</TableCell>
              <TableCell style={{ paddingLeft: 30, fontSize: '14px' }}>{applicant.program}</TableCell>
              <TableCell style={{ paddingLeft: 70, fontSize: '14px' }}>{applicant.yearLevel}</TableCell>
              <TableCell style={{ paddingLeft: 20, fontSize: '14px' }}>
                {applicant.date} <strong>&emsp;&emsp;{applicant.time}</strong>
              </TableCell>
              <TableCell>
                      <Button
                        variant="contained"
                        onClick={(event) => handleDone(event, applicant.id)}
                        sx={{
                          backgroundColor: '#9e444b', // Dark blue for Approve button
                          color: 'white',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#90242c', // Even darker blue on hover
                          },
                          marginRight: 5,
                          width: "50%"
                        }}
                      >
                        Done
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
        <DialogContentText style={{ color: 'black' }}>
  Are you sure you want to mark this patient as Done?
</DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseConfirmDialog} style={{ color: 'black', fontWeight: 'bold' }}>
    Cancel
  </Button>
  <Button onClick={handleDelete} style={{ color: 'black', fontWeight: 'bold' }} autoFocus>
    Yes, Complete
  </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

const Patients = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch('https://dentalmanagement-app.onrender.com/api/patients/')
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
        <PatientList />
    </ApplicantsContext.Provider>
  );
};

export default Patients;
