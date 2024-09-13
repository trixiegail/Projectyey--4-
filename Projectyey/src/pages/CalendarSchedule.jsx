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
    },
    {
      title: 'Afternoon Appointment',
      start: new Date(2024, 8, 10, 13, 0),
      end: new Date(2024, 8, 10, 14, 0),
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState('');
  const [availability, setAvailability] = useState(true);
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);
  const [dayEvents, setDayEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
 
  const handleSelectSlot = ({ start, end }) => {
    const filteredEvents = events.filter(
      (event) => moment(event.start).isSame(start, 'day')
    );
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
      const newEvent = {
        title: note,
        start: new Date(selectedDate.setHours(startTime.getHours(), startTime.getMinutes())),
        end: new Date(selectedDate.setHours(endTime.getHours(), endTime.getMinutes())),
      };
      if (editEvent) {
        // Update existing event
        setEvents(events.map(e => e === editEvent ? newEvent : e));
      } else {
        // Add new event
        setEvents([...events, newEvent]);
      }
      setDayEvents([...dayEvents, newEvent]);
      setEditEvent(null); // Clear edit event after saving
    }
    setModalOpen(false);
  };
 
  const handleCancel = () => {
    setEditEvent(null); // Clear edit event when canceling
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
    setEvents(events.filter(e => e !== event));
    setDayEvents(dayEvents.filter(e => e !== event));
    setModalOpen(false);
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
    </div>
  );
};
 
export default CalendarSchedule;