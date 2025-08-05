import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import ProtectedRoute      from './Components/ProtectedRoute';
import SuperProtectedRoute from './Components/SuperProtectedRoute';

// Showcase UI components
import ShowNavbar       from './Components/ShowNavbar';
import ShowHome         from './Pages/ShowHome';
import ShowAbout        from './Pages/ShowAbout';
import ShowContact      from './Pages/ShowContact';
import PrivacyPolicy    from './Pages/PrivacyPolicy';

// User & Superadmin flows
import LoginPage          from './Pages/LoginPage';
import RegisterPage       from './Pages/RegisterPage';
import DashboardLayout    from './Layouts/DashboardLayout';
import Home               from './Pages/Home';
import MainDashboard      from './Pages/MainDashboard';
import FileView           from './Pages/FIleView';
import FileViewDownloadPage from './Pages/FileViewDownloadPage';
import Harmonics          from './Pages/Harmonics';
import Alaram             from './Pages/Alaram';
import AlarmDownloadPage  from './Pages/AlarmDownloadPage';
import Settings           from './Pages/Settings';

import SuperSignupPage    from './Pages/SuperSignupPage';
import SuperLoginPage     from './Pages/SuperLoginPage';
import SuperHome          from './Pages/SuperHome';

export default function App() {
  return (
    <Router>
      {/* Always‑visible navbar for the public showcase */}
      <ShowNavbar />

      <AuthProvider>
        <DataProvider>
          <Routes>

            {/* ───────── Showcase Pages ───────── */}
            <Route path="/"            element={<ShowHome />} />
            <Route path="/about"       element={<ShowAbout />} />
            <Route path="/contact"     element={<ShowContact />} />
            <Route path="/privacy"     element={<PrivacyPolicy />} />

            {/* ───────── Superadmin Flow ───────── */}
            <Route path="/superadmin/signup" element={<SuperSignupPage />} />
            <Route path="/superadmin/login"  element={<SuperLoginPage />} />

            <Route element={<SuperProtectedRoute />}>
              <Route path="/superadmin/home" element={<SuperHome />} />
            </Route>

            {/* ───────── Normal User Flow ───────── */}
            {/* Public user routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"      element={<Home />} />
                <Route path="/maindashboard"  element={<MainDashboard />} />
                <Route path="/fileview"       element={<FileView />} />
                <Route path="/fileview/export" element={<FileViewDownloadPage />} />
                <Route path="/harmonics"      element={<Harmonics />} />
                <Route path="/alaram"         element={<Alaram />} />
                <Route path="/alarm-download" element={<AlarmDownloadPage />} />
                <Route path="/settings"       element={<Settings />} />

                {/* root redirect once logged in */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* ───────── Fallback ───────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
