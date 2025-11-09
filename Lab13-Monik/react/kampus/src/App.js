import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import DashboardStudent from "./pages/dashboardStudent";
import DashboardInstructor from "./pages/dashboardDosen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<DashboardStudent />} />
        <Route path="/instructor" element={<DashboardInstructor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
