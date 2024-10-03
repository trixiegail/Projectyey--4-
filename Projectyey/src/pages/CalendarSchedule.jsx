import React, { useState, useEffect  } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarSchedule.css';
import NavNurseDentist from '../components/NavNurseDentist';
import Modal from 'react-modal';
import { Switch, TextField, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
 
const localizer = momentLocalizer(moment);
 
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background with more opacity
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    zIndex: 1000, // Ensure the modal is on top of everything else
  },
};
 
const CalendarSchedule = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState('');
  const [availability, setAvailability] = useState(true);
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);
  const [dayEvents, setDayEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [availableDays, setAvailableDays] = useState([]); // Added missing state
  const [defaultTimeSlots, setDefaultTimeSlots] = useState([
    { startTime: '09:00', endTime: '10:00' }, // Added missing default time slots
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [multiTimeSlots, setMultiTimeSlots] = useState([{ startTime: '', endTime: '' }]);
  const [eventSummary, setEventSummary] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const removeMultiTimeSlot = (index) => {
    setMultiTimeSlots((slots) => slots.filter((_, i) => i !== index));
  };
  



  useEffect(() => {
    // Fetch events from the backend
    fetch('http://localhost:8080/api/events')
      .then(response => response.json())
      .then(data => setEvents(data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    const filteredEvents = events.filter(event => moment(event.start).isSame(start, 'day'));
    const clickedEvent = filteredEvents.find(event =>
      moment(start).isBetween(event.start, event.end, null, '[)')
    );

    if (clickedEvent) {
      // If an event exists at the clicked time slot, set it for editing
      setEditEvent(clickedEvent);
      setNote(clickedEvent.title);
      setTimeSlots([{
        startTime: moment(clickedEvent.start).format('h:mm a'),
        endTime: moment(clickedEvent.end).format('h:mm a'),
      }]);
    } else {
      // Otherwise, prepare to add a new event
      setEditEvent(null);
      setNote('');
      setTimeSlots([{ startTime: '', endTime: '' }]);
    }

    setSelectedDate(start);
    setDayEvents(filteredEvents);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (note && timeSlots[0].startTime && timeSlots[0].endTime) {
      const startTime = moment(timeSlots[0].startTime, 'h:mm a').toDate();
      const endTime = moment(timeSlots[0].endTime, 'h:mm a').toDate();

      const start = new Date(selectedDate);
      start.setHours(startTime.getHours(), startTime.getMinutes());

      const end = new Date(selectedDate);
      end.setHours(endTime.getHours(), endTime.getMinutes());

      const newEvent = {
        title: note,
        start: start,
        end: end,
        isBooked: false,
      };

      if (editEvent) {
        // Update existing event
        fetch(`http://localhost:8080/api/events/${editEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        })
          .then(response => response.json())
          .then(data => {
            setEvents(events.map(e => (e.id === editEvent.id ? data : e)));
            setDayEvents(dayEvents.map(e => (e.id === editEvent.id ? data : e)));
            setEditEvent(null);
            setModalOpen(false);
          })
          .catch(error => console.error('Error updating event:', error));
      } else {
        // Add new event
        fetch('http://localhost:8080/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        })
          .then(response => response.json())
          .then(data => {
            setEvents([...events, data]);
            setDayEvents([...dayEvents, data]);
            setModalOpen(false);
          })
          .catch(error => console.error('Error saving event:', error));
      }
    } else {
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setEditEvent(null);
    setModalOpen(false);
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setNote(event.title);
    setTimeSlots([{
      startTime: moment(event.start).format('h:mm a'),
      endTime: moment(event.end).format('h:mm a'),
    }]);
    setModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true); // Open the confirmation modal
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      fetch(`http://localhost:8080/api/events/${eventToDelete.id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`Failed to delete the event: ${text}`);
            });
          }
          // Remove the event from the local state
          setEvents(events.filter(e => e.id !== eventToDelete.id));
          setDayEvents(dayEvents.filter(e => e.id !== eventToDelete.id));
          setEventToDelete(null);
          setModalOpen(false);
          setConfirmOpen(false);
        })
        .catch(error => console.error('Error deleting event:', error));
    }
  };
  
  

  const setMonthAvailability = () => {
    const currentMonth = moment().month(); // Get the current month (0-based)
    const year = moment().year(); // Get the current year
    let newEvents = [];
  
    // Iterate through each day of the current month
    for (let day = 1; day <= moment().daysInMonth(); day++) {
      const date = moment([year, currentMonth, day]);
  
      // Check if the date matches any of the selected available days
      if (availableDays.includes(date.format('dddd'))) {
        // Create events for each selected time slot
        defaultTimeSlots.forEach((slot) => {
          const startTime = moment(slot.startTime, 'HH:mm').toDate();
          const endTime = moment(slot.endTime, 'HH:mm').toDate();
  
          newEvents.push({
            title: 'Available',
            start: new Date(date.year(), date.month(), date.date(), startTime.getHours(), startTime.getMinutes()),
            end: new Date(date.year(), date.month(), date.date(), endTime.getHours(), endTime.getMinutes()),
            isBooked: false,
          });
        });
      }
    }
  
    // Update events state
    setEvents([...events, ...newEvents]);
  
    // Optionally, you can send these new events to the backend here
  };
  

  // Toggle the selected days
const handleDayChange = (day) => {
  setAvailableDays((prevDays) =>
    prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
  );
};

// Update the default time slots
const handleTimeSlotChange = (index, field, value) => {
  setDefaultTimeSlots((slots) =>
    slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
  );
};

// Toggle day selection for multiple event creation
const handleDaySelection = (day) => {
  setSelectedDays((prevDays) => 
    prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
  );
};

// Update time slots for multiple event creation
const handleMultiTimeSlotChange = (index, field, value) => {
  setMultiTimeSlots((slots) =>
    slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
  );
};

// Add a new time slot for multiple event creation
const addMultiTimeSlot = () => {
  setMultiTimeSlots([...multiTimeSlots, { startTime: '', endTime: '' }]);
};


const handleCreateMultipleEvents = () => {
  // Check if at least one day and one time slot is selected
  if (selectedDays.length === 0 || multiTimeSlots.some(slot => !slot.startTime || !slot.endTime)) {
    alert('Please select at least one day and provide valid time slots.');
    return;
  }

  openConfirmation();

  const newEvents = [];
  const currentMonth = moment().month(); // Current month (0-based, January is 0)
  const year = moment().year(); // Current year

  // Iterate over each day of the current month
  for (let day = 1; day <= moment().daysInMonth(); day++) {
    const date = moment([year, currentMonth, day]);

    // Check if the current date is one of the selected days (e.g., Monday, Tuesday, etc.)
    if (selectedDays.includes(date.format('dddd'))) {
      // Create events for each selected time slot
      multiTimeSlots.forEach((slot) => {
        const start = date.clone().set({
          hour: moment(slot.startTime, 'HH:mm').hour(),
          minute: moment(slot.startTime, 'HH:mm').minute(),
        }).toDate();

        const end = date.clone().set({
          hour: moment(slot.endTime, 'HH:mm').hour(),
          minute: moment(slot.endTime, 'HH:mm').minute(),
        }).toDate();

        newEvents.push({
          title: 'Available Slot',
          start: start,
          end: end,
        });
      });
    }
  }

  // Save each event to the backend individually
  const createEventPromises = newEvents.map(event => {
    return fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Failed to create event: ${text}`);
          });
        }
        return response.json(); // Return the created event
      });
  });

  // Wait for all the events to be created before updating the state
  Promise.all(createEventPromises)
    .then(createdEvents => {
      setEvents([...events, ...createdEvents]);
      setSelectedDays([]);
      setMultiTimeSlots([{ startTime: '', endTime: '' }]);
    })
    .catch(error => console.error('Error creating events:', error));
};

const openConfirmation = () => {
  // Create a summary of the selected days and time slots for display
  const selectedTimes = multiTimeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  const summary = `You have chosen to create events on: ${selectedDays.join(', ')} at the following times: ${selectedTimes}. Do you want to proceed?`;

  setEventSummary(summary); // Set the summary for the modal
  setConfirmOpen(true); // Open the confirmation modal
};


const confirmEventCreation = () => {
  const newEvents = [];
  const currentMonth = moment().month(); // Current month (0-based, January is 0)
  const year = moment().year(); // Current year

  // Iterate over each day of the current month
  for (let day = 1; day <= moment().daysInMonth(); day++) {
    const date = moment([year, currentMonth, day]);

    // Check if the current date is one of the selected days (e.g., Monday, Tuesday, etc.)
    if (selectedDays.includes(date.format('dddd'))) {
      // Create events for each selected time slot
      multiTimeSlots.forEach((slot) => {
        const start = date.clone().set({
          hour: moment(slot.startTime, 'HH:mm').hour(),
          minute: moment(slot.startTime, 'HH:mm').minute(),
        }).toDate();

        const end = date.clone().set({
          hour: moment(slot.endTime, 'HH:mm').hour(),
          minute: moment(slot.endTime, 'HH:mm').minute(),
        }).toDate();

        newEvents.push({
          title: 'Available Slot',
          start: start,
          end: end,
        });
      });
    }
  }

  // Save each event to the backend individually
  const createEventPromises = newEvents.map(event => {
    return fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Failed to create event: ${text}`);
          });
        }
        return response.json(); // Return the created event
      });
  });

  // Wait for all the events to be created before updating the state
  Promise.all(createEventPromises)
    .then(createdEvents => {
      setEvents([...events, ...createdEvents]);
      setSelectedDays([]);
      setMultiTimeSlots([{ startTime: '', endTime: '' }]);
      setConfirmOpen(false); // Close the confirmation modal
    })
    .catch(error => console.error('Error creating events:', error));
};





 
  return (
    <div>
      <NavNurseDentist />
      <div className="calendar-container" style={{ padding: '20px' }}>
        <h2>Calendar Schedule</h2>
       
        {/* Conditionally render Calendar only when modal is not open */}
        {!modalOpen && (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            views={['month', 'week', 'day']}
            defaultView="month"
            step={30}
            timeslots={2}
            min={new Date(2024, 8, 10, 8, 0)}
            max={new Date(2024, 8, 10, 18, 0)}
          />
        )}
       
        {/* Conditionally render any other sections or components */}
        {!modalOpen && (
          <div className="set-agenda">
            {/* Replace this with actual "Set Agenda" content if applicable */}
            <p>Set Agenda content goes here.</p>
          </div>
        )}
 
        <Modal
          isOpen={modalOpen}
          onRequestClose={handleCancel}
          style={modalStyles}
          contentLabel="Manage Schedule"
          appElement={document.getElementById('root')}
        >
          <IconButton
            onClick={handleCancel}
            aria-label="close"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <CloseIcon />
          </IconButton>
          <h3>Agenda for {moment(selectedDate).format('MMMM Do YYYY')}</h3>
         
          <div>
            {dayEvents.length > 0 ? (
              <ul>
                {dayEvents.map((event, index) => (
                  <li key={index}>
                    <strong>{event.title}</strong> ({moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')})
                    <IconButton onClick={() => handleEditEvent(event)} aria-label="edit" style={{ marginLeft: '10px' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEvent(event)} aria-label="delete" color="error" style={{ marginLeft: '10px' }}>
                      <DeleteIcon />
                    </IconButton>
                    <Dialog
                      open={deleteConfirmOpen}
                      onClose={() => setDeleteConfirmOpen(false)}
                    >
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete the event: "{eventToDelete?.title}"?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={confirmDeleteEvent} color="secondary">
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>

                  </li>
                ))}
              </ul>
            ) : (
              <p>No events for this day.</p>
            )}
          </div>
 
          <TextField
            label="Add Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
          />
          <div style={{ margin: '20px 0' }}>
            <Switch
              checked={availability}
              onChange={() => setAvailability(!availability)}
              color="primary"
            />
            {availability ? 'Available' : 'Unavailable'}
          </div>
 
          <h4>Time Slots</h4>
          <br></br>
          {timeSlots.map((slot, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <TextField
                label="Start Time"
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  setTimeSlots(
                    timeSlots.map((s, i) =>
                      i === index ? { ...s, startTime: e.target.value } : s
                    )
                  )
                }
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ inputProps: { step: 300 } }} // Adjust step for better time granularity
              />
              <TextField
                label="End Time"
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  setTimeSlots(
                    timeSlots.map((s, i) =>
                      i === index ? { ...s, endTime: e.target.value } : s
                    )
                  )
                }
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginLeft: '10px' }}
                InputProps={{ inputProps: { step: 300 } }} // Adjust step for better time granularity
              />
            </div>
          ))}
 
          <Button onClick={handleSave} color="primary" variant="contained" style={{ marginRight: '10px' }}>
            {editEvent ? 'Update' : 'Save'}
          </Button>
          <Button onClick={handleCancel} color="secondary" variant="contained">
            Cancel
          </Button>
        </Modal>
      </div>
      

  

      <div style={{ marginBottom: '20px', marginLeft: '50px'  }}>
  <h4>Select Days for Multiple Events</h4>
  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
    <div key={day}>
      <Switch
        checked={selectedDays.includes(day)}
        onChange={() => handleDaySelection(day)}
        color="primary"
      />
      {day}
    </div>
  ))}
  
  <h4>Set Time Slots for Selected Days</h4>
  {multiTimeSlots.map((slot, index) => (
    <div key={index} style={{ marginBottom: '15px' }}>
      <TextField
        label="Start Time"
        type="time"
        value={slot.startTime}
        onChange={(e) => handleMultiTimeSlotChange(index, 'startTime', e.target.value)}
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { step: 300 } }} // Adjust step for granularity
      />
      <TextField
        label="End Time"
        type="time"
        value={slot.endTime}
        onChange={(e) => handleMultiTimeSlotChange(index, 'endTime', e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginLeft: '10px' }}
        InputProps={{ inputProps: { step: 300 } }} // Adjust step for granularity
      />
      <IconButton
        onClick={() => removeMultiTimeSlot(index)}
        aria-label="delete time slot"
        color="secondary"
        style={{ marginLeft: '10px' }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  ))}
  
  <Button onClick={addMultiTimeSlot} color="primary" variant="contained" style={{ marginTop: '10px', marginBottom: '20px' }}>
    Add Time Slot
  </Button>
  
  <Button onClick={handleCreateMultipleEvents} color="primary" variant="contained" style={{ marginTop: '10px', marginLeft: '5px', marginBottom: '20px' }}>
    Create Available Slots
  </Button>

    <Dialog
    open={confirmOpen}
    onClose={() => setConfirmOpen(false)}
  >
    <DialogTitle>Confirm Event Creation</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {eventSummary}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setConfirmOpen(false)} color="primary">
        Cancel
      </Button>
      <Button onClick={confirmEventCreation} color="secondary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>

</div>



     


<div style={{ marginBottom: '20px', marginLeft: '30px' }}>
 {defaultTimeSlots.map((slot, index) => (
    <div key={index} style={{ marginBottom: '15px' }}>
    

          



         

          </div>
          
        ))}
      </div>
    </div>
  );
};
 
export default CalendarSchedule;