import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    idNumber: '',
    birthdate: '',
  });
  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Enable the button only if all fields are filled
    const { email, idNumber, birthdate } = formData;
    if (email && idNumber && birthdate) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('There was an error processing your request.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://source.unsplash.com/random/1600x900?dental')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 bg-[#88343B] border-gray-200 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-[#fff]">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#fff]">
              Enter your school email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="idNumber" className="block mb-2 text-sm font-medium text-[#fff]">
              ID Number
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-[#fff]">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Reduced width of the button and centered */}
          <button
            type="submit"
            className={`w-1/2 px-6 py-3 font-bold text-white rounded mx-auto block ${
              isButtonDisabled ? 'bg-gray-400' : 'bg-[#F7C301]'
            } hover:bg-yellow-600`}
            disabled={isButtonDisabled}
          >
            Reset Password
          </button>

          {message && (
            <p className="mt-4 text-sm text-white">
              {message}
            </p>
          )}

          <p className="mt-6 text-sm font-medium text-[#fff] text-center">
            Remembered your password? <Link to="/login-doctor" className="underline">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
