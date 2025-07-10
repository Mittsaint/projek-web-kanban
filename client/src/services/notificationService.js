import apiClient from './apiClient';

/**
 * Service object for handling notification-related API requests.
 */
const notificationService = {
  /**
   * Fetches notifications for the currently authenticated user.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of notification objects.
   */
  async getNotifications() {
    try {
      const response = await apiClient.get('/api/notifications');
      return response.data;
    } catch (error) {
      // Log the error for debugging and re-throw it to be handled by the calling function (e.g., in a UI component).
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  /**
   * Marks all of the user's notifications as read.
   * @returns {Promise<object>} A promise that resolves upon successful completion.
   */
  async markNotificationsAsRead() {
    try {
      const response = await apiClient.post('/api/notifications/mark-as-read');
      return response.data;
    } catch (error) {
      // Log the error for debugging and re-throw it.
      console.error("Failed to mark notifications as read:", error);
      throw error;
    }
  },
};

export default notificationService;
