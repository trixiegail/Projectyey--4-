import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DocNavBar from '../components/DocNavBar';
import Sidebar from '../components/DocSidebar';

const programsByDepartment = {
  'COLLEGE OF ENGINEERING AND ARCHITECTURE': [
    'BS Architecture',
    'BS Chemical Engineering',
    'BS Civil Engineering',
    'BS Computer Engineering',
    'BS Electrical Engineering',
    'BS Electronics Engineering',
    'BS Industrial Engineering',
    'BS Mechanical Engineering',
    'BS Mining Engineering',
  ],
  'COLLEGE OF MANAGEMENT, BUSINESS & ACCOUNTANCY': [
    'BS Accountancy',
    'BS Accounting Information Systems',
    'BS Management Accounting',
    'BS Business Administration',
    'BS Hospitality Management',
    'BS Tourism Management',
    'BS Office Administration',
    'Bachelor in Public Administration',
  ],
  'COLLEGE OF ARTS, SCIENCES, & EDUCATION': [
    'AB Communication',
    'AB English with Applied Linguistics',
    'Bachelor of Elementary Education',
    'Bachelor of Secondary Education',
    'Bachelor of Multimedia Arts',
    'BS Biology',
    'BS Math with Applied Industrial Mathematics',
    'BS Psychology',
  ],
  'COLLEGE OF NURSING & ALLIED HEALTH SCIENCES': [
    'BS Nursing',
    'BS Pharmacy',
  ],
  'COLLEGE OF COMPUTER STUDIES': [
    'BS Computer Science',
    'BS Information Technology',
  ],
  'COLLEGE OF CRIMINAL JUSTICE': [
    'BS Criminology',
  ],
};

const CompletedAppointments = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch completed appointments on component mount
  useEffect(() => {
    fetch('http://localhost:8080/api/completed-appointments')  // Adjust API endpoint as necessary
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
        setCompletedAppointments(sortedData);
      })
      .catch((error) => console.error('Error fetching completed appointments:', error));
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
            sx={{ fontWeight: 'bold', color: '#90343c', whiteSpace: 'nowrap' }} 
          >
            Completed Appointments
          </Typography>
          <DocNavBar />
        </Box>
    
        {/* Completed Appointments Table */}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} width="100%">
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>List</InputLabel>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            label="List"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Priority List">Priority List</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ minWidth: 300 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filterDepartment}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            label="Department"
          >
            <MenuItem value="">All</MenuItem>
            {Object.keys(programsByDepartment).map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="center" mt={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ width: '100%'}}>
        <TableHead>
            <TableRow style={{ backgroundColor: '#90242c'}}>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: '20px', width: '15%'}} >ID Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: '20px' }}>Full Name</TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150}}>
                  <InputLabel style={{ color: '#FFFFFF' }}>Program</InputLabel>
                  <Select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    label="Program"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterDepartment && programByDepartment[filterDepartment].map((program) => (
                      <MenuItem key={program} value={program}>{program}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 100 }}>
                  <InputLabel style={{ color: '#FFFFFF' }}>Year</InputLabel>
                  <Select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    label="Year"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell style={{ color: '#FFFFFF', padding: '8px' }}>
                Date & Time
                <TextField
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  size="small"
                  style={{ marginLeft: 10 }}
                />
              </TableCell>
              <TableCell style={{ color: '#FFFFFF', padding: '8px' }}>Completed Date</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
          {completedAppointments.map((appointment) => (
          <TableRow key={appointment.id} onClick={() => handleRowClick(applicant)} style={{ cursor: 'pointer', backgroundColor:'white'}}>
                <TableCell style={{ paddingLeft: 15}}>{appointment.studentIdNumber}</TableCell>
                <TableCell style={{ paddingLeft: 15}}>{appointment.fullName}</TableCell>
                <TableCell style={{ paddingLeft: 30}}>{appointment.program}</TableCell>
                <TableCell style={{ paddingLeft: 60}}>{appointment.yearLevel}</TableCell>
                <TableCell style={{ paddingLeft: 15}}><strong>{appointment.date}</strong> &emsp;&emsp;{appointment.time}</TableCell>
                <TableCell style={{ paddingLeft: 15}}>{new Date(appointment.completedDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </Box>
      </Box>

    </Box>
  );
};

export default CompletedAppointments;
