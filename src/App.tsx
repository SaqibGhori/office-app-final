import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import ProtectedRoute from './context/ProtectedRoute';
import SuperProtectedRoute from './Components/SuperProtectedRoute';


// Public pages
import ShowHome from './Pages/ShowHome';
import ShowAbout from './Pages/ShowAbout';
import ShowContact from './Pages/ShowContact';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

// Secure user pages
import DashboardLayout from './Layouts/DashboardLayout';
import Home from './Pages/Home';
import MainDashboard from './Pages/MainDashboard';
import FileView from './Pages/FIleView';
import FileViewDownloadPage from './Pages/FileViewDownloadPage';
import Harmonics from './Pages/Harmonics';
import Alaram from './Pages/Alaram';
import AlarmDownloadPage from './Pages/AlarmDownloadPage';
import Settings from './Pages/Settings';

// Superadmin
import SuperSignupPage from './Pages/SuperSignupPage';
import SuperLoginPage from './Pages/SuperLoginPage';
import SuperHome from './Pages/SuperHome';
import Navbar from './Components/Navbar';
import TermsCondition from './Pages/TermsCondition';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          
          <Navbar/>
          <Routes>
            {/* ───────── Public Showcase ───────── */}
            <Route path="/" element={<ShowHome />} />
            <Route path="/aboutus" element={<ShowAbout />} />
            <Route path="/contact" element={<ShowContact />} />
            <Route path="/termsandconditions" element={<TermsCondition/>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* ───────── Superadmin ───────── */}
            <Route path="/superadmin/signup" element={<SuperSignupPage />} />
            <Route path="/superadmin/login" element={<SuperLoginPage />} />
            <Route element={<SuperProtectedRoute />}>
              <Route path="/superadmin/home" element={<SuperHome />} />
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
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Home />} />
              <Route path="/maindashboard" element={<MainDashboard />} />
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
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

/** Redirect to dashboard if already logged in */
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <>{children}</>;
}
