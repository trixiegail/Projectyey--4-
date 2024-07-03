import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
  
    if (userData) {
      const { student_id, first_name, last_name, gender, phone_number, username } = userData;
  
      if (student_id && first_name && last_name) {
        setUser({
          studentId: student_id,
          firstName: first_name,
          lastName: last_name,
          gender: gender || null,
          phone_number: phone_number || null,
          username: username || null,
        });
      } else {
        console.error('Invalid user data:', userData);
      }
    } else {
      console.error('Invalid user data:', userData);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    console.log('Auth Context - User object:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  return { isLoggedIn, user, login, logout };
};