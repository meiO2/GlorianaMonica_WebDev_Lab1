import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authservices";

export default function DashboardStudent() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔒 Verifikasi role akun student
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      alert("Akses ditolak. Halaman ini hanya untuk mahasiswa.");
      navigate("/"); // arahkan ke halaman utama atau login
    }
  }, [navigate]);

  // 📊 Ambil data nilai saat halaman dibuka
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Unauthorized. Please log in again.");
          return;
        }

        const res = await api.get("/grades/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setGrades(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch grades. Please try again later.");
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Dashboard Mahasiswa - {localStorage.getItem("full_name")}
      </h2>

      <h3 className="text-lg font-medium mb-2">Nilai Anda</h3>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : grades.length === 0 ? (
        <p className="text-gray-600">Belum ada nilai yang tersedia.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Mata Kuliah</th>
              <th className="border p-2">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id}>
                <td className="border p-2">{g.course_name}</td>
                <td className="border p-2">{g.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
