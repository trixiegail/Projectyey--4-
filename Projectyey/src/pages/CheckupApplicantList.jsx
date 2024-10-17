import React, { useState, createContext, useContext, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody, 
        FormControl, InputLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/DocSidebar';
import DocNavBar from '../components/DocNavBar';

export const ApplicantsContext = createContext();

const coursesByDepartment = {
  // Same course data here
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
    setFilterCourse(''); // Reset course filter when department changes
  };

  const handleRowClick = (applicant) => {
    navigate(`/CheckupForm/${applicant.id}`, { state: { applicant } });
  };

  const handleAccept = (applicantId) => {
    alert(`Accepted appointment for applicant ID: ${applicantId}`);
  };

  const handleRefuse = (applicantId) => {
    alert(`Refused appointment for applicant ID: ${applicantId}`);
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
              <TableRow key={applicant.id} onClick={() => handleRowClick(applicant)} style={{ cursor: 'pointer' }}>
                <TableCell style={{ paddingLeft: 20 }}>{applicant.id}</TableCell>
                <TableCell style={{ paddingLeft: 20 }}>{applicant.fullName}</TableCell>
                <TableCell>{applicant.course}</TableCell>
                <TableCell>{applicant.year}</TableCell>
                <TableCell style={{ paddingLeft: 20 }}>{`${applicant.date} ${applicant.time}`}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleAccept(applicant.id)}
                    style={{ backgroundColor: '#800000', color: '#FFFFFF', marginRight: 10 }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleRefuse(applicant.id)}
                    style={{ backgroundColor: '#800000', color: '#FFFFFF' }}
                  >
                    Refuse
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

const CheckupApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  

  useEffect(() => {
    fetch('http://localhost:8080/api/reservations')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          setApplicants(data);
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
        <ApplicantList />
      </Box>
    </ApplicantsContext.Provider>
  );
};

export default CheckupApplicantList;
