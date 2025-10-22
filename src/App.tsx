import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import ProtectedRoute from './context/ProtectedRoute';
import SuperProtectedRoute from './Components/SuperProtectedRoute';

// ───────── Public Pages ─────────
import ShowHome from './Pages/ShowHome';
import ShowAbout from './Pages/ShowAbout';
import ShowContact from './Pages/ShowContact';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsCondition from './Pages/TermsCondition';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

// ───────── Secure User Pages ─────────
// import DashboardLayout from './Layouts/DashboardLayout';
import Home from './Pages/Home';
import MainDashboard from './Pages/MainDashboard';
import FileView from './Pages/FIleView';
import FileViewDownloadPage from './Pages/FileViewDownloadPage';
import Harmonics from './Pages/Harmonics';
import Alaram from './Pages/Alaram';
import AlarmDownloadPage from './Pages/AlarmDownloadPage';
import Settings from './Pages/Settings';

// ───────── Superadmin ─────────
import SuperSignupPage from './Pages/SuperSignupPage';
import SuperLoginPage from './Pages/SuperLoginPage';
import SuperHome from './Pages/SuperHome';
import SuperUsersSettings from './Pages/SuperUsersSettings';
import DeviceSettings from './Pages/DeviceSettings';

// ───────── Navbars ─────────
import Navbar from './Components/Navbar';
import AdminNavbar from './Components/AdminNavbar';

function AppContent() {
  const location = useLocation();
  const { token } = useAuth();

  // Detect if user is on any superadmin route
  const isSuperAdminRoute = location.pathname.startsWith('/superadmin');

  return (
    <>
      {/* Show different navbar based on route */}
      {isSuperAdminRoute ? <AdminNavbar isLoggedInAdmin={!!token} /> : <Navbar isLoggedIn={!!token} />}

      <Routes>
        {/* ───────── Public Showcase ───────── */}
        <Route path="/" element={<ShowHome />} />
        <Route path="/aboutus" element={<ShowAbout />} />
        <Route path="/contact" element={<ShowContact />} />
        <Route path="/termsandconditions" element={<TermsCondition />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ───────── Superadmin ───────── */}
        <Route path="/superadmin/signup" element={<SuperSignupPage />} />
        <Route path="/superadmin/login" element={<SuperLoginPage />} />
        <Route element={<SuperProtectedRoute />}>
          <Route path="/superadmin/home" element={<SuperHome />} />
          <Route path="/super/users/:id" element={<SuperUsersSettings />} />
        </Route>

        {/* ───────── Auth Pages ───────── */}
        <Route
          path="/login"
          element={
            <AuthWrapper>
              <LoginPage />
            </AuthWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <AuthWrapper>
              <RegisterPage />
            </AuthWrapper>
          }
        />

        {/* ───────── Secure User Flow ───────── */}
        <Route
          element={
            <ProtectedRoute>
              {/* <DashboardLayout /> */}
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/device-settings" element={<DeviceSettings />} />
          <Route path="/fileview" element={<FileView />} />
          <Route path="/fileview/export" element={<FileViewDownloadPage />} />
          <Route path="/harmonics" element={<Harmonics />} />
          <Route path="/alaram" element={<Alaram />} />
          <Route path="/alarm-download" element={<AlarmDownloadPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ───────── Fallback ───────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

/** Redirect to dashboard if already logged in */
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}
