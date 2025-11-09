import { useEffect, useState } from "react";
import api from "../services/authservices";

export default function DashboardStudent() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

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
        Welcome, {localStorage.getItem("full_name")}
      </h2>

      <h3 className="text-lg font-medium mb-2">Your Grades</h3>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : grades.length === 0 ? (
        <p className="text-gray-600">No grades available.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Course</th>
              <th className="border p-2">Score</th>
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
