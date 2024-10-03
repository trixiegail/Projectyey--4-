import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const localizer = momentLocalizer(moment);

const BookingPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch events from the backend
    fetch('http://localhost:8080/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  // Handle clicking on an event (time slot)
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle opening the reservation confirmation dialog
  const handleReserve = () => {
    setIsDialogOpen(true);
  };

  // Handle confirming the reservation
  const confirmReservation = () => {
    // Implement reservation logic here, such as sending a request to the backend
    console.log('Reservation confirmed for:', selectedEvent);

    // Close both the dialog and the modal
    setIsDialogOpen(false);
    handleCloseModal();
  };

  // Handle closing the reservation confirmation dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <h2>Booking Calendar</h2>
      <div style={{ padding: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month', 'week', 'day']}
          defaultView="month"
          selectable
          onSelectEvent={handleSelectEvent} // Set the click handler
        />
      </div>

      {/* Modal for displaying event details */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedEvent && (
            <div>
              <Typography id="event-modal-title" variant="h6" component="h2">
                {selectedEvent.title}
              </Typography>
              <Typography id="event-modal-description" sx={{ mt: 2 }}>
                Start: {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm A')}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                End: {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm A')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReserve} // Open confirmation dialog
                sx={{ mt: 2, mr: 2 }}
              >
                Reserve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      {/* Confirmation dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to reserve the appointment for {selectedEvent?.title} on{' '}
            {moment(selectedEvent?.start).format('MMMM Do YYYY, h:mm A')}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmReservation} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;
