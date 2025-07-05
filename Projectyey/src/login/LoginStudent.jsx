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
      const endpoint = 'https://dentalmanagement-app.onrender.com/student/login';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-[#88343B] border-gray-200 rounded-2xl shadow-md overflow-hidden">
        {/* Tooth GIF Section */}
        <div className="flex items-center justify-center w-1/2 bg-[#F7C301] rounded-l-2xl">
          <img
            src="/giphy.gif"
            alt="Tooth GIF"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Login Form Section */}
        <div className="w-1/2 p-6 bg-[#88343B] rounded-r-2xl">
          <h2 className="mb-6 text-2xl font-bold text-center text-[#fff]">Student Access Module</h2>
          <form onSubmit={handleStudentLogin}>
            <div className="mb-4">
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#fff]">
                Username (ID Number)
              </label>
              <input
                type="text"
                id="idNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-[#fff]">
                Forgot your password? <Link to="/forgot-password">Click here</Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-[#F7C301] rounded-lg hover:bg-yellow-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;
