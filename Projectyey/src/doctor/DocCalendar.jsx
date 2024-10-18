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
import DocNavBar from '../components/DocNavBar';
 
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
    // padding: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    border: 'none',
    animation: 'fadeInModal 0.3s ease-in-out',
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
    const now = new Date(); 

    fetch('http://localhost:8080/api/events')
      .then(response => response.json())
      .then(data => {
        const pastEvents = data.filter(event => new Date(event.end) < now); 
        const upcomingEvents = data.filter(event => new Date(event.end) >= now); 

        pastEvents.forEach(event => {
          fetch(`http://localhost:8080/api/events/${event.id}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (!response.ok) {
                return response.text().then((text) => {
                  throw new Error(`Failed to delete the event: ${text}`);
                });
              }
              console.log(`Deleted past event: ${event.title}`);
            })
            .catch(error => console.error('Error deleting event:', error));
        });
        
  
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: event.isBooked || new Date(event.end) < now ? 'Unavailable' : event.type, 
        }));
  
        setEvents(formattedEvents);
        setEventHeightVariables(); 
        console.log('Fetched Events:', formattedEvents); 
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);
  
  

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    const isTodayOrFuture = start >= now.setHours(0, 0, 0, 0);

    if (isTodayOrFuture) {
      setSelectedDate(start);
      setEditEvent(null); // Prepare for a new event
      setNote('');
      setTimeSlots([{ startTime: '', endTime: '' }]);
      setSelectedEventType('Available');
      setModalOpen(true);
    } 

    if (start < now) {
      alert('You cannot select a past date.');
      return;
    }
    
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
      setSelectedEventType(clickedEvent.type || 'Available');
    } else {
      setEditEvent(null);
      setNote('');
      setTimeSlots([{ startTime: '', endTime: '' }]);
      setSelectedEventType('Available');
    }

    setSelectedDate(start);
    setDayEvents(filteredEvents);
    setModalOpen(true);
  };

  const CustomEvent = ({ event }) => {
    const isDotText = event.title.toLowerCase().includes('.');
    const isHoliday = event.type === 'Holiday';
    const isUnavailable  = event.type === 'Unavailable ';
  
    let textColor;
    if (isDotText) {
      textColor = 'transparent'; 
    } else if (isHoliday || isUnavailable) {
      textColor = '#fff'; 
    } else {
      textColor = 'inherit'; 
    }
  
    return (
      <span
        style={{
          color: textColor,
          display: 'block',
          whiteSpace: 'normal', 
          wordWrap: 'break-word', 
          cursor: 'pointer', 
        }}
        title={isHoliday ? '' : event.title || isUnavailable ? '' : event.title }
        onClick={() => onClick(event)}
      >
        {event.title}
      </span>
    );
  };

  const handleSave = () => {
    if (selectedDate) {
      let start, end;
  
      if (selectedEventType !== 'Available') {
        start = moment(selectedDate).startOf('day').toDate();
        end = moment(selectedDate).endOf('day').toDate();
      } else if (timeSlots[0].startTime && timeSlots[0].endTime) {
        const startTime = moment(timeSlots[0].startTime, 'HH:mm').toDate();
        const endTime = moment(timeSlots[0].endTime, 'HH:mm').toDate();
        
        start = new Date(selectedDate);
        start.setHours(startTime.getHours(), startTime.getMinutes());
        
        end = new Date(selectedDate);
        end.setHours(endTime.getHours(), endTime.getMinutes());
      } else {
        alert("Set Time Slots");
        return;
      }
  
      const date = moment(start).format('YYYY-MM-DD');
      const formattedStartTime = moment(start).format('h:mm A');
      const formattedEndTime = moment(end).format('h:mm A');
  
      let title = note || '';
      if (selectedEventType === 'Available' && timeSlots[0].startTime && timeSlots[0].endTime) {
        title += title ? ` (${formattedStartTime} - ${formattedEndTime})` : `${formattedStartTime} - ${formattedEndTime}`;
      }
  
      const newEvent = {
        title: title.trim(),
        start: start,
        end: end,
        isBooked: false,
        type: selectedEventType,
        date: date, 
        time: `${formattedStartTime} - ${formattedEndTime}`, 
        count: 5, // Set the count field to default value (5 or any number you want)
      };
  
      if (editEvent) {
        fetch(`http://localhost:8080/api/events/${editEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        })
          .then(response => response.json())
          .then(data => {
            setEvents(events.map(e => (e.id === editEvent.id ? data : e)));
            setModalOpen(false);
          })
          .catch(error => console.error('Error updating event:', error));
      } else {
        fetch('http://localhost:8080/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        })
          .then(response => response.json())
          .then(data => {
            setEvents([...events, data]);
            setModalOpen(false);
          })
          .catch(error => console.error('Error saving event:', error));
      }
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

        const formattedStartTime = moment(start).format('h:mm a');
        const formattedEndTime = moment(end).format('h:mm a');
        const title = `${formattedStartTime} - ${formattedEndTime}`;

        newEvents.push({
          title,  
          start: start,
          end: end,
          type: 'Available', 
          isBooked: false,
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
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setShowModal(false);
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
          start: new Date(), 
          end: new Date(),   
          type: 'Available', 
          isBooked: false,   
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

const calculateDayHeight = (day) => {
  const eventsOnDay = events.filter(event => moment(event.start).isSame(day, 'day'));

  const baseHeight = 100;

  const additionalHeightPerEvent = 50;

  return baseHeight + (eventsOnDay.length * additionalHeightPerEvent);
};

const eventStyleGetter = (event, start, end, isSelected) => {
  const now = new Date();
  const eventEndDate = new Date(event.end);
  const isPastEvent = eventEndDate < now && eventEndDate.toDateString() !== now.toDateString();

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
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom:'1px',
  };

  if (new Date(event.end) < now || event.type === 'Unavailable') {
    style.backgroundColor = '#B0BEC5'; 
    style.color = '#fff'; 
    style.pointerEvents = 'none'; 
  } else if (event.type === 'Available') {
    style.backgroundColor = '#FDE74C'; 
    style.color = '#000'; 
  } else if (event.type === 'Holiday') {
    style.backgroundColor = '#cc9999'; 
    style.color = '#fff'; 
  }

  return { style };
};


const setEventHeightVariables = () => {
  const daysWithEvents = {};

  events.forEach(event => {
    const day = moment(event.start).format('YYYY-MM-DD');
    if (!daysWithEvents[day]) {
      daysWithEvents[day] = 0;
    }
    daysWithEvents[day]++;
  });

  Object.keys(daysWithEvents).forEach(day => {
    const dayElement = document.querySelector(`[data-date="${day}"]`);
    if (dayElement) {
      dayElement.style.setProperty('--event-count', daysWithEvents[day]);
    }
  });
};

useEffect(() => {
  setEventHeightVariables();
}, [events]);


const handleEventClick = (event) => {
  setEditEvent(event);
  setSelectedDate(event.start);
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




  return (
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
      <Sidebar /> 
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#90343c' }} 
          >
            Calendar
          </Typography>
          <DocNavBar />
        </Box>
          


         {/* Color Legend */}
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 , color: 'black' }}>
          <Box sx={{ backgroundColor: '#FDE74C ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>Available Slot</Typography>
          <Box sx={{ backgroundColor: '#b8bcc4 ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>Unavailable Slot</Typography>
          <Box sx={{ backgroundColor: '#cc9999 ', width: 20, height: 20, mr: 1 }} />
          <Typography variant="body2">Holiday</Typography>
        </Box>


        <div >
       
      <Button onClick={() => setShowModal(true)} color="primary" variant="contained"
      style={{marginBottom:'10px', backgroundColor:'#88343B' }}>
      Select Days and Time Slots
      </Button>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="lg" 
      PaperProps={{
        style: {
          width: '410px', // Set your desired width here
          maxWidth: '90vw', // Optional: set a maximum width to prevent the modal from being too wide
        },
      }} >
      <IconButton
        onClick={() => setShowModal(false)} // Change handleCancel to directly close the modal
        aria-label="close"
        style={{ position: 'absolute', right: '10px', top: '10px' }}
      >
        <CloseIcon />
      </IconButton>
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
            
            <Button onClick={addMultiTimeSlot} color="primary" variant="contained" style={{ marginTop: '10px', backgroundColor:'#88343B' }}>
              Add Time Slot
            </Button>
            
            <Button onClick={handleCreateMultipleEvents} color="primary" variant="contained" style={{ marginTop: '10px', marginLeft: '5px',  backgroundColor:'#88343B'  }}>
              Create Available Slots
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => setShowModal(false)} color="primary">
            Close
          </Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} disableBackdropClick={false} >
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
          style={{ color: 'black', backgroundColor: 'white' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          views={['month', 'week', 'day']}
          defaultView="month"
          eventPropGetter={eventStyleGetter}
  components={{
    event: (props) => <CustomEvent {...props} onClick={handleEventClick} />
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

        <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handleCancel}
              aria-label="close"
              style={{ position: 'absolute', right: '0px' , top:'-5px' }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" style={{ color: '#90343c', marginBottom: '20px' }}>
              Agenda for {moment(selectedDate).format('MMMM Do YYYY')}
            </Typography>

            <div style={{ maxHeight: 'auto', overflowY: 'auto', overflowX: 'hidden', marginBottom: '20px' }}>
              {dayEvents.length > 0 ? (
                <ul style={{ padding: '0', listStyle: 'none' }}>
                  {dayEvents.map((event, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'nowrap',
                        width: '100%', // Make sure it takes the full width of the container
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <strong>{event.title}</strong> ({moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')})
                      </Typography>
                      <IconButton
                        onClick={() => handleEditEvent(event)}
                        aria-label="edit"
                        style={{ color: '#88343B', marginLeft: '10px' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteEvent(event)}
                        aria-label="delete"
                        style={{ color: 'maroon', marginLeft: '5px' }}
                      >
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
                          <Button onClick={() => setDeleteConfirmOpen(false)} style={{ color: "#8c2930" }}>
                            Cancel
                          </Button>
                          <Button onClick={confirmDeleteEvent} style={{ color: "#cc9999" }}>
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No events scheduled.
                </Typography>
              )}
            </div>


            <TextField
              label="Add Note (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              style={{ marginBottom: '20px' }}
            />

            <div style={{ marginBottom: '20px' }}>
              <Typography variant="subtitle1" style={{ marginBottom: '10px', color: '#90343c' }}>
                Event Type
              </Typography>
              <RadioGroup value={selectedEventType} onChange={handleEventTypeChange}>
                <FormControlLabel value="Available"
                  control={<Radio sx={{ color: 'maroon', '&.Mui-checked': { color: 'maroon' } }} />}
                  label="Available"
                  style={{color:'black'}}/>
                <FormControlLabel value="Unavailable" 
                  control={<Radio sx={{ color: 'maroon', '&.Mui-checked': { color: 'maroon' } }} />}
                  label="Unavailable"
                  style={{color:'black'}}/>
                <FormControlLabel value="Holiday" 
                  control={<Radio sx={{ color: 'maroon', '&.Mui-checked': { color: 'maroon' } }} />}
                  label="Holiday"
                  style={{color:'black'}}/>
              </RadioGroup>
              {selectedEventType === 'Available' && (
                <div style={{ marginTop: '10px' }}>
                  <Typography variant="subtitle1" style={{ marginBottom: '10px', color: '#90343c' }}>
                    Time Slots
                  </Typography>
                  {timeSlots.map((slot, index) => (
                    <div key={index} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
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
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ inputProps: { step: 300 } }}
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
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ inputProps: { step: 300 } }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                style={{ backgroundColor: '#8c2930' }}
              >
                {editEvent ? 'Update' : 'Save'}
              </Button>
              {/* <Button onClick={handleCancel} color="secondary" variant="contained">
                Cancel
              </Button> */}
            </Box>
          </Box>
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