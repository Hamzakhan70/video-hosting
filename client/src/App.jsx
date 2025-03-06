import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const accessToken =
    useSelector((state) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to="/login" />;
}

import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/user_profile";
import ChangePassword from "./pages/change_password";
import Settings from "./pages/settings";
import MainLayout from "./layout/mainLayout";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
          {/* Default Route (Redirect to Dashboard if Authenticated) */}
  <Route
    path="/"
    element={<Navigate to="/dashboard" replace />}
  />
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Requires Authentication) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChangePassword />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
