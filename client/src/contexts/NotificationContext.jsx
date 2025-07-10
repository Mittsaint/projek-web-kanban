import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../services/notificationService";
import NotificationContext from "../hooks/NotificationContextObject";

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setError(null); // Clear error on logout/unauthenticated
      return;
    }
    try {
      setError(null); // Reset error before fetching
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Could not fetch notifications in context:", err);
      setError("Failed to load notifications. Please try again later.");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      const intervalId = setInterval(fetchNotifications, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async () => {
    try {
      await notificationService.markNotificationsAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setError(null); // Clear error on success
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
      setError("Failed to mark notifications as read.");
    }
  };

  const value = {
    notifications,
    unreadCount,
    error,
    markAsRead,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
