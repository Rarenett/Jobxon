import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserType(parsedUser.user_type);
    }
  }, []);

  // Login function
  const login = (accessToken, refreshToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    setUserType(userData.user_type);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserType(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!token) return;

    const SESSION_LIMIT = 1800 * 1000; // 30 minutes
    let lastActivity = Date.now();
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };
    
    const events = ["mousemove", "mousedown", "click", "scroll", "keypress"];
    events.forEach(evt => window.addEventListener(evt, updateActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_LIMIT) {
        logout();
        clearInterval(interval);
        events.forEach(evt => window.removeEventListener(evt, updateActivity));
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      events.forEach(evt => window.removeEventListener(evt, updateActivity));
    };
  }, [token]);

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        userType, 
        login, 
        logout, 
        isAuthenticated: !!token,
        isCandidate: userType === 'candidate',
        isEmployer: userType === 'employer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
