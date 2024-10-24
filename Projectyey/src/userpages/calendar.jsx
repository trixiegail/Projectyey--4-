import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Studfooter from '../components/Studfooter';
import Studnav from '../components/Studnav';
import Modal from 'react-modal';
import { Box, Typography, Button } from '@mui/material';
import './cancel.css'

const localizer = momentLocalizer(moment);

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    animation: 'fadeInOverlay 0.3s ease-in-out',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    zIndex: 1000,
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    border: 'none',
    animation: 'fadeInModal 0.3s ease-in-out',
  },
};

const App = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentData, setStudentData] = useState({});
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null); 
  const [reservedEvent, setReservedEvent] = useState(null);
  const [openCancelConfirmModal, setOpenCancelConfirmModal] = useState(false); 

  useEffect(() => {
    const studentName = localStorage.getItem('studentName');
    const studentIdNumber = localStorage.getItem('studentIdNumber'); 

    // Debugging logs to check values
    console.log('Fetched studentName:', studentName); 
    console.log('Fetched studentIdNumber:', studentIdNumber);

}, []);

  useEffect(() => {
    const now = new Date();

    fetch('http://localhost:8080/api/events')
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: event.isBooked || new Date(event.end) < now ? 'Unavailable' : event.type,
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  // Only open modal for "Available" events
  const handleEventClick = (event) => {
    if (event.type === 'Available') {
      setSelectedEvent(event);
      setModalOpen(true);
    } else {
      console.log('Event is not available, modal will not open.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const handleReserve = async () => {
    const studentName = localStorage.getItem('studentName');
    const studentIdNumber = localStorage.getItem('studentIdNumber');
  
    if (!studentName) {
      alert("You need to log in to reserve a slot.");
      navigate('/login-student');
      return;
    }
  
    try {
      // Fetch student data using studentIdNumber
      const response = await fetch(`http://localhost:8080/student/students/${studentIdNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
  
      const studentData = await response.json();

      // Fetch the student's existing reservations
      const reservationCheckResponse = await fetch(`http://localhost:8080/api/reservations?studentId=${studentIdNumber}`);
      const reservations = await reservationCheckResponse.json();

      if (reservations.length > 0) {
        setLimitModalOpen(true);
        return; 
      }
  
  
      // Create the reservation request with fetched data
      const reservationRequest = {
        studentIdNumber: studentData.idNumber,
        fullName: `${studentData.firstname} ${studentData.lastname}`,
        department: studentData.department, // Fetched from student data
        program: studentData.program, // Fetched from student data
        yearLevel: studentData.yearLevel, // Fetched from student data
        date: moment(selectedEvent.start).format('YYYY-MM-DD'),
        time: `${moment(selectedEvent.start).format('h:mm A')} - ${moment(selectedEvent.end).format('h:mm A')}`,
      };
  
      console.log('Reservation Request:', reservationRequest);
  
      // Post reservation
      const reserveResponse = await fetch('http://localhost:8080/api/reservations/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationRequest),
      });
  
      if (!reserveResponse.ok) {
        const errorData = await reserveResponse.json();
        throw new Error(errorData.error); 
      }
  
      const data = await reserveResponse.json();
      console.log('Reservation successful:', data.message);
      setModalOpen(false); 
      setSuccessModalOpen(true);  

      setReservationDetails({
        date: moment(selectedEvent.start).format('MMMM Do YYYY'),
        time: `${moment(selectedEvent.start).format('h:mm A')} - ${moment(selectedEvent.end).format('h:mm A')}`,
        // status: 'Reserved', // will update function later
      });
  
     // Update the event status on the backend
     await fetch(`http://localhost:8080/api/events/book/${selectedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    // Update the event list to mark the event as unavailable
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, type: 'Unavailable' } // Set to 'Unavailable'
          : event
      )
    );
  
    } catch (error) {
      console.error('Error reserving slot:', error.message || error);
      setModalOpen(false); 
      setLimitModalOpen(true);  
    }
  };


  

  const SuccessModal = () => {
    if (!successModalOpen) return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50 " >
        <div ref={wrapperRef} className="bg-white py-10 px-10 rounded-xl">
          <h2 className="text-xl font-bold text-center">Yeyy Reservation Successful!</h2>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="contained" style={{ backgroundColor: '#F7C301' }} onClick={closeSuccessModal}>
              Close
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };
  


  const ModalComponent = () => {
    if (!modalOpen || !selectedEvent) return null;

    const eventDate = moment(selectedEvent.start).format('MMMM Do YYYY');
    const eventTime = `${moment(selectedEvent.start).format('h:mm A')} - ${moment(selectedEvent.end).format('h:mm A')}`;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50 " >
        <div ref={wrapperRef} className="bg-white py-10 px-10 rounded-xl">
          <h2 className="text-xl font-bold text-center">Confirm Reservation</h2>
          <p className="mt-2 text-center">Are you sure you want to reserve this slot?</p>
          <p className="mt-2 text-center">
            <strong>Date:</strong> {eventDate}
          </p>
          <p className="mt-2 text-center">
            <strong>Time:</strong> {eventTime}
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Button 
            variant="contained" style={{ backgroundColor: '#88343B' }} onClick={closeModal} >
              Cancel
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#F7C301' }} onClick={handleReserve}>
              Confirm
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#add8e6',
      borderRadius: '5px',
      border: 'none',
      height: 'auto', 
      whiteSpace: 'normal',
      lineHeight: '25px',
      margin: 'auto', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom:'1px',
    };

    if (event.type === 'Unavailable' || event.type === 'Holiday') {
      style.backgroundColor = event.type === 'Unavailable' ? '#B0BEC5' : '#cc9999';
      style.color = '#fff';
      style.pointerEvents = 'none';
    } else if (event.type === 'Available') {
      style.backgroundColor = '#FDE74C';
    }

    return { style };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const LimitModal = () => {
    if (!limitModalOpen) return null;
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50 " >
        <div ref={wrapperRef} className="bg-white py-10 px-10 rounded-xl">
          <h2 className="text-xl font-bold text-center">Reservation Limit Reached</h2>
          <p className="mt-2 text-center">You are limited to 1 available reservation slot only!</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="contained" style={{ backgroundColor: '#90242c' }} onClick={() => setLimitModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

   // Fetch student data and reserved event
   useEffect(() => {
    const fetchReservedEvent = async () => {
      const studentIdNumber = localStorage.getItem('studentIdNumber'); // Retrieve student ID from localStorage
      console.log("Fetched studentIdNumber:", studentIdNumber); // Debugging
      
      if (studentIdNumber) {
        try {
          // Fetch the reservation from the backend
          const response = await fetch(`http://localhost:8080/api/reservations/reservations/${studentIdNumber}`);
          if (response.ok) {
            const reservationData = await response.json();
            console.log("Fetched reservation data:", reservationData); // Debugging
  
            if (reservationData && reservationData.length > 0) {
              const latestReservation = reservationData[0]; // Assuming the latest reservation
              console.log("Latest Reservation ID:", latestReservation.id); // Debugging
  
              // Set reserved event with the correct field names
              setReservedEvent({
                id: latestReservation.id, // Ensure this matches what you're checking in handleCancelReservation
                eventId: latestReservation.event.id, // Include event ID to make it available again
                date: moment(latestReservation.event.start).format('MMMM Do YYYY'),
                time: `${moment(latestReservation.event.start).format('h:mm A')} - ${moment(latestReservation.event.end).format('h:mm A')}`,
                // status: 'Reserved'   // will update function later
              });
            } else {
              console.log('No reservation found for the student.');
            }
          } else {
            console.error('Failed to fetch reservation details.');
          }
        } catch (error) {
          console.error('Error fetching reservation details:', error);
        }
      }
    };
  
    fetchReservedEvent(); // Call the function on mount
  }, []);
  
  


  const handleCancelReservation = async () => {
    console.log('Reserved Event:', reservedEvent); // Debugging the reservation data
  
    if (reservedEvent && reservedEvent.id) {
      try {
        // DELETE request to cancel the reservation using reservation ID
        await fetch(`http://localhost:8080/api/reservations/delete/${reservedEvent.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
  
        // Clear the reserved event from state
        setReservedEvent(null);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Failed to cancel the reservation.');
      }
    } else {
      console.error('No reservation ID found');
      alert('No reservation to cancel.');
    }
  };
///////////////////////////////////////
  const CancelConfirmationModal = () => {
    if (!openCancelConfirmModal) return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50">
        <div ref={wrapperRef} className="bg-white py-10 px-10 rounded-xl">
          <h2 className="text-xl font-bold text-center">Confirm Cancellation</h2>
          <p className="mt-2 text-center">Are you sure you want to cancel your reservation?</p>
          <div className="flex items-center justify-center space-x-4 mt-4 ">
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#88343B' }} 
              onClick={() => setOpenCancelConfirmModal(false)} // Close the modal
            >
              No, Keep Reservation
            </Button>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#F7C301' }} 
              onClick={() => {
                handleCancelReservation(); // Call the existing cancellation function
                setOpenCancelConfirmModal(false); // Close the modal
              }}
            >
              Yes, Cancel Reservation
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
};

  

  return (
    <div>
      <Studnav />
      <ModalComponent />
      <SuccessModal />
      <LimitModal />
      <CancelConfirmationModal />

      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#88343B] sm:text-5xl">Choose an Appointment</h1>
        </div>

        {/* Reserved Event Display */}
        <div className="mx-auto max-w-xl mt-10 p-6 rounded-lg text-white" style={{ backgroundColor: '#88343b' }}>
          {reservedEvent ? (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Reserved Event Details
              </Typography>
              <Typography>
                <strong>Date:</strong> {reservedEvent.date} 
              </Typography>
              <Typography>
                <strong>Time:</strong> {reservedEvent.time}
              </Typography>
              {/* <Typography>
                <strong>Status:</strong> {reservedEvent.status}   
              </Typography> */}
              <Button
                variant="contained"
                style={{ marginTop: '20px', backgroundColor: '#88343B', marginLeft:'320px'}}
                onClick={() => setOpenCancelConfirmModal(true)}
              >
                Cancel Reservation
              </Button>
            </Box>
          ) : (
            <Typography>No reservation found for this student.</Typography>
          )}
        </div>
        


        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 rounded-lg text-black">
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              {/* Color Legend */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'black' }}>
                <Box sx={{ backgroundColor: '#FDE74C', width: 20, height: 20, mr: 1 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>Available Slot</Typography>
                <Box sx={{ backgroundColor: '#b8bcc4', width: 20, height: 20, mr: 1 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>Unavailable Slot</Typography>
                <Box sx={{ backgroundColor: '#cc9999', width: 20, height: 20, mr: 1 }} />
                <Typography variant="body2">Holiday</Typography>
              </Box>

              {/* Calendar */}
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ color: 'black', backgroundColor: 'white' }}
                selectable
                onSelectEvent={handleEventClick}
                views={['month', 'week', 'day']}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
              />
            </Box>
          </Box>
        </div>
      </div>

      <Studfooter />
    </div>
  );
};


export default App;
