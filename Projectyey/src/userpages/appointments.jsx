import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Studfooter from '../components/Studfooter';
import Studnav from '../components/Studnav';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loggedInStudentId, setLoggedInStudentId] = useState(null);

  useEffect(() => {
    // Get the logged-in student's ID from localStorage
    const studentId = localStorage.getItem('studentIdNumber');
    setLoggedInStudentId(studentId);

    if (studentId) {
      // Fetch all appointments from the backend
      fetch('https://dentalmanagement.azurewebsites.net/api/patients/')
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // Filter appointments for the logged-in student
            const studentAppointments = data.filter(
              (appointment) => appointment.studentIdNumber === studentId
            );
            setAppointments(studentAppointments);
          } else {
            console.error('Expected an array but received:', data);
          }
        })
        .catch((error) => console.error('Error fetching appointments:', error));
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white' }}>
      <Studnav />

      <div style={{ flex: 1 }}>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#88343B] sm:text-5xl">My Approved Appointment</h1>
          </div>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              overflowY: 'auto',
              padding: 4,
              borderRadius: 2,
              width: '30%', // Center the box within the container
              margin: '20px auto', // Add spacing from other content
            }}
          >
            {appointments.length > 0 ? (
              <Table
                sx={{
                  width: '100%',
                  backgroundColor: '#f7f7f7', // Light gray table background for contrast
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                }}
              >
                <TableHead
                  sx={{
                    backgroundColor: '#90343c', // Maroon background for header
                    height: '50px', // Slightly taller header
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell sx={{ textAlign: 'center', fontSize: '1rem' }}>{appointment.date}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontSize: '1rem' }}>{appointment.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  color: '#90343c',
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                No Appointments Available
              </Typography>
            )}
          </Box>
        </div>
      </div>

      <Studfooter />
    </div>
  );
};

export default Appointments;
