import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('segmentiq_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('segmentiq_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('segmentiq_auth_user');
      }
    } catch (e) {
      console.error('Failed to persist auth session', e);
    }
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        'Unable to connect to authentication server.';
      return { success: false, error: errorMsg };
    }
  };

  const signup = async ({ name, email, password, role, storeName }) => {
    try {
      const user = await signupUser({ name, email, password, role, storeName });
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        'Unable to register account. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('segmentiq_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
