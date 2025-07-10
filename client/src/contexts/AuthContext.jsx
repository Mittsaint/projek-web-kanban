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
    // Pastikan data dan token ada
    if (data && data.token) {
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
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
      // Izinkan pesan hanya dari origin backend Anda
      const allowedOrigin = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

      // Pastikan pesan datang dari sumber yang aman dan berisi token
      if (event.origin === allowedOrigin && event.data && event.data.token) {
        console.log("Valid login data received, processing...", event.data);
        processLoginData(event.data);
      }
    };

    window.addEventListener('message', handlePopupMessage);

    return () => {
      window.removeEventListener('message', handlePopupMessage);

    };
  }, [processLoginData]); // `processLoginData` disertakan dalam dependensi

  // Fungsi Login Lokal
  const login = async (credentials) => {
    try {
      const response = await apiClient.post("/api/auth/login", credentials);
      processLoginData(response.data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
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

  // Fungsi Logout
  const logout = () => {
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
    logout,
    isLoading,
    updateUserContext,
    handleGoogleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
