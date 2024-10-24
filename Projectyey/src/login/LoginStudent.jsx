import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginStudent = () => {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleStudentLogin = async (event) => {
    event.preventDefault();

    try {
      const endpoint = 'http://localhost:8080/student/login';
      const response = await axios.post(endpoint, { idNumber, password });

      if (response.data) {
        console.log('Login successful:', response.data);

        // Store first and last name in localStorage
        const { firstname, lastname } = response.data;
        localStorage.setItem('studentName', `${firstname} ${lastname}`);
        console.log(`Stored Student Name: ${firstname} ${lastname}`);  // Debugging log

        // Store studentIdNumber in localStorage
      localStorage.setItem('studentIdNumber', idNumber);
      console.log(`Stored Student ID Number: ${idNumber}`);  // Debugging log
        
        navigate('/home');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-[#88343B] border-gray-200 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-[#fff]">Student Access Module</h2>
        <form onSubmit={handleStudentLogin}>
          <div className="mb-4">
            <p>{errorMessage}</p>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#fff]">
              Username (ID Number)
            </label>
            <input
              type="text"
              id="idNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#fff]">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium text-[#fff]">Forgot your password? <Link to="/forgot-password">Click here</Link></p>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-[#F7C301] rounded hover:bg-yellow-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginStudent;
