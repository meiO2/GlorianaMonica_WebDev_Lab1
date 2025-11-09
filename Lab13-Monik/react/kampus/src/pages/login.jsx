import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleLogin } from "../services/authservices";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await handleLogin(email, password);
      console.log("Login response:", res);

      // Ambil token & info user, menggunakan destructuring yang lebih rapi
      const { 
        token, 
        access: directAccess, 
        refresh: directRefresh, 
        role, 
        full_name 
      } = res;

      const access = token?.access || directAccess;
      const refresh = token?.refresh || directRefresh;

      if (!access || !refresh) {
        throw new Error("Token tidak ditemukan di response API.");
      }

      // Simpan ke localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role || "");
      localStorage.setItem("full_name", full_name || "");

      // Arahkan sesuai role (diasumsikan role di Django adalah 'student' atau 'instructor')
      if (role === "student") {
        navigate("/student");
      } else if (role === "instructor") { 
        navigate("/instructor");
      } else {
        setError("Role tidak valid atau tidak dikenali.");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Login gagal. Periksa email dan password kamu.";
      
      // [PENYEMPURNAAN]: Cek pesan error dari API
      if (err.data) {
        // Jika error adalah objek detail (dari DRF), gunakan detailnya
        if (err.data.detail) {
          errorMessage = err.data.detail;
        } 
        // Jika error adalah objek validasi multi-field
        else if (typeof err.data === 'object') {
          // Ambil nilai pesan error pertama dari objek (misalnya 'email' atau 'password')
          const firstKey = Object.keys(err.data)[0];
          if (firstKey && Array.isArray(err.data[firstKey])) {
            errorMessage = `${firstKey}: ${err.data[firstKey][0]}`;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
        
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <input
          type="email"
          // Hapus placeholder jika menggunakan field label (atau biarkan jika ingin seperti gambar)
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-2 w-full rounded transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-3">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}