import React, { useState, createContext, useContext, useEffect , useRef } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
        FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputBase, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';
import Patients from '../doctor/Patients';
import { PatientsContext } from '../doctor/PatientsContext';
import SearchIcon from '@mui/icons-material/Search';
import '../doctor/dashboard.css';

export const ApplicantsContext = createContext();



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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState(applicants);

  // Handle accept button click
  const handleOpenAcceptDialog = (event, applicant) => {
    console.log("Applicant object passed to dialog:", applicant);
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
      // Accept the applicant
      fetch(`https://dentalmanagement-app.onrender.com/api/reservations/accept/${selectedApplicant.id}`, {
        method: 'POST',
      })
      .then(response => {
        if (response.ok) {
          // Send email notification
          fetch(`https://dentalmanagement-app.onrender.com/email/send-email/${selectedApplicant.email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: selectedApplicant.email, subject: "Approval Notification",
              message: `<p>Dear ${selectedApplicant.fullName},</p>
              <p>We are pleased to inform you that your appointment request has been approved. Below are the details of your confirmed appointment:</p>
              <p>
                <strong>Date:</strong> ${selectedApplicant.date}<br>
                <strong>Time:</strong> ${selectedApplicant.time}
              </p>
              <p>If you have any questions, please do not hesitate to contact us. We look forward to serving you.</p>
              <p>Best regards,</p>
              <p><strong>CITU Oral Healthcare Team</strong></p>`, }),
          })
          .then(emailResponse => {
            if (emailResponse.ok) { 
              console.log('Approval email sent successfully');
            } else {
              console.error('Failed to send approval email');
              console.log("Selected Applicant:", selectedApplicant);
              console.log("Email:", selectedApplicant?.email);
            }
          })
          .catch(error => console.error('Error sending approval email:', error));
  
          // Remove the applicant from the list
          setApplicants(prevApplicants => prevApplicants.filter(a => a.id !== selectedApplicant.id));
          const eventId = selectedApplicant.event.id; 
          fetch(`https://dentalmanagement-app.onrender.com/api/events/${eventId}`, {
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
          console.error('Failed to accept the applicant.');
        }
      })
      .catch(error => console.error('Error accepting the applicant:', error));
    }
  

  
    // Close the dialog after confirming
    handleCloseAcceptDialog();
  };

  const handleOpenConfirmDialog = (applicantId, eventId) => {
    const applicant = applicants.find(a => a.id === applicantId); // Ensure this is not returning undefined
    console.log("Applicant Found:", applicant);
    setSelectedApplicantId(applicantId); // Store the ID of the applicant to delete
    setSelectedEventId(eventId);
    setOpenConfirmDialog(true); // Open the dialog
    console.log('Email to decline:', selectedApplicant.email);
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
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = applicants.filter((applicant) => {
      // Search filter
      const matchesSearch =
        applicant.studentIdNumber.toLowerCase().includes(lowercasedQuery) ||
        applicant.fullName.toLowerCase().includes(lowercasedQuery) ||
        applicant.program.toLowerCase().includes(lowercasedQuery) ||
        applicant.yearLevel.toString().toLowerCase().includes(lowercasedQuery) ||
        applicant.date.toLowerCase().includes(lowercasedQuery) ||
        applicant.time.toLowerCase().includes(lowercasedQuery);

      // Priority filter
      const matchesPriority =
        filterPriority === 'All' || (filterPriority === 'Priority List' && applicant.yearLevel.toString() === '4');

      // Year filter
      const matchesYear = !filterYear || applicant.yearLevel.toString() === filterYear;

      // Date filter
      const matchesDate = !filterDate || applicant.date === filterDate;

      return matchesSearch && matchesPriority && matchesYear && matchesDate;
    });

    setFilteredApplicants(filtered);
  }, [searchQuery, filterPriority, filterYear, filterDate, applicants]);


  const handleRowClick = (applicant) => {
    navigate(`/CheckupForm/${applicant.studentIdNumber}`, { state: { applicant } });
  };

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleConfirmRefusal = () => {
    if (isSubmitting) return; // Prevent further requests while the current one is processing
    setIsSubmitting(true);

    if (selectedApplicantId) {
      const applicant = applicants.find(a => a.id === selectedApplicantId); // Get the applicant
      if (!applicant || !applicant.email) {
        console.error("Applicant or email is null/undefined");
        setIsSubmitting(false);
        return;
      }
    
    console.log('Attempting to reject applicant ID:', selectedApplicantId);
    console.log("Sending email for applicant:", applicant);

    // Send the email notification
    fetch(`https://dentalmanagement-app.onrender.com/email/send-email/${applicant.email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: applicant.email,
        subject: 'Appointment Declined',
        message: `<p>Dear ${applicant.fullName},</p>
          <p>We regret to inform you that your appointment request has been declined. Below are the details of the declined appointment:</p>
          <p>
            <strong>Date:</strong> ${applicant.date}<br>
            <strong>Time:</strong> ${applicant.time}
          </p>
          <p>If you have any questions or would like to reschedule, please do not hesitate to contact us.</p>
          <p>Best regards,</p>
          <p><strong>CITU Oral Healthcare Team</strong></p>`,
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log('Decline email sent successfully');
      } else {
        console.error('Failed to send decline email');
      }
    })
    .catch((error) => console.error('Error sending decline email:', error))
    .finally(() => setIsSubmitting(false));
  } 
    
  
    // Move the reservation to the Declined Appointments History first
    fetch(`https://dentalmanagement-app.onrender.com/api/declined-appointments/move/${selectedApplicantId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Successfully moved to Declined Appointments History');

          // Now delete the reservation
          fetch(`https://dentalmanagement-app.onrender.com/api/reservations/${selectedApplicantId}`, {
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
      fetch(`https://dentalmanagement-app.onrender.com/api/events/${selectedEventId}`, {
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
            Applicants For Check Up
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

      {/* Filter Options */}
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

      {/* Applicant Table */}
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
          today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

          // Determine row background color based on date
          let backgroundColor = 'white';
          if (applicantDate.toDateString() === today.toDateString()) {
            backgroundColor = '#fff59d'; // Slightly darker pale yellow for today
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
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Light gray for hover
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add subtle elevation on hover
                },
              }}
            >
              <TableCell
                style={{
                  paddingLeft: 15,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {applicant.studentIdNumber}
              </TableCell>
              <TableCell
                style={{
                  paddingLeft: 15,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {applicant.fullName}
              </TableCell>
              <TableCell
                style={{
                  paddingLeft: 30,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {applicant.program}
              </TableCell>
              <TableCell
                style={{
                  paddingLeft: 70,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {applicant.yearLevel}
              </TableCell>
              <TableCell
                style={{
                  paddingLeft: 20,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {applicant.date} <strong>&emsp;&emsp;{applicant.time}</strong>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={(event) => handleOpenAcceptDialog(event, applicant)}
                  sx={{
                    backgroundColor: '#9e444b', // Dark blue for Approve button
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#90242c', // Even darker blue on hover
                    },
                    marginRight: 1,
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenConfirmDialog(applicant.id, applicant.event.id);
                  }}
                  sx={{
                    backgroundColor: '#e57373',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                    },
                  }}
                >
                  Decline
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
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
  <DialogContentText id="accept-dialog-description" style={{ color: 'black' }}>
    Are you sure you want to accept this patient?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseAcceptDialog} style={{ fontWeight: 'bold', color: 'black' }}>
    Cancel
  </Button>
  <Button onClick={handleConfirmAccept} style={{ fontWeight: 'bold', color: 'black' }} autoFocus>
    Yes, Accept
  </Button>
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
  <DialogContentText id="alert-dialog-description" style={{ color: 'black' }}>
    Are you sure you want to reject this patient?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseConfirmDialog} style={{ fontWeight: 'bold', color: 'black' }}>
    Cancel
  </Button>
  <Button
    onClick={handleConfirmRefusal}
    disabled={isSubmitting}
    style={{ fontWeight: 'bold', color: 'black' }} // Set color to maroon and make bold
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
    </Box>
  );
};

const CheckupApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    console.log("Fetching applicants...");
  
    fetch('https://dentalmanagement-app.onrender.com/api/reservations/reservations')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          // Remove duplicate entries in the frontend based on unique identifiers like studentIdNumber
          const uniqueApplicants = data.reduce((acc, applicant) => {
            const found = acc.find(a => a.studentIdNumber === applicant.studentIdNumber && a.date === applicant.date && a.time === applicant.time && a.email === applicant.email);
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
        <ApplicantList />
    </ApplicantsContext.Provider>
  );
};

export default CheckupApplicantList;