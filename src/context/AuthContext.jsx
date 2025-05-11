import React, { createContext, useState, useEffect, useMemo } from "react";

// Create context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// In a real app, this would connect to a backend
// For this example, we'll just store in localStorage
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // For demo purposes, accept any non-empty credentials
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // In a real app, you would validate credentials with an API
      const userData = {
        id: Date.now().toString(),
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
      };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      isLoading,
    }),
    [isAuthenticated, user, isLoading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
