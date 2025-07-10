// src/hooks/useNotifications.js
import { useContext } from "react";
import NotificationContext from "./NotificationContextObject";

/**
 * Custom hook to easily access the notification context.
 * Provides notifications, unread count, and actions.
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
