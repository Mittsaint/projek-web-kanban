// ✅ src/contexts/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../services/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const processLoginData = useCallback((data) => {
    if (data && data.token) {
      try {
        const decoded = jwtDecode(data.token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          setUser(data);
          setIsAuthenticated(true);
        } else {
          throw new Error("Token expired");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const currentTime = Date.now() / 1000;
        if (userInfo.token && jwtDecode(userInfo.token).exp > currentTime) {
          setUser(userInfo);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("userInfo");
        }
      }
    } catch (error) {
      localStorage.removeItem("userInfo", error);
    } finally {
      setIsLoading(false);
    }

    const handlePopupMessage = (event) => {
      const allowedOrigins = [
        import.meta.env.VITE_APP_API_URL || "http://localhost:5000",
        "https://projek-web-kanban-production.up.railway.app",
        "http://localhost:5000",
        "http://localhost:3000",
      ];

      if (allowedOrigins.includes(event.origin)) {
        if (event.data && event.data.token) {
          processLoginData(event.data);
        } else if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
          processLoginData(event.data.user);
        }
      }
    };

    window.addEventListener("message", handlePopupMessage);
    return () => window.removeEventListener("message", handlePopupMessage);
  }, [processLoginData]);

  const login = async (credentials) => {
    const response = await apiClient.post("/api/auth/login", credentials);
    processLoginData(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await apiClient.post("/api/auth/register", userData);
    if (response.data?.token) processLoginData(response.data);
    return response.data;
  };

  const initiateGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000";
    const googleAuthUrl = `${API_URL}/api/auth/google`;
    const popup = window.open(
      googleAuthUrl,
      "googleAuth",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );
    const checkClosed = setInterval(() => {
      if (popup.closed) clearInterval(checkClosed);
    }, 1000);
    return popup;
  };

  const handleGoogleLogin = (token) => {
    try {
      const decoded = jwtDecode(token);
      const userInfo = {
        _id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        provider: decoded.provider || "google",
        profilePictureUrl: decoded.profilePictureUrl || "",
        gender: decoded.gender || "",
        socialLinks: decoded.socialLinks || [],
        token,
      };
      processLoginData(userInfo);
    } catch (error) {
      console.error("Error decoding Google token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserContext = useCallback((updatedData) => {
    const oldUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const newUserInfo = { ...oldUserInfo, ...updatedData };
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    setUser(newUserInfo);
  }, []);

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading,
    updateUserContext,
    handleGoogleLogin,
    initiateGoogleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
