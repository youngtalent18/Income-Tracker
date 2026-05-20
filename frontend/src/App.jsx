import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Pages/Login.jsx";
import RegisterPage from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import AdminPage from "./Pages/AdminPage.jsx";
import ResetPass from "./Pages/ResetPass.jsx";
import Profile from "./Pages/Profile.jsx";

import Transactions from "./Pages/Transactions";
import Customers from "./Pages/Customers";
import Analytics from "./Pages/Analytics";
import Milestones from "./Pages/Milestones";

import ProtectedRoute from "./Components/ProtectedLayout.jsx";

function App() {
  return (
    <div className="bg-slate-800 text-white min-h-screen">
      <Router>
        <Toaster position="top-right" />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ResetPass />} />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/milestones"
            element={
              <ProtectedRoute>
                <Milestones />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
