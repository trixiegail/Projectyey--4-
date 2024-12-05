import React, { useRef, useState } from "react";
import { Box, Typography, Collapse, Button, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";
import DocNavBar from '../components/DocNavBar';
import Sidebar from '../components/DocSidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from 'react-router-dom'; 
import '../doctor/dashboard.css';


const DentalRecordDrawer = () => {
  const printAllRef = useRef();
  const printDateRef = useRef();
  const intraoralRef = useRef();
  const intraoralDateRef = useRef();
  const location = useLocation();
  const { studentData, medicalRecords, intraoralRecords = [] } = location.state || {};

  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); 
  const navigate = useNavigate(); // React Router navigation hook
  const [showForm, setShowForm] = useState(false);
  const [showIntraoralExam, setShowIntraoralExam] = useState(false);
  const [openIntraoralDateDialog, setOpenIntraoralDateDialog] = useState(false);
  
  const handlePrint = () => {
    const printContent = printAllRef.current;
  if (printContent) {
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the original content
  } else {
    console.error("Print content not found");
  }
};

  const handlePrintByDate = () => {
    if (printDateRef.current) {
      const originalStyles = {
        backgroundColor: document.body.style.backgroundColor,
        margin: document.body.style.margin,
        padding: document.body.style.padding,
        overflow: document.body.style.overflow,
      };
      const originalContent = document.body.innerHTML;

      document.body.style.backgroundColor = "#ffffff";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden";
  
      const printContent = printDateRef.current.innerHTML;
      document.body.innerHTML = `
        <div style="width: 100%; height: auto; box-sizing: border-box; margin: 0; padding: 0;">
          ${printContent}
        </div>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      Object.assign(document.body.style, originalStyles);
      window.location.reload();
    } else {
      console.error("No content to print");
    }
  };

  const handlePrintIntraoral = () => {
    if (intraoralRef.current) {
      const printContent = intraoralRef.current.innerHTML;
      if (printContent) {
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore the original content
      } else {
        console.error("Print content not found");
      }
    }
  };
  
  const handlePrintIntraoralByDate = () => {
    if (selectedDates.length > 0) {
      // Group records by selected dates
      const filteredRecordsByDate = selectedDates.map((date) => {
        const records = intraoralRecords.filter(
          (record) => new Date(record.savedAt).toLocaleDateString() === date
        );
        return { date, records };
      });
  
      // Build printable content
      const recordsToPrint = `
        <div style="font-family: Arial, sans-serif;">
          <!-- Title displayed only once -->
          <h1 style="text-align: center; color: #90343c;">Intraoral Examination Record</h1>
          ${filteredRecordsByDate
            .map(
              ({ date, records }) => `
            <div>
              <h2 style="margin-bottom: 10px; color: #90343c;">${date}</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Tooth Number</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${records
                    .map(
                      (record) => `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.toothNumber}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.status}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(
                          record.savedAt
                        ).toLocaleTimeString()}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
            )
            .join("")}
        </div>
      `;
  
      // Print the content
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = recordsToPrint;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    } else {
      console.error("No records selected for printing.");
    }
  };
  
  
  // Deduplicate dates in dropdown
  const uniqueDates = Array.from(
    new Set(intraoralRecords.map((record) => new Date(record.savedAt).toLocaleDateString()))
  );
  
  

  return (

    <Box className="dashboard-container"sx={{ display: 'flex', minHeight: '100vh', backgroundColor:'white' }}>
  
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ fontWeight: 'bold', color: '#90343c', whiteSpace: 'nowrap' }} 
            >
              
            </Typography>
            <DocNavBar />
          </Box>
    
          
          <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      

    <Box
      sx={{
        padding: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Wrapping all printable content in a single ref */}
      <Box ref={printAllRef}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            boxSizing: "border-box",
            margin: "0",
        padding: "0",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#88343b" }}>
            Dental Record
          </Typography>
          <img
            src={ '/src/image/teethLogoDesignYellow.png' }
            alt="Logo"
            style={{
              height: '60px',
              objectFit: 'cover',
              objectPosition: 'top', // Focus on the top part
              overflow: 'hidden',
              clipPath: 'inset(0 0 20% 0)', // Crops the bottom 10%
              marginBottom: '3px',
            }}
          />

        </Box>

        {/* Student Details */}
        <Box
          sx={{
            marginBottom: 2,
            paddingLeft: 2,
            paddingBottom: 2,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Full Name:</strong> {studentData?.fullName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>ID Number:</strong> {studentData?.idNumber || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Department:</strong> {studentData?.department || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Course:</strong> {studentData?.course || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Year:</strong> {studentData?.year || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Date of Birth:</strong> {studentData?.dateOfBirth || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {studentData?.email || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Back Button */}
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    alignSelf: "flex-start",
    color: "#88343b", // Default color for both icon and text
    "&:hover": {
      color: "#F7C301", // Hover color for both icon and text together
    },
    "@media print": {
      display: "none", // Hide buttons during print
    },
  }}
  onClick={() => navigate(-1)} // Navigate to the previous page
>
  <ArrowBackIcon
    sx={{
      fontSize: "20px",
      mr: 1, // Margin between the icon and the text
    }}
  />
  <Typography
    variant="body1"
    sx={{
      fontWeight: "bold",
    }}
  >
    Back
  </Typography>
  
</Box>

<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2, "@media print": {
      display: "none", 
    },  }}> 
          {/* Left-aligned buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              width: '100%' // Ensure the Box spans the entire width 
            }}
>
          <Button variant="contained" 
              sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}}
              onClick={() => setShowForm(!showForm)}
            >
              Checkup
            </Button>
            <Button variant="contained"
              sx={{ backgroundColor: '#a52a2a', '&:hover': { backgroundColor: '#F7C301' }}}
              onClick={() => setShowIntraoralExam(!showIntraoralExam)}
            >
              Intraoral Examination
            </Button>
          </Box>
        </Box>

        <Collapse in={showForm} unmountOnExit>
{/* Print Buttons */}

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 2, "@media print": {
      display: "none", // Hide buttons during print
    }, }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePrint(printAllRef)}
          sx={{ backgroundColor: "#88343b", "&:hover": { backgroundColor: "#F7C301"} }}
        >
          Print All
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDateDialog(true)}
          sx={{ backgroundColor: "#88343b", "&:hover": { backgroundColor: "#F7C301" } }}
        >
          Print by Date
        </Button>
      </Box>

      {/* Date Selection Dialog */}
        <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)}>
          <DialogTitle>Select Date to Print</DialogTitle>
          <DialogContent>
            <Select
              multiple
              value={selectedDates}
              onChange={(e) => setSelectedDates(e.target.value)}
              renderValue={(selected) =>
                selected.map((date) => new Date(date).toLocaleDateString()).join(", ")
              }
              fullWidth
            >
              {medicalRecords?.map((record, index) => (
                <MenuItem key={index} value={record.date}>
                  <Checkbox checked={selectedDates.includes(record.date)} />
                  <ListItemText primary={new Date(record.date).toLocaleDateString()} />
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions
            sx={{
              "& > button": {
                color: "black",
              },
            }}
          >
            <Button onClick={() => setOpenDateDialog(false)}><strong>Cancel</strong></Button>
            <Button
              onClick={() => {
                setOpenDateDialog(false);
                setTimeout(() => {
                  handlePrintByDate();
                }, 300);
              }}
              disabled={selectedDates.length === 0}
            >
              <strong>Print</strong>
            </Button>
          </DialogActions>

        </Dialog>
        

        {/* Medical Records Section */}
        
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#88343b" }}>
            Checkup Record
          </Typography>
          {medicalRecords?.map((record, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant="body2">
                  <strong>Date:</strong>{" "}
                  {new Date(record.date).toLocaleDateString()}{" "}
                  {new Date(record.date).toLocaleTimeString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Blood Pressure:</strong> {record.bloodPressure}
                </Typography>
                <Typography variant="body2">
                  <strong>Heart Rate:</strong> {record.heartRate}
                </Typography>
                <Typography variant="body2">
                  <strong>Respiratory Rate:</strong> {record.respiratoryRate}
                </Typography>
                <Typography variant="body2">
                  <strong>Temperature:</strong> {record.temperature}
                </Typography>
                <Typography variant="body2">
                  <strong>Oral Health Status:</strong> {record.oralHealthStatus}
                </Typography>
                <Typography variant="body2">
                  <strong>Gum Health:</strong> {record.gumHealth}
                </Typography>
                <Typography variant="body2">
                  <strong>Presence of Cavities:</strong> {record.presenceOfCavities}
                </Typography>
                <Typography variant="body2">
                  <strong>General Health Condition:</strong>{" "}
                  {record.generalHealthCondition}
                </Typography>
                <Typography variant="body2">
                  <strong>Specific Health Concerns:</strong>{" "}
                  {record.specificHealthConcerns}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        </Collapse>
      </Box>
      

       {/* Dynamic Print by Date Container */}
       <Box ref={printDateRef} 
       style={{
        display: "none", // Default hidden
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
      }}
       >
  {/* Header Section */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      borderBottom: "2px solid #ddd",
      paddingBottom: 2,
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#88343b" }}>
      Dental Record
    </Typography>
    <img
      src={"/src/image/teethLogoDesignYellow.png"}
      alt="Logo"
      style={{
        height: "60px",
        objectFit: "cover",
        objectPosition: "top",
        clipPath: 'inset(0 0 20% 0)', 
      }}
    />
  </Box>

  {/* Student Details */}
  <Box
          sx={{
            marginBottom: 2,
            paddingLeft: 2,
            paddingBottom: 2,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Full Name:</strong> {studentData?.fullName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>ID Number:</strong> {studentData?.idNumber || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Department:</strong> {studentData?.department || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Course:</strong> {studentData?.course || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Year:</strong> {studentData?.year || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Date of Birth:</strong> {studentData?.dateOfBirth || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {studentData?.email || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

  {/* Filtered Medical Records */}
  <Box
   sx={{
    backgroundColor: "#ffffff", // Set a permanent white background
    minHeight: "100vh", // Ensure it covers the full height of the screen
    padding: 2,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  }}
  >
    <Typography variant="h6" sx={{ olor: "#88343b" }}>
      Checkup Records
    </Typography>
    {medicalRecords
      ?.filter((record) => selectedDates.includes(record.date))
      .map((record, index) => (
        <Card key={index}>
          <CardContent>
            <Typography variant="body2">
              <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}{" "}
              {new Date(record.date).toLocaleTimeString()}
            </Typography>
            <Typography variant="body2">
              <strong>Blood Pressure:</strong> {record.bloodPressure}
            </Typography>
            <Typography variant="body2">
              <strong>Heart Rate:</strong> {record.heartRate}
            </Typography>
            <Typography variant="body2">
              <strong>Respiratory Rate:</strong> {record.respiratoryRate}
            </Typography>
            <Typography variant="body2">
              <strong>Temperature:</strong> {record.temperature}
            </Typography>
            <Typography variant="body2">
              <strong>Oral Health Status:</strong> {record.oralHealthStatus}
            </Typography>
            <Typography variant="body2">
              <strong>Gum Health:</strong> {record.gumHealth}
            </Typography>
            <Typography variant="body2">
              <strong>Presence of Cavities:</strong> {record.presenceOfCavities}
            </Typography>
            <Typography variant="body2">
              <strong>General Health Condition:</strong>{" "}
              {record.generalHealthCondition}
            </Typography>
            <Typography variant="body2">
              <strong>Specific Health Concerns:</strong>{" "}
              {record.specificHealthConcerns}
            </Typography>
          </CardContent>
        </Card>
        
      ))}
      
  </Box>
  

        </Box>







<Collapse in={showIntraoralExam} unmountOnExit>

<Box sx={{ display: "flex", gap: 2, marginBottom: 2 , alignItems: 'center', justifyContent: "center", marginTop:2 }}>
  <Button
    variant="contained"
    sx={{ backgroundColor: "#90343c", "&:hover": { backgroundColor: "#F7C301" , } }}
    onClick={handlePrintIntraoral}
  >
    Print All
  </Button>
  <Button
    variant="contained"
    sx={{ backgroundColor: "#90343c", "&:hover": { backgroundColor: "#F7C301" } }}
    onClick={() => setOpenIntraoralDateDialog(true)}
  >
    Print Record by Date
  </Button>
</Box>


  <Box ref={intraoralRef} sx={{ marginTop: 2, backgroundColor: 'white', borderRadius:'10px', padding:'10px' }}>
    <Typography variant="h6" sx={{ color: "#88343b", marginBottom: 2 }}>
      Intraoral Examination Record
    </Typography>
    {Object.entries(
      intraoralRecords.reduce((acc, record) => {
        const date = new Date(record.savedAt).toLocaleDateString(); 
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
      }, {})
    ).map(([date, records], index) => (
      <Box key={index} sx={{ marginBottom: 4 }}>
        {/* Display Date Once */}
        <Typography variant="h6" sx={{ color: "#90343c", marginBottom: 2 }}>
          {date}
        </Typography>

        {/* Flexbox to Align Upper and Lower Tables */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          {/* Right Upper Teeth Table */}
          <table
            style={{
              width: "48%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tooth Number</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(record => record.toothNumber >= 11 && record.toothNumber <= 18)
                .map((record, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <strong style={{ color: "black" }}>{record.toothNumber}</strong>
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {record.status}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {new Date(record.savedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Left Upper Teeth Table */}
          <table
            style={{
              width: "48%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tooth Number</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(record => record.toothNumber >= 21 && record.toothNumber <= 28)
                .map((record, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <strong style={{ color: "black" }}>{record.toothNumber}</strong>
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {record.status}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {new Date(record.savedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>

        {/* Flexbox to Align Lower Tables */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          

          {/* Right Lower Teeth Table */}
          <table
            style={{
              width: "48%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tooth Number</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(record => record.toothNumber >= 41 && record.toothNumber <= 48)
                .map((record, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <strong style={{ color: "black" }}>{record.toothNumber}</strong>
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {record.status}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {new Date(record.savedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Left Lower Teeth Table */}
          <table
            style={{
              width: "48%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tooth Number</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(record => record.toothNumber >= 31 && record.toothNumber <= 38)
                .map((record, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <strong style={{ color: "black" }}>{record.toothNumber}</strong>
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {record.status}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                      {new Date(record.savedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

        </Box>
      </Box>
    ))}
  </Box>
</Collapse>


{/* Date Selection Dialog */}
<Dialog open={openIntraoralDateDialog} onClose={() => setOpenIntraoralDateDialog(false)}>
  <DialogTitle>Select Dates to Print</DialogTitle>
  <DialogContent>
    <Select
      multiple
      value={selectedDates}
      onChange={(e) => setSelectedDates(e.target.value)}
      renderValue={(selected) =>
        selected.map((date) => new Date(date).toLocaleDateString()).join(", ")
      }
      fullWidth
    >
      {uniqueDates.map((date, index) => (
        <MenuItem key={index} value={date}>
          <Checkbox checked={selectedDates.includes(date)} />
          <ListItemText primary={date} />
        </MenuItem>
      ))}
    </Select>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenIntraoralDateDialog(false)}>Cancel</Button>
    <Button
      onClick={() => {
        setOpenIntraoralDateDialog(false);
        handlePrintIntraoralByDate();
      }}
      disabled={selectedDates.length === 0}
    >
      Print
    </Button>
  </DialogActions>
</Dialog>

      </Box>
      
      </Box>
      </Box>
      
      </Box>
  );
};

export default DentalRecordDrawer;
