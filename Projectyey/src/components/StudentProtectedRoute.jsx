import { Navigate } from 'react-router-dom';
import LoginStudent from '../login/LoginStudent';

const StudentProtectedRoute = ({ children }) => {
  const studentName = localStorage.getItem('studentName') || 'Sign in'; // Get student name from storage

  if (studentName === 'Sign in') {
    return <Navigate to="/login-student" replace />; // Redirect to login if not logged in
  }

  return children; // Render the component if logged in
};

export default StudentProtectedRoute;
