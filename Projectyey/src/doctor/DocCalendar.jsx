import React, { useState, useEffect  } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, TextField, IconButton, Avatar, Switch, Button,
        Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
        RadioGroup, FormControlLabel, Radio} from '@mui/material';
import Sidebar from '../components/DocSidebar';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

 
const localizer = momentLocalizer(moment);
 
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    zIndex: 1000, 
  },
};
 
const DocCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState('');
  const [availability, setAvailability] = useState(true);
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);
  const [dayEvents, setDayEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [availableDays, setAvailableDays] = useState([]); 
  const [defaultTimeSlots, setDefaultTimeSlots] = useState([
    { startTime: '09:00', endTime: '10:00' },
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
  const [showModal, setShowModal] = useState(false);
  
  const [selectedEventType, setSelectedEventType] = useState('Available'); 


  useEffect(() => {
    // Fetch events from the backend
    fetch('http://localhost:8080/api/events')
      .then(response => response.json())
      .then(data => {
        const now = new Date(); // Current date and time
  
        // Update events: set type to "Unavailable" if the event is in the past
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: new Date(event.end) < now ? 'Unavailable' : event.type, // Set to "Unavailable" if in the past
        }));
  
        setEvents(formattedEvents);
        console.log('Fetched Events:', formattedEvents); // Log events to verify
      })
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
      setTimeSlots([{
        startTime: moment(clickedEvent.start).format('h:mm a'),
        endTime: moment(clickedEvent.end).format('h:mm a'),
      }]);
    } else {
      setEditEvent(null);
      setNote('');
      setTimeSlots([{ startTime: '', endTime: '' }]);
    }

    setSelectedDate(start);
    setDayEvents(filteredEvents);
    setModalOpen(true);
  };

  const CustomEvent = ({ event }) => {
    const isDotText = event.title.toLowerCase().includes('.');
    
    return (
      <span style={{ color: isDotText ? 'transparent' : 'inherit' }}>
        {event.title}
      </span>
    );
  };
  

  const handleSave = () => {
    if (timeSlots[0].startTime && timeSlots[0].endTime && selectedDate) {
      const startTime = moment(timeSlots[0].startTime, 'h:mm a').toDate();
      const endTime = moment(timeSlots[0].endTime, 'h:mm a').toDate();
  
      const start = new Date(selectedDate); // Ensure 'start' is defined here
      start.setHours(startTime.getHours(), startTime.getMinutes());
  
      const end = new Date(selectedDate); // Ensure 'end' is defined here
      end.setHours(endTime.getHours(), endTime.getMinutes());
  
      const newEvent = {
        title: note || '.',
        start: start,
        end: end,
        isBooked: false,
        type: selectedEventType,
      };
  
      if (editEvent) {
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
  
  

  const handleEventTypeChange = (event) => {
    setSelectedEventType(event.target.value);
  };
  



  const handleCancel = () => {
    setEditEvent(null);
    setModalOpen(false);
  };

  const handleEditEvent = (event) => {
  setEditEvent(event);
  setNote(event.title);
  setSelectedEventType(event.type || 'Available'); 
  setTimeSlots([{
    startTime: moment(event.start).format('h:mm a'),
    endTime: moment(event.end).format('h:mm a'),
  }]);
  setModalOpen(true);
};


  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true); 
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
    const currentMonth = moment().month();
    const year = moment().year(); 
    let newEvents = [];
  
    for (let day = 1; day <= moment().daysInMonth(); day++) {
      const date = moment([year, currentMonth, day]);
  
      if (availableDays.includes(date.format('dddd'))) {
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
  
    setEvents([...events, ...newEvents]);
  };
  
const handleDayChange = (day) => {
  setAvailableDays((prevDays) =>
    prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
  );
};

const handleTimeSlotChange = (index, field, value) => {
  setDefaultTimeSlots((slots) =>
    slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
  );
};

const handleDaySelection = (day) => {
  setSelectedDays((prevDays) => 
    prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
  );
};

const handleMultiTimeSlotChange = (index, field, value) => {
  setMultiTimeSlots((slots) =>
    slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
  );
};

const addMultiTimeSlot = () => {
  setMultiTimeSlots([...multiTimeSlots, { startTime: '', endTime: '' }]);
};


const handleCreateMultipleEvents = () => {
  if (selectedDays.length === 0 || multiTimeSlots.some(slot => !slot.startTime || !slot.endTime)) {
    alert('Please select at least one day and provide valid time slots.');
    return;
  }

  openConfirmation();

  const newEvents = [];
  const currentMonth = moment().month(); 
  const year = moment().year(); 

  for (let day = 1; day <= moment().daysInMonth(); day++) {
    const date = moment([year, currentMonth, day]);

    if (selectedDays.includes(date.format('dddd'))) {
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
        return response.json();
      });
  });

  Promise.all(createEventPromises)
    .then(createdEvents => {
      setEvents([...events, ...createdEvents]);
      setSelectedDays([]);
      setMultiTimeSlots([{ startTime: '', endTime: '' }]);
    })
    .catch(error => console.error('Error creating events:', error));
};

const openConfirmation = () => {
  const selectedTimes = multiTimeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  const summary = `You have chosen to create events on: ${selectedDays.join(', ')} at the following times: ${selectedTimes}. Do you want to proceed?`;

  setEventSummary(summary);
  setConfirmOpen(true); 
};


const confirmEventCreation = () => {
  const newEvents = [];
  const currentMonth = moment().month(); 
  const year = moment().year(); 

  for (let day = 1; day <= moment().daysInMonth(); day++) {
    const date = moment([year, currentMonth, day]);

    if (selectedDays.includes(date.format('dddd'))) {
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
        return response.json(); 
      });
  });

  Promise.all(createEventPromises)
    .then(createdEvents => {
      setEvents([...events, ...createdEvents]);
      setSelectedDays([]);
      setMultiTimeSlots([{ startTime: '', endTime: '' }]);
      setConfirmOpen(false); 
    })
    .catch(error => console.error('Error creating events:', error));
};



  return (
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
      <Sidebar /> 
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }} style={{color:'#90343c'}}>Calendar</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search Here"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{ mr: 2 }}
            />
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar src="src/image/doctor-profile.png" alt="Profile" sx={{ width: 40, height: 40, mr: 1 }} />
              <Box>
                <Typography variant="body1">Dr. Maria Luz M. Lumayno</Typography>
                <Typography variant="body2" color="textSecondary">Practical Dentist</Typography>
              </Box>
            </Box>
          </Box>
        </Box>


         {/* Color Legend */}
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 , color: 'black' }}>
          <Box sx={{ backgroundColor: '#FDE74C ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>Available Slot</Typography>
          <Box sx={{ backgroundColor: '#B0BEC5 ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>Unavailable Slot</Typography>
          <Box sx={{ backgroundColor: '#FFB6C1 ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2">Holiday</Typography>
        </Box>


        <div>
      <Button onClick={() => setShowModal(true)} color="primary" variant="contained"
      style={{marginBottom:'10px', backgroundColor:'#88343B' }}>
      Select Days and Time Slots
      </Button>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm"  >
        <DialogTitle>Select Days and Time Slots</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: '20px', color: 'black' }}>
            <h4>Select Days for Multiple Appointments</h4>
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
            <br/>
            <h4>Set Time Slots for Selected Days</h4><br/>
            {multiTimeSlots.map((slot, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleMultiTimeSlotChange(index, 'startTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { step: 300 } }} 
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleMultiTimeSlotChange(index, 'endTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  style={{ marginLeft: '10px' }}
                  InputProps={{ inputProps: { step: 300 } }} 
                />
                <IconButton
                  onClick={() => removeMultiTimeSlot(index)}
                  aria-label="delete time slot"
                  color="secondary"
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteIcon style={{ color: 'maroon' }} />
                </IconButton>
              </div>
            ))}
            
            <Button onClick={addMultiTimeSlot} color="primary" variant="contained" style={{ marginTop: '10px', marginBottom: '20px', backgroundColor:'#88343B' }}>
              Add Time Slot
            </Button>
            
            <Button onClick={handleCreateMultipleEvents} color="primary" variant="contained" style={{ marginTop: '10px', marginLeft: '5px', marginBottom: '20px', backgroundColor:'#88343B'  }}>
              Create Available Slots
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
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

       
        {!modalOpen && (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800, color:'black', backgroundColor:'white' }}
            selectable
            onSelectSlot={handleSelectSlot}
            views={['month', 'week', 'day']}
            defaultView="month"
            step={30}
            timeslots={2}
            min={new Date(2024, 8, 10, 8, 0)}
            max={new Date(2024, 8, 10, 18, 0)}
            eventPropGetter={(event) => {
              const now = new Date();
              let style = {
                backgroundColor: '#add8e6',
                color: '#000', 
                borderRadius: '5px', 
                border: 'none', 
                padding: '2px 5px' 
              };
            
              if (new Date(event.end) < now) {
                style.backgroundColor = '#e6e6e6'; 
              } else if (event.type === 'Available') {
                style.backgroundColor = '#FDE74C';
              } else if (event.type === 'Holiday') {
                style.backgroundColor = '#ffc9d2';
              }
            
              return { style };
            }}

            components={{
              event: CustomEvent, 
            }}
          />
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
                      <DeleteIcon style={{ color: 'maroon' }} />
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
            label="Add Note (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
          />
          <div style={{ margin: '20px 0' }}>

          <RadioGroup value={selectedEventType} onChange={handleEventTypeChange}>
  <FormControlLabel value="Available" control={<Radio />} label="Available" />
  <FormControlLabel value="Holiday" control={<Radio />} label="Holiday" />
</RadioGroup>



        
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
      
      



<div style={{ marginBottom: '20px', marginLeft: '30px'}}>
 {defaultTimeSlots.map((slot, index) => (
    <div key={index} style={{ marginBottom: '15px' }}>

         

          </div>
          
        ))}
        
      </div>
    </Box>
    </Box>

  );
};
 
export default DocCalendar;