import React, { useState, createContext, useContext, useEffect , useRef } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
        FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import Patients from '../doctor/Patients';
import { PatientsContext } from '../doctor/PatientsContext';

export const ApplicantsContext = createContext();

const programByDepartment = {
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

const programsByDepartment = {  };

const ApplicantList = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { applicants, setApplicants } = useContext(ApplicantsContext); // Need to access setApplicants here
  const navigate = useNavigate();
  const { addPatient, removePatient } = useContext(PatientsContext);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null); 

  // Dialog state management
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null); // New state for tracking event ID
  const [openDeleteEventDialog, setOpenDeleteEventDialog] = useState(false); // New state for delete confirmation


  // Handle accept button click
  const handleOpenAcceptDialog = (event, applicant) => {
    event.stopPropagation(); // Prevent any row click event from firing
    setSelectedApplicant(applicant); // Store the selected applicant
    setOpenAcceptDialog(true); // Open the confirmation dialog
  };

  const handleCloseAcceptDialog = () => {
    setOpenAcceptDialog(false); // Close the dialog without any action
    setSelectedApplicant(null); // Clear the selected applicant
  };

   // Confirm acceptance of the patient
   const handleConfirmAccept = () => {
    if (selectedApplicant) {
      // Call the backend API to accept the reservation
      fetch(`http://localhost:8080/api/reservations/accept/${selectedApplicant.id}`, {
        method: 'POST',
      })
      .then(response => {
        if (response.ok) {
          setApplicants((prevApplicants) => prevApplicants.filter(a => a.id !== selectedApplicant.id));

        const eventId = selectedApplicant.event.id; 

        fetch(`http://localhost:8080/api/events/${eventId}`, {
          method: 'DELETE',
        })
        .then(eventResponse => {
          if (eventResponse.ok) {
            console.log('Event deleted successfully');

            setApplicants((prevApplicants) => prevApplicants.filter(a => a.id !== selectedApplicant.id));

            handleCloseAcceptDialog();
          } else {
            console.error('Failed to delete event:', eventResponse);
          }
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
        });
      } else {
        console.error('Failed to accept the patient.');
      }
    })
    .catch(error => {
      console.error('Error accepting reservation:', error);
    });
  }

  
    // Close the dialog after confirming
    handleCloseAcceptDialog();
  };

  const handleOpenConfirmDialog = (applicantId, eventId) => {
    setSelectedApplicantId(applicantId); // Store the ID of the applicant to delete
    setSelectedEventId(eventId);
    setOpenConfirmDialog(true); // Open the dialog
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false); // Close the dialog
  };

  // Sorting applicants by date and time
  const sortedApplicants = [...applicants].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time.split(' - ')[0]); // Combine date and start time
    const dateB = new Date(b.date + ' ' + b.time.split(' - ')[0]);
    return dateA - dateB; // Sort in ascending order
  });

  // Filter applicants
  const filteredApplicants = sortedApplicants.filter((applicant) => {
    if (filterPriority === 'Priority List' && applicant.year !== 4) {
      return false;
    }
    if (filterDepartment && filterDepartment !== applicant.department) {
      return false;
    }
    if (filterProgram && filterProgram !== applicant.program) {
      return false;
    }
    if (filterYear && filterYear !== '' && filterYear !== applicant.year.toString()) {
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
    navigate(`/CheckupForm/${applicant.studentIdNumber}`, { state: { applicant } });
  };

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleConfirmRefusal = () => {
    if (isSubmitting) return; // Prevent further requests while the current one is processing
    setIsSubmitting(true);
    
    console.log('Attempting to reject applicant ID:', selectedApplicantId);
  
    // Move the reservation to the Declined Appointments History first
    fetch(`http://localhost:8080/api/declined-appointments/move/${selectedApplicantId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Successfully moved to Declined Appointments History');
  
          // Now delete the reservation
          fetch(`http://localhost:8080/api/reservations/${selectedApplicantId}`, {
            method: 'DELETE',
          })
            .then((deleteResponse) => {
              if (deleteResponse.ok) {
                console.log('Reservation deleted successfully');
                setOpenDeleteEventDialog(true); 
                handleCloseConfirmDialog();
              } else {
                console.error('Failed to delete reservation:', deleteResponse);
              }
            })
            .catch((error) => {
              console.error('Error deleting reservation:', error);
            })
            .finally(() => {
              setIsSubmitting(false); // Reset the submitting state
            });
        } else {
          console.error('Failed to move to Declined Appointments History:', response);
          setIsSubmitting(false); // Reset the submitting state in case of failure
        }
      })
      .catch((error) => {
        console.error('Error moving to Declined Appointments History:', error);
        setIsSubmitting(false); // Reset the submitting state in case of failure
      });
  };
  
  
  
  
  const handleDeclineAndDeleteEvent = () => {
    if (selectedEventId) {
      fetch(`http://localhost:8080/api/events/${selectedEventId}`, {
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
    setOpenDeleteEventDialog(false);
  };
  

  const handleDeclineWithoutDeletingEvent = () => {
    // Close the delete confirmation modal (after the reservation has already been deleted)
    setOpenDeleteEventDialog(false); 
  };

  

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box 
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', color: '#90343c', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} 
        >
          Applicants For Check Up
        </Typography>
        <DocNavBar />
      </Box>

      {/* Filter Options */}
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
            {Object.keys(programByDepartment).map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Applicant Table */}
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
                    onClick={(event) => handleOpenAcceptDialog(event, applicant)} // Call to open the modal
                    style={{ backgroundColor: '#90242c', color: '#FFFFFF', marginRight: 10 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      event.stopPropagation(); 
                      handleOpenConfirmDialog(applicant.id, applicant.event.id)
                    }}
                    style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}
                  >
                    Decline
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

        {/* Confirmation Modal for Accept */}
        <Dialog
        open={openAcceptDialog} // Controlled by openAcceptDialog state
        onClose={handleCloseAcceptDialog}
        aria-labelledby="accept-dialog-title"
        aria-describedby="accept-dialog-description"
      >
        <DialogTitle id="accept-dialog-title">Accept Patient</DialogTitle>
        <DialogContent>
          <DialogContentText id="accept-dialog-description">
            Are you sure you want to accept this patient?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmAccept} color="primary" autoFocus>Yes, Accept</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Rejection */}
      <Dialog
        open={openConfirmDialog}  // Controlled by openConfirmDialog state
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Reject Patient"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reject this patient?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} style={{ color: '#88343B' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRefusal} // Calls the function to confirm refusal
            disabled={isSubmitting}
            style={{ color: '#cc9999' }}
            autoFocus
          >
            Yes, Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <Dialog
        open={openDeleteEventDialog} // Controlled by openDeleteEventDialog state
        onClose={() => setOpenDeleteEventDialog(false)}
        aria-labelledby="confirm-delete-event-title"
        aria-describedby="confirm-delete-event-description"
      >
        <DialogTitle id="confirm-delete-event-title">Delete Associated Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-event-description">
          Do you want to delete the associated event for this rejected patient?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineWithoutDeletingEvent} style={{ color: '#88343B' }}>
            No, Keep Event
          </Button>
          <Button onClick={handleDeclineAndDeleteEvent} style={{ color: '#cc9999' }} autoFocus>
            Yes, Delete Event
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

const CheckupApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    console.log("Fetching applicants...");
  
    fetch('http://localhost:8080/api/reservations/reservations')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          // Remove duplicate entries in the frontend based on unique identifiers like studentIdNumber
          const uniqueApplicants = data.reduce((acc, applicant) => {
            const found = acc.find(a => a.studentIdNumber === applicant.studentIdNumber && a.date === applicant.date && a.time === applicant.time);
            if (!found) acc.push(applicant);
            return acc;
          }, []);
          
          setApplicants(uniqueApplicants); // Set only unique applicants
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
        <ApplicantList />
      </Box>
    </ApplicantsContext.Provider>
  );
};

export default CheckupApplicantList;