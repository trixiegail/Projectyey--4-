import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import { Box, Card, CardContent, Collapse, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Studnav from "../components/Studnav";
import Studfooter from "../components/Studfooter";
import {
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  Email as EmailIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

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
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [intraoralRecords, setIntraoralRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const studentIdNumber = localStorage.getItem("studentIdNumber");
      if (studentIdNumber) {
        try {
          const response = await axios.get(
            `https://dentalmanagement-app.onrender.com/student/students/${studentIdNumber}`
          );
          const data = response.data;
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
          const response = await axios.get(
            `https://dentalmanagement-app.onrender.com/api/checkups/student/${studentIdNumber}`
          );
          const records = response.data;
          setMedicalRecords(
            records.sort((a, b) => new Date(b.date) - new Date(a.date))
          );
        } catch (error) {
          console.error("Error fetching medical records:", error);
        }
      }
    };

    const fetchIntraoralRecords = async () => {
      const studentIdNumber = localStorage.getItem("studentIdNumber");
      if (studentIdNumber) {
        try {
          const response = await axios.get(
            `https://dentalmanagement-app.onrender.com/student/${studentIdNumber}/tooth-statuses`
          );
          const records = response.data;
          setIntraoralRecords(
            records.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
          );
        } catch (error) {
          console.error("Error fetching intraoral records:", error);
        }
      }
    };

    fetchStudentInfo();
    fetchMedicalRecords();
    fetchIntraoralRecords();
  }, []);

  const handleNavigate = () => {
    console.log("Navigating with data:", {
      studentData: personalInfo,
      medicalRecords,
      intraoralRecords,
    });
    navigate("/dental-records", {
      state: {
        studentData: personalInfo,
        medicalRecords: medicalRecords,
        intraoralRecords: intraoralRecords,
      },
    });
  };

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

  
  


  return (
    <>
      <Studnav />
      <section className="relative bg-gray-50 py-16">
  <div className="container mx-auto">
    {/* Content Wrapper */}
    <div className="bg-white shadow-lg rounded-lg px-8 py-10 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
      {/* Left Side: Profile Picture */}
      <div className="flex-shrink-0">
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
            className="h-40 w-40 lg:h-48 lg:w-48 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105"
          />
        </label>
      </div>

      {/* Right Side: Student Information */}
      <div className="flex-1 space-y-6">
        {/* Student's Name and Basic Info */}
        <div className="space-y-4">
          <div>
            {isEditMode ? (
              <TextField
                name="fullName"
                variant="outlined"
                value={personalInfo.fullName}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    fullName: e.target.value,
                  })
                }
                fullWidth
                size="small"
                margin="dense"
              />
            ) : (
              <Typography
                variant="h4"
                className="text-gray-900 font-bold leading-tight"
              >
                {personalInfo.fullName || "Your Name"}
              </Typography>
            )}
          </div>
          <div>
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
              <Typography className="text-gray-600">
              <strong>Student ID:</strong> {personalInfo.studentId || "N/A"}
            </Typography>
            )}
          </div>
          <div>
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
              <Typography className="text-gray-600">
                <strong>Year</strong>: {personalInfo.year || "N/A"}
              </Typography>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="mt-6 space-y-4">
          <Typography
            variant="h5"
            className="text-gray-900 font-semibold mb-4"
          >
            Personal Information
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: <strong>Course</strong>, 
                value: personalInfo.course,
                icon: <SchoolIcon fontSize="small" />
              },
              {
                label: <strong>Department</strong>, 
                value: personalInfo.department?.toUpperCase(), 
                icon: <BusinessIcon fontSize="small" />
              },
              {
                label: <strong>Date of Birth</strong>, 
                value: personalInfo.dateOfBirth,
                icon: <CalendarTodayIcon fontSize="small" />
              },
              {
                label: <strong>Email</strong>, 
                value: personalInfo.email,
                icon: <EmailIcon fontSize="small" />
              },
            ].map(({ label, value, icon }, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div className="text-gray-500">{icon}</div>
                <Typography className="text-gray-800 font-medium">
                  {label}: {value || "N/A"}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            className="bg-[#88343B] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#761d2e] transition-colors"
            onClick={handleNavigate}
          >
            View Medical Records
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>
      <Studfooter />
    </>
  );
}

export default Home;
