// src/services/adminService.js
import apiClient from './apiClient';

/**
 * Fetches application statistics from the admin endpoint.
 * @returns {Promise<object>}
 */
const getStats = async () => {
  try {
    const response = await apiClient.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

/**
 * Fetches all users from the admin endpoint.
 * @returns {Promise<Array>}
 */
const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Deletes a user by their ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<object>}
 */
const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


/**
 * Updates a user's role.
 * @param {string} userId - The ID of the user to update.
 * @param {object} roleData - The new role (e.g., { role: 'ADMIN' }).
 * @returns {Promise<object>}
 */
const updateUserRole = async (userId, roleData) => {
  try {
    const response = await apiClient.put(`/api/users/${userId}`, roleData);
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Fetches all boards in the system (admin only).
 * @returns {Promise<Array>}
 */
const getAllBoards = async () => {
  try {
    const response = await apiClient.get('/api/admin/boards');
    return response.data;
  } catch (error) {
    console.error("Error fetching all boards:", error);
    throw error;
  }
};

/**
 * Deletes any board in the system (admin only).
 * @param {string} boardId - The ID of the board to delete.
 * @returns {Promise<object>}
 */
const deleteBoardAsAdmin = async (boardId) => {
  try {
    const response = await apiClient.delete(`/api/admin/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting board as admin:", error);
    throw error;
  }
};

const getUserGrowthData = async () => {
  try {
    // Anda perlu membuat endpoint ini di backend: GET /admin/stats/user-growth
    const response = await apiClient.get('/api/admin/stats/user-growth');
    return response.data;
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    // Kembalikan array kosong jika terjadi kesalahan agar UI tidak rusak
    return []; 
  }
};

/**
 * Deletes multiple boards by their IDs (admin only).
 * @param {string[]} boardIds - An array of board IDs to delete.
 * @returns {Promise<object>}
 */
const deleteMultipleBoards = async (boardIds) => {
  try {
    // We send the array of IDs in the body of a DELETE request.
    // A common pattern is to use the `data` property in an Axios config object.
    const response = await apiClient.delete('/api/admin/boards', { data: { boardIds } });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple boards as admin:", error);
    throw error;
  }
};

/**
 * Deletes multiple users by their IDs.
 * @param {string[]} userIds - An array of user IDs to delete.
 * @returns {Promise<object>}
 */
const deleteMultipleUsers = async (userIds) => {
  try {
    // Use the `data` property in the config for a DELETE request with a body
    const response = await apiClient.delete('/admin/users', { data: { userIds } });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple users:", error);
    throw error;
  }
};

const adminService = {
  getStats,
  getAllUsers,
  deleteUser,
  updateUserRole,     // Add new function
  getAllBoards,       // Add new function
  deleteBoardAsAdmin,
  getUserGrowthData, 
  deleteMultipleBoards,
  deleteMultipleUsers,// Add new function
};
export default adminService;