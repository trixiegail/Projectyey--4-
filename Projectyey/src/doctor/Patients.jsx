import React, { useState, createContext, useContext, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody,
        FormControl, InputLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';

export const ApplicantsContext = createContext();

const coursesByDepartment = {
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

const PatientList = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { applicants } = useContext(ApplicantsContext);
  const navigate = useNavigate();

  const sortedApplicants = [...applicants].sort((a, b) => {
    // Ensure both date and time are available before performing split
    const timeA = a.time ? a.time.split(' - ')[0] : '';
    const timeB = b.time ? b.time.split(' - ')[0] : '';
  
    const dateA = new Date(a.date + ' ' + timeA); // Combine date and start time
    const dateB = new Date(b.date + ' ' + timeB);
  
    return dateA - dateB; // Sort in ascending order
  });
  

  const filteredApplicants = sortedApplicants.filter((applicant) => {
    if (filterPriority === 'Priority List' && applicant.year !== 4) {
      return false;
    }
    if (filterDepartment && filterDepartment !== applicant.department) {
      return false;
    }
    if (filterCourse && filterCourse !== applicant.course) {
      return false;
    }
    if (filterYear && filterYear !== '' && filterYear !== applicant.year.toString()) {
      return false;
    }
    if (filterDate && filterDate !== '' && filterDate !== applicant.date) {
      return false;
    }
    return true;
  });

  const handleDepartmentChange = (department) => {
    setFilterDepartment(department);
    setFilterCourse(''); // Reset course filter when department changes
  };

  const handleRowClick = (applicant) => {
    navigate(`/CheckupForm/${applicant.id}`, { state: { applicant } });
  };

  return (
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
          sx={{ fontWeight: 'bold', color: '#90343c', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} 
        >
          Applicants For Check Up
        </Typography>
        <DocNavBar />
      </Box>

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
            {Object.keys(coursesByDepartment).map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="center" mt={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#90242c', color: '#FFFFFF' }}>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>ID Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Full Name</TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150, marginLeft: 10 }}>
                  <InputLabel style={{ color: '#FFFFFF' }}>Course</InputLabel>
                  <Select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    label="Course"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterDepartment && coursesByDepartment[filterDepartment].map((course) => (
                      <MenuItem key={course} value={course}>{course}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl variant="outlined" size="small" style={{ minWidth: 100, marginLeft: 10 }}>
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
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>
                Date & Time
                <TextField
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  size="small"
                  style={{ marginLeft: 10 }}
                />
              </TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplicants.map((applicant) => (
              <TableRow key={applicant.id} onClick={() => handleRowClick(applicant)} style={{ cursor: 'pointer', backgroundColor:'white' }}>
                <TableCell style={{ paddingLeft: 15 , fontSize:'16px'}}>{applicant.studentIdNumber}</TableCell>
                <TableCell style={{ paddingLeft: 15 , fontSize:'16px'}}>{applicant.fullName}</TableCell>
                <TableCell style={{ paddingLeft: 30, fontSize:'16px'}}>{applicant.course}</TableCell>
                <TableCell style={{ paddingLeft: 70 , fontSize:'16px'}}>{applicant.year}</TableCell>
                <TableCell style={{ paddingLeft: 25, fontSize: '16px' }}>
                  {applicant.date} <strong>{applicant.time}</strong>
                </TableCell>

                <TableCell>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

const Patients = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/patients/')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Check if the data is returned correctly
        if (Array.isArray(data)) {
          setApplicants(data); // This will include the new reservation
        } else {
          console.error('Expected an array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching reservations:', error));
  }, []);

  return (
    <ApplicantsContext.Provider value={{ applicants }}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar /> 
        <PatientList />
      </Box>
    </ApplicantsContext.Provider>
  );
};

export default Patients;
