import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReactDOM from 'react-dom';
import Studfooter from '../components/Studfooter';
import Studnav from '../components/Studnav';
import './custom.css'; 


const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlot, setCurrentSlot] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Fetch events from the backend API
    fetch('http://localhost:8080/api/events')
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setModalOpen(false);
        setDeleteModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setCurrentSlot({ start, end });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true); // Open the modal to confirm reservation for this event
  };

  const handleReserve = () => {
    if (selectedEvent) {
      // Update the selected event to mark it as reserved
      const updatedEvent = {
        ...selectedEvent,
        title: `Reserved Slot on ${moment(selectedEvent.start).format('MMMM Do YYYY')}`,
      };

      // Save the updated event to the backend
      fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      })
        .then((response) => response.json())
        .then((updatedEvent) => {
          setEvents(
            events.map((event) =>
              event.id === updatedEvent.id ? { ...updatedEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) } : event
            )
          );
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating event:', error));
    }
  };

  const handleDelete = () => {
    if (eventToDelete) {
      fetch(`http://localhost:8080/api/events/${eventToDelete.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete the event.');
          }
          setEvents(events.filter((event) => event.id !== eventToDelete.id));
          setDeleteModalOpen(false);
        })
        .catch((error) => console.error('Error deleting event:', error));
    }
  };

  const Modal = () => {
    if (!modalOpen) return null;
  
    // Format the date and time for display
    const eventDate = selectedEvent ? moment(selectedEvent.start).format('MMMM Do YYYY') : '';
    const eventTime = selectedEvent ? `${moment(selectedEvent.start).format('h:mm A')} - ${moment(selectedEvent.end).format('h:mm A')}` : '';
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50">
        <div ref={wrapperRef} className="bg-white rounded shadow-lg max-w-md mx-auto p-4">
          <h2 className="mt-1 text-xl font-bold text-center">Confirm Reservation</h2>
          {selectedEvent ? (
            <>
              <p className="mt-2 text-center">Are you sure you want to reserve this slot?</p>
              <p className="mt-2 text-center">
                <strong>Date:</strong> {eventDate}
              </p>
              <p className="mt-2 text-center">
                <strong>Time:</strong> {eventTime}
              </p>
            </>
          ) : (
            <p className="mt-2 text-center">Are you sure you want to create a new reservation?</p>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-[#88343B] hover:bg-[#88343B] text-white font-bold py-2 px-4 rounded mb-1" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="bg-[#F7C301] hover:bg-[#F7C301] text-white font-bold py-2 px-4 rounded mb-1" onClick={handleReserve}>Confirm</button>
          </div>
        </div>
      </div>,
      document.body
    );
  };
  

  const DeleteModal = () => {
    if (!deleteModalOpen) return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto text-black bg-black bg-opacity-50">
        <div ref={wrapperRef} className="bg-white rounded shadow-lg max-w-md mx-auto p-4">
          <h2 className="mt-1 text-xl font-bold text-center">Delete Appointment</h2>
          <p className="mt-2 text-center">Are you sure you want to delete this appointment?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-[#88343B] hover:bg-[#88343B] text-white font-bold py-2 px-4 rounded mb-1" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
            <button className="bg-[#F7C301] hover:bg-[#F7C301] text-white font-bold py-2 px-4 rounded mb-1" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const eventPropGetter = () => {
    return {
      className: 'custom-event', // Add a custom class to each event
    };
  };
  
  
  

  return (
    <div>
      <Studnav />
      <Modal />
      <DeleteModal />

      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto max-w-2xl py-10 text-center">
            <p className="py-5 text-black">Articles</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#88343B] sm:text-5xl">Choose an Appointment</h1>
            <p className="mt-6 text-lg leading-8 text-black">Choose an Appointment</p>
          </div>
          <div className="isolate bg-[#88343B] px-6 py-24 sm:py-32 lg:px-8 rounded-lg text-white ">
            <p className="text-lg text-white">Choose an Appointment</p>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              selectable
              // onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent} 
              eventPropGetter={eventPropGetter} 
              views={['month', 'week', 'day']}
              defaultView="month"
              min={new Date(2024, 8, 10, 8, 0)}
              max={new Date(2024, 8, 10, 18, 0)}
            />
          </div>
        </div>
      </div>
      <Studfooter />
    </div>
  );
}

export default App;
