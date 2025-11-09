import axios from "axios";

const api = axios.create({
  // [PERBAIKAN 1]: Tambahkan '/api' ke baseURL. Ini mengatasi error 404 jika Django Anda menggunakan prefix '/api'.
  baseURL: "http://127.0.0.1:8000/api/auth",
});

// [PERBAIKAN 2]: Ganti 'username' menjadi 'email'
export const handleLogin = async (email, password) => {
  try {
    // Kirim 'email' dan 'password' ke endpoint login
    const response = await api.post("/login/", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    // Melempar error.response untuk penanganan yang lebih baik di komponen React
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const handleRegister = async (formData) => {
  try {
    // URL lengkap: http://127.0.0.1:8000/api/auth/register/
    const response = await api.post("/register/", formData);
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const getGrades = async (token) => {
  try {
    // URL lengkap: http://127.0.0.1:8000/api/auth/grades/
    const response = await api.get("/grades/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch grades:", error);
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const addGrade = async (token, gradeData) => {
  try {
    // URL lengkap: http://127.0.0.1:8000/api/auth/grades/
    const response = await api.post("/grades/", gradeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add grade:", error);
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export default api;