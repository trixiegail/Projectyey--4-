import React, { useState, createContext, useContext } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/NavNurseDentist';

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

const ApplicantList = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { applicants } = useContext(ApplicantsContext);
  const navigate = useNavigate();

  const filteredApplicants = applicants.filter((applicant) => {
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
    setFilterCourse('');
  };

  const handleRowClick = (applicant) => {
    navigate(`/CheckupForm/${applicant.id}`, { state: { applicant } });
  };

  const handleAccept = (applicantId) => {
    alert(`Accepted appointment for applicant ID: ${applicantId}`);
    // Implement acceptance logic here
  };

  const handleRefuse = (applicantId) => {
    alert(`Refused appointment for applicant ID: ${applicantId}`);
    // Implement refusal logic here
  };

  return (
    <>
      <Nav />
      <br />
      <Box display="flex" justifyContent="space-around" alignItems="center" mb={3} className="filter-container">
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
        <Typography variant="h4" align="center">APPLICANTS FOR CHECK UP</Typography>
        <FormControl variant="outlined" style={{ minWidth: 300 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filterDepartment}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            label="Department"
            style={{ width: '300px' }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.keys(coursesByDepartment).map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="center" mt={3}>
        <Table className="table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#a52a2a', color: '#FFFFFF' }}>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>ID Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Full Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Year</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Date & Time</TableCell>
              <TableCell style={{ color: '#FFFFFF', paddingLeft: 20 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplicants.map((applicant) => (
              <TableRow key={applicant.id} style={{ cursor: 'pointer' }}>
                <TableCell style={{ paddingLeft: 20 }}>{applicant.id}</TableCell>
                <TableCell style={{ paddingLeft: 20 }}>{applicant.fullName}</TableCell>
                <TableCell>{applicant.course}</TableCell>
                <TableCell>{applicant.year}</TableCell>
                <TableCell style={{ paddingLeft: 20 }}>{`${applicant.date} ${applicant.time}`}</TableCell>
                <TableCell>
                <Button
                   variant="contained"
                   onClick={() => handleAccept(applicant.id)}
                  style={{ backgroundColor: '#800000', color: '#FFFFFF', marginRight: 10 }} // Maroon background with white text
                  >
                Accept
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleRefuse(applicant.id)}
                    style={{ backgroundColor: '#800000', color: '#FFFFFF' }} // Maroon background with white text
                  >
                   Refuse
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

const CheckupApplicantList = () => {
  const [applicants, setApplicants] = useState([
    { id: '19-1234-165', fullName: 'John Doe', department: 'COLLEGE OF COMPUTER STUDIES', course: 'BS Computer Science', year: 3, date: '2024-06-21', time: '8:00AM', priority: true },
    { id: '20-1234-156', fullName: 'Jane Smith', department: 'COLLEGE OF COMPUTER STUDIES', course: 'BS Information Technology', year: 2, date: '2024-06-20', time: '9:00AM', priority: false },
    { id: '18-1256-192', fullName: 'Bob Johnson', department: 'COLLEGE OF COMPUTER STUDIES', course: 'BS Computer Science', year: 4, date: '2024-06-23', time: '10:00AM' },
    { id: '18-1256-193', fullName: 'Jade Smith', department: 'COLLEGE OF ARTS, SCIENCES, & EDUCATION', course: 'AB Communication', year: 4, date: '2024-06-23', time: '11:00AM' },
    { id: '18-1256-194', fullName: 'Lola Bunny', department: 'COLLEGE OF NURSING & ALLIED HEALTH SCIENCES', course: 'BS Nursing', year: 4, date: '2024-06-19', time: '1:00PM' },
    { id: '18-1256-189', fullName: 'Brian Despi', department: 'COLLEGE OF MANAGEMENT, BUSINESS & ACCOUNTANCY', course: 'BS Accountancy', year: 3, date: '2024-06-16', time: '1:00PM' },
    { id: '18-1256-180', fullName: 'Nichole Cuizon', department: 'COLLEGE OF MANAGEMENT, BUSINESS & ACCOUNTANCY', course: 'BS Management Accounting', year: 1, date: '2024-04-19', time: '2:00PM' },
    { id: '18-1256-196', fullName: 'Deriel Magallanes', department: 'COLLEGE OF NURSING & ALLIED HEALTH SCIENCES', course: 'BS Nursing', year: 1, date: '2024-04-28', time: '3:00PM' },
  ]);

  const addApplicant = (applicant) => {
    setApplicants((prevApplicants) => [...prevApplicants, applicant]);
  };

  return (
    <ApplicantsContext.Provider value={{ applicants, addApplicant }}>
      <ApplicantList />
    </ApplicantsContext.Provider>
  );
};

export default CheckupApplicantList;
