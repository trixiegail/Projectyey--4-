import { Navigate } from 'react-router-dom';

const StudentProtectedRoute = ({ children }) => {
  const studentName = localStorage.getItem('studentName');
  const studentIdNumber = localStorage.getItem('studentIdNumber'); // Fetch the student ID number

  // If studentName or studentIdNumber is not found, redirect to the login page
  if (!studentName || !studentIdNumber || studentName === 'Sign in') {
    return <Navigate to="/login-student" replace />;
  }

  // Store studentIdNumber and studentName globally if needed
  return children; // Render the component if logged in
};

export default StudentProtectedRoute;
