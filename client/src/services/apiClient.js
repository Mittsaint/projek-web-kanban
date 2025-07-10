import axios from "axios";

// Dapatkan URL dasar dari environment variable untuk fleksibilitas
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

// Instance Axios dengan baseURL yang benar
const apiClient = axios.create({
  baseURL: API_URL, // HANYA alamat dasar server, tanpa '/api'
});

// MODIFIKASI: Gunakan 'interceptor' sebagai satu-satunya sumber untuk mengatur token.
// Ini lebih modern dan otomatis berjalan untuk setiap request.
apiClient.interceptors.request.use(
  (config) => {
    try {
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
    return Promise.reject(error);
  }
);

export default apiClient;