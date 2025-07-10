// AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../services/apiClient";

// 1. Create Context
export const AuthContext = createContext();

// 2. Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fungsi untuk menangani data login (baik dari lokal maupun Google)
  const processLoginData = useCallback((data) => {
    console.log("Processing login data:", data);
    
    // Pastikan data dan token ada
    if (data && data.token) {
      try {
        // Validasi token dengan decode
        const decoded = jwtDecode(data.token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          setUser(data);
          setIsAuthenticated(true);
          console.log("Login successful, user authenticated");
        } else {
          console.error("Token expired");
          throw new Error("Token expired");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("userInfo");
      }
    } else {
      console.error("Login process failed: Data or token is missing.");
    }
  }, []);

  // useEffect untuk memuat sesi dari localStorage dan mendengarkan popup
  useEffect(() => {
    // --- Memuat sesi yang ada ---
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
      console.error("Failed to load user info from storage", error);
      localStorage.removeItem("userInfo");
    } finally {
      setIsLoading(false);
    }

    // --- LOGIKA BARU: Mendengarkan pesan dari jendela popup Google ---
    const handlePopupMessage = (event) => {
      console.log("Popup message received:", event);
      
      // Daftar origin yang diizinkan
      const allowedOrigins = [
        import.meta.env.VITE_APP_API_URL || 'http://localhost:5000',
        'https://projek-web-kanban-production.up.railway.app',
        'http://localhost:5000',
        'http://localhost:3000'
      ];

      console.log("Event origin:", event.origin);
      console.log("Allowed origins:", allowedOrigins);
      
      // Pastikan pesan datang dari sumber yang aman
      if (allowedOrigins.includes(event.origin)) {
        console.log("Origin verified, processing data...");
        
        // Cek berbagai format data yang mungkin
        if (event.data && event.data.token) {
          console.log("Valid login data received, processing...", event.data);
          processLoginData(event.data);
        } else if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          console.log("Google auth success message received");
          processLoginData(event.data.user);
        } else if (event.data && event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.error("Google auth error:", event.data.error);
        } else {
          console.log("Message received but no valid token found:", event.data);
        }
      } else {
        console.log("Message from unauthorized origin:", event.origin);
      }
    };

    window.addEventListener('message', handlePopupMessage);

    return () => {
      window.removeEventListener('message', handlePopupMessage);
    };
  }, [processLoginData]);

  // Fungsi Login Lokal
  const login = async (credentials) => {
    try {
      console.log("Attempting local login...");
      const response = await apiClient.post("/api/auth/login", credentials);
      console.log("Login response:", response.data);
      processLoginData(response.data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Fungsi Register Lokal
  const register = async (userData) => {
    try {
      console.log("Attempting registration...");
      const response = await apiClient.post("/api/auth/register", userData);
      console.log("Registration response:", response.data);
      
      // Jika registrasi berhasil dan langsung login
      if (response.data && response.data.token) {
        processLoginData(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Fungsi Google Login - Buka popup
  const initiateGoogleLogin = () => {
    try {
      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      const googleAuthUrl = `${API_URL}/api/auth/google`;
      
      console.log("Opening Google auth popup:", googleAuthUrl);
      
      const popup = window.open(
        googleAuthUrl,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Monitor popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log("Google auth popup closed");
        }
      }, 1000);

      return popup;
    } catch (error) {
      console.error("Failed to open Google auth popup:", error);
      throw error;
    }
  };

  // Fungsi untuk handle Google login dari token
  const handleGoogleLogin = (token) => {
    try {
      console.log("Handling Google login with token");
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

  // Fungsi Logout
  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("userInfo");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fungsi untuk update data user di context (setelah edit profil)
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