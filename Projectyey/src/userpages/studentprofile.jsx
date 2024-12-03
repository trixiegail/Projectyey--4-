import {
  BriefcaseIcon,
  BuildingLibraryIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import {
  Box,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography as MuiTypography,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import React, { useState , useEffect} from "react";
import Studfooter from "../components/Studfooter";
import Studnav from "../components/Studnav";
import axios from "axios";
import { useLocation , useNavigate  } from 'react-router-dom';

export function Home() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    studentId: "",
    year: "",
    location: "",
    course: "",
    department: "",
    dateOfBirth: "",
    email: "",
  });
  


  const [imageSrc, setImageSrc] = useState("/student.png");
  const [newImage, setNewImage] = useState(null);

  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [activeTab, setActiveTab] = useState("checkup");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const navigate = useNavigate();
  const [intraoralRecordsFetched, setIntraoralRecordsFetched] = useState(false);
  const [intraoralRecords, setIntraoralRecords] = useState([]); 
  const applicant = location.state?.applicant || {};
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const studentIdNumber = localStorage.getItem("studentIdNumber");

      if (studentIdNumber) {
        try {
          const response = await axios.get(`https://dentalmanagement.azurewebsites.net/student/students/${studentIdNumber}`);
          const data = response.data;

          console.log("Fetched student data:", data); // Log the data to verify

          // Update state with the fetched data using the correct field names
          setPersonalInfo({
            fullName: `${data.firstname} ${data.lastname}`,
            studentId: data.idNumber,
            year: data.yearLevel || "",
            location: data.location || "",
            course: data.program || "", 
            department: data.department || "",
            dateOfBirth: data.birthdate || "", 
            email: data.email || "", 
          });

          if (data.profilePicture) {
            setImageSrc(`data:image/png;base64,${data.profilePicture}`);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    const fetchMedicalRecords = async () => {
      const studentIdNumber = localStorage.getItem("studentIdNumber");
      
      if (studentIdNumber) {
        try {
          const response = await axios.get(`https://dentalmanagement.azurewebsites.net/api/checkups/student/${studentIdNumber}`);
          const records = response.data;

          setMedicalRecords(records.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
          console.error("Error fetching medical records:", error);
        }
      }
    };

    fetchStudentInfo();
    fetchMedicalRecords();
  }, []);


  


  // Toggle the medical records drawer
  const toggleMedicalRecordsDrawer = () => {
    setShowMedicalRecords(!showMedicalRecords);
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleDone = () => {
    setSelectedRecord(null); // Clear the selected record
    setShowMedicalRecords(false); // Close the drawer
  };

  // Handle input change for personal information
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setIsEditMode(false);
    // Save the updated personal info and image (optional backend call here)
    // You can also handle file upload to a server if needed.
  };

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    department: '',
    course: '',
    year: '',
    dateOfBirth: '',
    email: '',
    toothStatus: [], 
    teethStatuses: [] ,
    customCondition: ''
  });


  const handleAllToothStatuses = async () => {

    try {
        console.log('Fetching all tooth statuses for:', applicant.studentIdNumber);
        const response = await fetch(`https://dentalmanagement.azurewebsites.net/student/${applicant.studentIdNumber}/tooth-statuses`);
  
        if (response.ok) {
            const records = await response.json();
            const sortedRecords = records.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
            setIntraoralRecords(sortedRecords);
            setShowMedicalRecords(true);
        } else {
            console.error('Failed to fetch all tooth statuses', response.status, response.statusText);
            alert(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching all tooth statuses:', error);
        alert(`Error fetching data: ${error.message}`);
    }
  };

  return (
      <>
        <div>
          <Studnav />

          <section className="relative block h-[80vh]">
            <div className="bg-profile-background absolute top-0 bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
            <img
                className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center "
                src="/Banner.png"
                alt="Your Company"
            />
          </section>

          <section className="relative bg-white py-16">
            <div className="relative mb-6 -mt-40 flex w-full px-4 min-w-0 flex-col break-words bg-white">
              <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="relative flex gap-6 items-start">
                    <div className="-mt-20 w-40">
                      <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          onChange={handleImageChange}
                      />
                      <label htmlFor="image-upload">
                        <Avatar
                            src={imageSrc}
                            alt="Profile picture"
                            variant="circular"
                            className="h-full w-full cursor-pointer"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col mt-2">
                      <div className="text-wrapper">
                        {isEditMode ? (
                            <TextField
                                name="fullName"
                                variant="outlined"
                                value={personalInfo.fullName}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                                fullWidth
                                size="small"
                                margin="dense"
                            />
                        ) : (
                            <Typography variant="h4" color="blue-gray">
                              {personalInfo.fullName}
                            </Typography>
                        )}
                      </div>

                      <div className="text-wrapper">
                        {isEditMode ? (
                            <TextField
                                name="studentId"
                                variant="outlined"
                                value={personalInfo.studentId}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                margin="dense"
                            />
                        ) : (
                            <Typography
                                variant="paragraph"
                                color="gray"
                                className="!mt-0 font-normal"
                            >
                              {personalInfo.studentId}
                            </Typography>
                        )}
                      </div>

                      <div className="text-wrapper">
                        {isEditMode ? (
                            <TextField
                                name="year"
                                variant="outlined"
                                value={personalInfo.year}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                margin="dense"
                            />
                        ) : (
                            <Typography
                                variant="paragraph"
                                color="gray"
                                className="!mt-0 font-normal"
                            >
                              Year - {personalInfo.year}
                            </Typography>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 mb-10 flex lg:flex-col justify-between items-center lg:justify-end lg:mb-0 lg:px-4 flex-wrap lg:-mt-5">
                    {/* {isEditMode ? (
                        <Button className="bg-[#88343B] w-fit lg:ml-auto" onClick={handleSave}>
                          Save
                        </Button>
                    ) : (
                        <Button
                            className="bg-[#88343B] w-fit lg:ml-auto"
                            onClick={() => setIsEditMode(true)}
                        >
                          Edit
                        </Button>
                    )} */}
                    <div className="flex justify-start py-4 pt-8 lg:pt-4">
                      <div className="mr-4 p-3 text-center">
                        <Button
                            className="bg-[#88343B]"
                            onClick={toggleMedicalRecordsDrawer}
                        >
                          Medical Records
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="-mt-4 container space-y-2">
                  <h1 className="font-semibold leading-7 text-gray-900 text-xl">
                    Personal Information
                  </h1>

                  <div className="text-wrapper">
                    {isEditMode ? (
                        <TextField
                            name="location"
                            variant="outlined"
                            value={personalInfo.location}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                          <Typography className="font-medium text-blue-gray-500">
                            {personalInfo.location}
                          </Typography>
                        </div>
                    )}
                  </div>

                  <div className="text-wrapper">
                    {isEditMode ? (
                        <TextField
                            name="course"
                            variant="outlined"
                            value={personalInfo.course}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                          <Typography className="font-medium text-blue-gray-500">
                            {personalInfo.course}
                          </Typography>
                        </div>
                    )}
                  </div>

                  <div className="text-wrapper">
                    {isEditMode ? (
                        <TextField
                            name="department"
                            variant="outlined"
                            value={personalInfo.department}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                          <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                          <Typography className="font-medium text-blue-gray-500">
                            {personalInfo.department}
                          </Typography>
                        </div>
                    )}
                  </div>

                  <div className="text-wrapper">
                    {isEditMode ? (
                        <TextField
                            name="dateOfBirth"
                            label="Date of Birth"
                            variant="outlined"
                            value={personalInfo.dateOfBirth}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                          <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                          <Typography className="font-medium text-blue-gray-500">
                            Date of Birth: {personalInfo.dateOfBirth}
                          </Typography>
                        </div>
                    )}
                  </div>

                  <div className="text-wrapper">
                    {isEditMode ? (
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={personalInfo.email}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                          <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                          <Typography className="font-medium text-blue-gray-500">
                            Email: {personalInfo.email}
                          </Typography>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Medical Records Drawer */}
          <Drawer anchor="right" open={showMedicalRecords} onClose={() => setShowMedicalRecords(false)}>
  <Box
    sx={{
      width: 400,
      padding: 2,
      display: "flex",
      flexDirection: "column",
      height: "100vh", 
      boxSizing: "border-box", 
    }}
  >
    {/* Header */}
    <Typography variant="h6" gutterBottom align="center">
      Medical Records
    </Typography>
    <Tabs
      value={activeTab}
      onChange={(event, newValue) => {
        setActiveTab(newValue);
        if (newValue === "intraoral") {
          handleAllToothStatuses(); 
          setSelectedRecord(null);
        }
      }}
      aria-label="medical records tabs"
    >
      <Tab label="Checkup" value="checkup" />
      <Tab label="Intraoral Examination" value="intraoral" />
    </Tabs>

    {/* Content Container */}
    <Box
      sx={{
        flexGrow: 1, 
        overflowY: "auto", 
        marginBottom: "70px", 
      }}
    >
      {/* Checkup Tab */}
      {activeTab === "checkup" && (
        <List>
          {medicalRecords.map((record, index) => (
            <ListItem key={index} button onClick={() => setSelectedRecord(record)}>
              <ListItemText
                primary={`${new Date(record.date).toDateString()} - ${new Date(record.date).toLocaleTimeString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Intraoral Examination Tab */}
      {activeTab === "intraoral" && (
  <List>
    {intraoralRecords && intraoralRecords.length > 0 ? (
      Object.keys(
        intraoralRecords.reduce((acc, record) => {
          const date = new Date(record.savedAt).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(record);
          return acc;
        }, {})
      ).map((date, index) => (
        <div key={index}>
          <ListItem button onClick={() => toggleDateExpansion(date)}>
            <ListItemText primary={`${date}`} />
          </ListItem>
          <Collapse in={expandedDates[date]} timeout="auto" unmountOnExit>
            {intraoralRecords
              .filter((record) => new Date(record.savedAt).toLocaleDateString() === date)
              .map((record, i) => (
                <Card key={i} sx={{ marginBottom: 2, marginLeft: 3 }}>
                  <CardContent>
                    <Typography variant="body1">
                      Tooth Number: <strong>{record.toothNumber}</strong>
                    </Typography>
                    <Typography variant="body1">Status: {record.status}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Saved At: {new Date(record.savedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Collapse>
        </div>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
        No Intraoral Examination records available.
      </Typography>
    )}
  </List>
)}

{/* Display selected record details only if in Checkup tab */}
{activeTab === 'checkup' && selectedRecord && (
      <div>
        <Typography variant="h6" gutterBottom>
          Records for {new Date(selectedRecord.date || selectedRecord.savedAt).toDateString()} - {new Date(selectedRecord.date || selectedRecord.savedAt).toLocaleTimeString()}
        </Typography>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="body2">Blood Pressure: {selectedRecord.bloodPressure}</Typography>
            <Typography variant="body2">Heart Rate: {selectedRecord.heartRate}</Typography>
            <Typography variant="body2">Respiratory Rate: {selectedRecord.respiratoryRate}</Typography>
            <Typography variant="body2">Temperature: {selectedRecord.temperature}</Typography>
            <Typography variant="body2">Oral Health Status: {selectedRecord.oralHealthStatus}</Typography>
            <Typography variant="body2">Gum Health: {selectedRecord.gumHealth}</Typography>
            <Typography variant="body2">Cavities: {selectedRecord.presenceOfCavities}</Typography>
            <Typography variant="body2">General Health Condition: {selectedRecord.generalHealthCondition}</Typography>
            <Typography variant="body2">Specific Health Condition: {selectedRecord.specificHealthConcerns}</Typography>
          </CardContent>
        </Card>
      </div>
    )}
    </Box>

    {/* Print Records Button Fixed at Bottom */}
    <Box
      sx={{
        position: "fixed", 
        bottom: 10, 
      }}
    >
    </Box>
  </Box>
</Drawer>

          <Studfooter />
        </div>
      </>
  );
}

export default Home;