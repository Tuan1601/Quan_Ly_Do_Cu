import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/reset.css";
import AdminRoute from "./router/admin/AdminRouter";
import UserRouter from "./router/users/UserRouter";
import AdminLogin from "./pages/Admin/Auth/Login";
import UserLogin from "./pages/Users/Auth/Login";
import UserRegister from "./pages/Users/Auth/Register";
import AdminRegister from "./pages/Admin/Auth/Register";
import Dashboard from "./pages/Admin/Dashboard/index";
import Profile from "./pages/Users/Dashboard/components/Profile";
import { AuthProvider as AdminAuthProvider } from "./contexts/Admin/AdminContext";
import { AuthProvider as UserAuthProvider } from "./contexts/Users/UserContext";

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <UserAuthProvider>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Dashboard />} />
              {/* Các route con admin */}
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* User routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<UserRouter />} />
          </Routes>
        </UserAuthProvider>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
