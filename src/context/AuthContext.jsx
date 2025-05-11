import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Update localStorage when user changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Simple login function (in a real app, you'd connect to a backend)
  const login = (username, password) => {
    // For demo purposes only - this is NOT secure
    // In a real app, you'd validate credentials against a backend
    if (username && password.length >= 6) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};
