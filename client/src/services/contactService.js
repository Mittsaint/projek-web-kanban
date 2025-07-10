// src/services/contactService.js
import axios from 'axios';

// The backend API endpoint
const API_URL = '/api/contact'; 

/**
 * Sends the contact form data to the backend API.
 * @param {object} formData - The data from the contact form (e.g., { name, email, message }).
 * @returns {Promise<object>} The data from the server's response.
 */
export const sendContactForm = async (formData) => {
  try {
    // Make a POST request to the backend
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    // Log the error and re-throw it so the component can handle it
    console.error('Error sending contact form:', error.response?.data || error.message);
    throw error;
  }
};