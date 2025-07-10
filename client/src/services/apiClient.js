import axios from "axios";

// Dapatkan URL dasar dari environment variable untuk fleksibilitas
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

console.log('API_URL:', API_URL);

// Instance Axios dengan baseURL yang benar
const apiClient = axios.create({
  baseURL: API_URL, // HANYA alamat dasar server, tanpa '/api'
  timeout: 30000, // 30 detik timeout
  withCredentials: true, // Penting untuk CORS dengan credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    try {
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      
      // Ambil item 'userInfo' dari localStorage, sesuai dengan yang kita simpan saat login/update
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.token) {
          // Atur header Authorization dengan token dari objek userInfo
          config.headers["Authorization"] = `Bearer ${userInfo.token}`;
        }
      }
    } catch (e) {
      console.error("Error parsing userInfo from localStorage", e);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 502) {
      console.error('Server error (502) - Server might be down or misconfigured');
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('Network error - Check if server is running and CORS is configured properly');
    }
    
    return Promise.reject(error);
  }
);

// Helper function untuk test koneksi
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('Connection test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    throw error;
  }
};

// Export fungsi helper untuk berbagai jenis request
export const api = {
  // Auth endpoints - PASTIKAN PATH BENAR
  register: (userData) => {
    console.log('Registering user to:', '/api/auth/register');
    return apiClient.post('/api/auth/register', userData);
  },
  login: (credentials) => {
    console.log('Logging in to:', '/api/auth/login');
    return apiClient.post('/api/auth/login', credentials);
  },
  googleAuth: () => {
    console.log('Google auth to:', '/api/auth/google');
    return apiClient.get('/api/auth/google');
  },
  
  // User endpoints
  getProfile: () => apiClient.get('/api/users/profile'),
  updateProfile: (userData) => apiClient.put('/api/users/profile', userData),
  
  // Board endpoints
  getBoards: () => apiClient.get('/api/boards'),
  createBoard: (boardData) => apiClient.post('/api/boards', boardData),
  updateBoard: (id, boardData) => apiClient.put(`/api/boards/${id}`, boardData),
  deleteBoard: (id) => apiClient.delete(`/api/boards/${id}`),
  
  // List endpoints
  getLists: (boardId) => apiClient.get(`/api/lists?boardId=${boardId}`),
  createList: (listData) => apiClient.post('/api/lists', listData),
  updateList: (id, listData) => apiClient.put(`/api/lists/${id}`, listData),
  deleteList: (id) => apiClient.delete(`/api/lists/${id}`),
  
  // Card endpoints
  getCards: (listId) => apiClient.get(`/api/cards?listId=${listId}`),
  createCard: (cardData) => apiClient.post('/api/cards', cardData),
  updateCard: (id, cardData) => apiClient.put(`/api/cards/${id}`, cardData),
  deleteCard: (id) => apiClient.delete(`/api/cards/${id}`),
  
  // Test endpoint
  testConnection: testConnection
};

export default apiClient;