// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Load doctor info from localStorage on page load
  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
    setIsLoading(false); // Done loading
  }, []);

  const loginDoctor = (data) => {
    setDoctor(data);
    localStorage.setItem('doctor', JSON.stringify(data)); // Save to localStorage
  };

  const logoutDoctor = () => {
    setDoctor(null);
    localStorage.removeItem('doctor'); // Remove from localStorage
  };

  // Ensure the app waits until data is loaded before rendering children
  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ doctor, loginDoctor, logoutDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};
