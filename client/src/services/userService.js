// services/userService.js
import apiClient from "./apiClient";

/**
 * Service object for handling user-related API requests.
 */
const userService = {
  /**
   * Updates the user's profile.
   * Sends data as multipart/form-data because it may include a profile picture.
   * @param {FormData} profileData - The form data containing profile information.
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(`/api/users/profile`, profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  async changePassword(passwordData) {
    try {
      // passwordData akan berisi { currentPassword, newPassword }
      const response = await apiClient.put(
        "/api/users/change-password", // Pastikan endpoint ini benar
        passwordData
      );
      return response.data; // Seharusnya mengembalikan { message: "..." }
    } catch (error) {
      console.error("Error changing password:", error);
      throw error; // Lemparkan error agar bisa ditangkap di komponen
    }
  },

  async getLoginSessions() {
    try {
      const response = await apiClient.get("/api/sessions");
      return response.data;
    } catch (error) {
      console.error("Error fetching login sessions:", error);
      throw error;
    }
  },

  async logoutSession(sessionId) {
    try {
      const response = await apiClient.delete(`/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error logging out session:", error);
      throw error;
    }
  },

  async deleteAccount() {
    try {
      const response = await apiClient.delete(`/api/users/me`);
      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },

  // Mendapatkan daftar pengguna yang diblokir
  async getBlockedUsers() {
    try {
      const response = await apiClient.get("/api/users/blocked");
      return response.data;
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      throw error;
    }
  },

  // Membuka blokir pengguna
  async unblockUser(userIdToUnblock) {
    try {
      const response = await apiClient.post("/api/users/unblock", {
        userIdToUnblock,
      });
      return response.data;
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  },
  // You can add other user-related functions here in the future,
  // for example, fetching a user's public profile.
};

export default userService;
