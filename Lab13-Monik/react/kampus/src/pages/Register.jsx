import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleRegister } from "../services/authservices";

export default function Register() {
  const [fullName, setFullName] = useState("");
  // HAPUS state username!
  // const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pilihan major dari Django
  const majors = [
    { value: "artificial_intelligence_and_robotics", label: "AIR" },
    { value: "business_mathematics", label: "BM" },
    { value: "digital business technology", label: "DBT" },
    { value: "product_design_engineering", label: "PDE" },
    { value: "energy_business_technology", label: "EBT" },
    { value: "food_business_technology", label: "FBT" },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    // [PERBAIKAN KRUSIAL]: Hapus bidang 'username' dari formData
    const formData = {
        full_name: fullName,
        // HAPUS: username: username,
        email: email,
        major: major,
        password: password,
        // Kirim konfirmasi password untuk validasi serializer
        password_confirmation: confirmPassword, 
    };

    try {
        const res = await handleRegister(formData); 
        console.log("Register response:", res);

        alert("Registrasi berhasil! Silakan login.");
        navigate("/");
    } catch (err) {
        console.error("Register error:", err);
        
        let errorMessage = "Gagal registrasi. Pastikan semua data benar dan belum terdaftar.";
        
        // [PENYEMPURNAAN ERROR HANDLING]
        if (err.data) {
            if (err.data.detail) {
                errorMessage = err.data.detail;
            } 
            else if (typeof err.data === 'object') {
                // Menampilkan error validasi field pertama
                const firstKey = Object.keys(err.data)[0];
                if (firstKey && Array.isArray(err.data[firstKey])) {
                    errorMessage = `${firstKey.toUpperCase()}: ${err.data[firstKey][0]}`;
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
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <input
          type="text"
          placeholder="Nama Lengkap"
          className="border p-2 w-full mb-3 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        {/* [PERBAIKAN KRUSIAL]: HAPUS input Username */}
        {/* <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /> */}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
        >
          <option value="">Pilih Major</option>
          {majors.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="border p-2 w-full mb-3 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-500 text-white px-4 py-2 w-full rounded transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-3">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}