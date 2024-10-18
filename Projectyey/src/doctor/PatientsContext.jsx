import React, { createContext, useState } from 'react';

// Create PatientsContext
export const PatientsContext = createContext();

// PatientsProvider component to provide the context to children
export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  // Function to add a patient to the list
  const addPatient = (patient) => {
    setPatients((prevPatients) => [...prevPatients, patient]);
  };

  // Function to remove a patient from the list
  const removePatient = (patientId) => {
    setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId));
  };

  return (
    <PatientsContext.Provider value={{ patients, addPatient, removePatient }}>
      {children}
    </PatientsContext.Provider>
  );
};
