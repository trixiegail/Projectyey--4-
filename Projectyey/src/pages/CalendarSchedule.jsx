import React, { useState } from 'react';
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icon for rescheduling
import DoneIcon from '@mui/icons-material/Done'; // Icon for marking event as done

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
  const [events, setEvents] = useState([
    {
      title: 'Morning Appointment',
      start: new Date(2024, 8, 10, 9, 0),
      end: new Date(2024, 8, 10, 10, 0),
      done: false, // Track if the event is done
    },
    {
      title: 'Afternoon Appointment',
      start: new Date(2024, 8, 10, 13, 0),
      end: new Date(2024, 8, 10, 14, 0),
      done: false, // Track if the event is done
    },
  ]);

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
      setEditEvent(clickedEvent);
      setNote(clickedEvent.title);
      setTimeSlots([
        {
          startTime: moment(clickedEvent.start).format('h:mm a'),
          endTime: moment(clickedEvent.end).format('h:mm a'),
        },
      ]);
    } else {
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
      const newEvent = {
        title: note,
        start: new Date(
          selectedDate.setHours(startTime.getHours(), startTime.getMinutes())
        ),
        end: new Date(
          selectedDate.setHours(endTime.getHours(), endTime.getMinutes())
        ),
        done: editEvent ? editEvent.done : false, // Preserve done status if editing
      };

      if (editEvent) {
        setEvents(events.map(e => (e === editEvent ? newEvent : e)));
      } else {
        setEvents([...events, newEvent]);
      }
      setDayEvents([...dayEvents, newEvent]);
      setEditEvent(null);
      setRescheduleEvent(null); 
    }
    setModalOpen(false);
  };

  const handleReschedule = () => {
    if (newDate && timeSlots[0].startTime && timeSlots[0].endTime) {
      const startTime = moment(timeSlots[0].startTime, 'h:mm a').toDate();
      const endTime = moment(timeSlots[0].endTime, 'h:mm a').toDate();

      const rescheduledEvent = {
        ...rescheduleEvent,
        start: new Date(newDate.setHours(startTime.getHours(), startTime.getMinutes())),
        end: new Date(newDate.setHours(endTime.getHours(), endTime.getMinutes())),
      };

      setEvents(events.map(e => (e === rescheduleEvent ? rescheduledEvent : e)));
      setRescheduleEvent(null);
      setNewDate(null);
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setEditEvent(null);
    setRescheduleEvent(null);
    setModalOpen(false);
  };

  const handleEditEvent = event => {
    setEditEvent(event);
    setNote(event.title);
    setTimeSlots([
      {
        startTime: moment(event.start).format('h:mm a'),
        endTime: moment(event.end).format('h:mm a'),
      },
    ]);
    setModalOpen(true);
  };

  const handleDeleteEvent = event => {
    setEvents(events.filter(e => e !== event));
    setDayEvents(dayEvents.filter(e => e !== event));
    setModalOpen(false);
  };

  const handleRescheduleEvent = event => {
    setRescheduleEvent(event);
    setNote(event.title);
    setTimeSlots([
      {
        startTime: moment(event.start).format('h:mm a'),
        endTime: moment(event.end).format('h:mm a'),
      },
    ]);
    setModalOpen(true);
  };

  const handleMarkAsDone = event => {
    setEvents(events.map(e => (e === event ? { ...e, done: true } : e)));
    setDayEvents(dayEvents.map(e => (e === event ? { ...e, done: true } : e)));
  };

  return (
    <div>
      <NavNurseDentist />
      <div className="calendar-container" style={{ padding: '20px', color:'black' }}>
        <h2>Calendar Schedule</h2>
       
        {/* Conditionally render Calendar only when modal is not open */}
        {!modalOpen && (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, color:'black' }}
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
        >
          <IconButton
            onClick={handleCancel}
            aria-label="close"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <CloseIcon />
          </IconButton>
          <h3>{rescheduleEvent ? 'Reschedule Event' : 'Agenda'} for {moment(selectedDate).format('MMMM Do YYYY')}</h3>

          <div>
            {dayEvents.length > 0 && !rescheduleEvent ? (
              <ul>
                {dayEvents.map((event, index) => (
                  <li key={index} className={event.done ? 'event-done' : ''}>
                    <strong>{event.title}</strong> ({moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')})
                    {!event.done && (
                      <IconButton
                        onClick={() => handleMarkAsDone(event)}
                        aria-label="done"
                        style={{ marginLeft: '10px' }}
                      >
                        <DoneIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleEditEvent(event)}
                      aria-label="edit"
                      style={{ marginLeft: '10px' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEvent(event)} aria-label="delete" color="error" style={{ marginLeft: '10px' }}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleRescheduleEvent(event)}
                      aria-label="reschedule"
                      style={{ marginLeft: '10px' }}
                    >
                      <CalendarTodayIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedules for this day.</p>
            )}
          </div>

          {rescheduleEvent ? (
            <div>
              <TextField
                label="New Date"
                type="date"
                value={moment(newDate).format('YYYY-MM-DD')}
                onChange={e => setNewDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start Time"
                type="time"
                value={timeSlots[0].startTime}
                onChange={e => setTimeSlots([{ ...timeSlots[0], startTime: e.target.value }])}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="End Time"
                type="time"
                value={timeSlots[0].endTime}
                onChange={e => setTimeSlots([{ ...timeSlots[0], endTime: e.target.value }])}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleReschedule}
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Save Rescheduled Event
              </Button>
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