import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('name');
    
    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setUserName('');
    navigate("/")
  };

  const handleLogin = (name, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    setIsLoggedIn(true);
    setUserName(name);
    navigate("/")
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
