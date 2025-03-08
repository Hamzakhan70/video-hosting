
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
import Playlists from "./pages/playlist/playlist";
import PlaylistDetail from "./pages/playlist/playlist_details";
import CreatePlaylist from "./pages/playlist/create_playlist";
import Dashboard from "./pages/dashboard";
import SubscriptionPage from "./pages/subscription";

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
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Playlists/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists/create"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreatePlaylist/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SubscriptionPage/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route path="/playlists/create" element={<CreatePlaylist />} /> */}
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
