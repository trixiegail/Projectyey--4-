import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);

    if (userData) {
      const { id, first_name, last_name, department, program, yearLevel, birthdate, email } = userData;

      if (id && first_name && last_name) {
        setUser({
          studentId: id,
          firstName: first_name,
          lastName: last_name,
          department: department || null,
          program: program || null,
          yearLevel: yearLevel || null,
          birthdate: birthdate || null,
          email: email || null
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