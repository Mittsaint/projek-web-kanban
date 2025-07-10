import apiClient from "./apiClient";

/**
 * Registers a new user.
 * @param {object} userData - User data (e.g. { name, email, password }).
 * @returns {Promise<object>} The response from the server.
 */
const register = (userData) => {
  return apiClient.post("/api/auth/register", userData);
};

/**
 * Login a local user.
 * @param {object} credentials - The user's credentials (e.g. { email, password }).
 * @returns {Promise<object>} The response from the server containing the token and user data.
 */
const login = async (credentials) => {
  const response = await apiClient.post("/api/auth/login", credentials);

  // If login is successful and server returns token
  if (response.data && response.data.token) {
    // Save token to localStorage to maintain login session
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};
// Logout user by deleting token from localStorage.
const logout = () => {
  localStorage.removeItem("token");
};

// Start the Google authentication flow by redirecting the user.
const loginWithGoogle = () => {
  // Point the browser to the Google authentication endpoint on the backend.
  // The backend will handle the OAuth2 process and callbacks.
  window.location.href = "http://localhost:5000/api/auth/google";
};

const authService = {
  register,
  login,
  logout,
  loginWithGoogle,
};

export default authService;
