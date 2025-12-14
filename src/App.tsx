import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User
import CreateTask from "./pages/user/CreateTask";
import UserTasks from "./pages/user/UserTasks";
import UserProfile from "./pages/user/UserProfile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssignTask from "./pages/admin/AssignTask";

// Employee
import MyTasks from "./pages/employee/MyTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route path="/user/create-task" element={<CreateTask />} />
        <Route path="/user/tasks" element={<UserTasks />} />
        <Route path="/user/profile" element={<UserProfile />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/assign" element={<AssignTask />} />

        {/* EMPLOYEE */}
        <Route path="/employee/tasks" element={<MyTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
