// PatientsContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/patients/')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          console.error('Expected an array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  return (
    <PatientsContext.Provider value={{ patients, setPatients }}>
      {children}
    </PatientsContext.Provider>
  );
};
