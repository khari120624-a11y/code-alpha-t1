import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if user session data exists in LocalStorage
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Configure global default header for authenticated axios requests
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Profile update handler
  const updateProfile = async (profileData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.put('/api/auth/profile', profileData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
