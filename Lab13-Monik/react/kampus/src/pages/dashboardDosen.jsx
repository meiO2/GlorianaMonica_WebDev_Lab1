// src/pages/dashboardDosen.jsx
import { useEffect, useState } from "react";
import api from "../services/authservices";

export default function DashboardDosen() {
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({ student: "", course_name: "", score: "" });

  // Ambil data nilai saat halaman dibuka
  useEffect(() => {
    api
      .get("grades/")
      .then((res) => setGrades(res.data))
      .catch((err) => console.error("Error fetching grades:", err));
  }, []);

  // Fungsi submit untuk menambah nilai baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("grades/", form);
      alert("Nilai berhasil ditambahkan!");
      setForm({ student: "", course_name: "", score: "" });

      // Refresh data nilai setelah menambah
      const res = await api.get("grades/");
      setGrades(res.data);
    } catch (err) {
      console.error("Error adding grade:", err);
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
          type="number"
          placeholder="Student ID"
          value={form.student}
          onChange={(e) => setForm({ ...form, student: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Course Name"
          value={form.course_name}
          onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Tambah Nilai
        </button>
      </form>

      {/* Tabel Nilai */}
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.id}>
              <td className="border p-2">{g.student_name}</td>
              <td className="border p-2">{g.course_name}</td>
              <td className="border p-2">{g.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
