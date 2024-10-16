import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReactDOM from 'react-dom';
import Studfooter from '../components/Studfooter';
import Studnav from '../components/Studnav';
import Modal from 'react-modal';
import { Box, Typography, Button } from '@mui/material';

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const wrapperRef = useRef(null); // Ref for modal click outside detection

  // Fetch events on initial load
  useEffect(() => {
    const now = new Date();

    fetch('http://localhost:8080/api/events')
      .then(response => response.json())
      .then(data => {
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: new Date(event.end) < now ? 'Unavailable' : event.type,
        }));
        setEvents(formattedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
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

  // Render the modal only for "Available" events
  const ModalComponent = () => {
    if (!modalOpen || !selectedEvent) return null;

    const eventDate = moment(selectedEvent.start).format('MMMM Do YYYY');
    const eventTime = `${moment(selectedEvent.start).format('h:mm A')} - ${moment(selectedEvent.end).format('h:mm A')}`;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50">
        <div ref={wrapperRef} style={modalStyles.content}>
          <h2 className="text-xl font-bold text-center">Confirm Reservation</h2>
          <p className="mt-2 text-center">Are you sure you want to reserve this slot?</p>
          <p className="mt-2 text-center">
            <strong>Date:</strong> {eventDate}
          </p>
          <p className="mt-2 text-center">
            <strong>Time:</strong> {eventTime}
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="contained" style={{ backgroundColor: '#88343B' }} onClick={closeModal}>
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

  const handleReserve = () => {
    // Handle reservation logic here
    const updatedEvent = { ...selectedEvent, title: `Reserved Slot on ${moment(selectedEvent.start).format('MMMM Do YYYY')}` };

    fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    })
    .then(response => response.json())
    .then(updatedEvent => {
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      setModalOpen(false);
    })
    .catch(error => console.error('Error updating event:', error));
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#add8e6',
      borderRadius: '5px',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (event.type === 'Unavailable' || event.type === 'Holiday') {
      style.backgroundColor = event.type === 'Unavailable' ? '#B0BEC5' : '#cc9999';
      style.color = '#fff';
      style.pointerEvents = 'none'; // Disable pointer events for unavailable/holiday events
    } else if (event.type === 'Available') {
      style.backgroundColor = '#FDE74C';
    }

    return { style };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeModal(); // Close modal when clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Studnav />
      <ModalComponent />

      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#88343B] sm:text-5xl">Choose an Appointment</h1>
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
