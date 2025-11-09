// src/pages/dashboardDosen.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authservices";

export default function DashboardDosen() {
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({
    student: "",
    course_name: "",
    score: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "instructor") {
      alert("Akses ditolak. Halaman ini hanya untuk dosen.");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const res = await api.get("grades/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGrades(res.data);
      } catch (err) {
        console.error("Error fetching grades:", err.response?.data || err.message);
      }
    };

    fetchGrades();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      alert("Sesi login sudah habis. Silakan login ulang.");
      navigate("/");
      return;
    }

    await api.post(
      "grades/",
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    alert("Nilai berhasil ditambahkan!");
    setForm({ student: "", course_name: "", score: "" });

    // Refresh data nilai
    const res = await api.get("grades/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setGrades(res.data);
  } catch (err) {
    console.error("Error adding grade:", err.response?.data || err.message);
    alert("Terjadi kesalahan saat menambahkan nilai.");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Dashboard Dosen - {localStorage.getItem("full_name")}
      </h2>

      {/* Form Tambah Nilai */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Student Username"
          value={form.student}
          onChange={(e) => setForm({ ...form, student: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Course Name"
          value={form.course_name}
          onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition"
        >
          Tambah Nilai
        </button>
      </form>

      {/* Tabel Nilai */}
      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((g) => (
              <tr key={g.id}>
                <td className="border p-2">{g.student_name}</td>
                <td className="border p-2">{g.course_name}</td>
                <td className="border p-2">{g.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border p-2 text-gray-500">
                Belum ada data nilai.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
