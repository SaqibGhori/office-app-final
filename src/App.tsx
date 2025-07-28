import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './Components/ProtectedRoute';

import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardLayout from './Layouts/DashboardLayout';
import Home from './Pages/Home';
import MainDashboard from './Pages/MainDashboard';
import FileView from './Pages/FIleView';
import FileViewDownloadPage from './Pages/FileViewDownloadPage';
import Harmonics from './Pages/Harmonics';
import Alaram from './Pages/Alaram';
import AlarmDownloadPage from './Pages/AlarmDownloadPage';
import Settings from './Pages/Settings';

export default function App() {
  return (
    <AuthProvider>
        <Router>
      <DataProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Wrap protected pages in DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/maindashboard" element={<MainDashboard />} />
                <Route path="/fileview" element={<FileView />} />
                <Route path="/fileview/export" element={<FileViewDownloadPage />} />
                <Route path="/harmonics" element={<Harmonics />} />
                <Route path="/alaram" element={<Alaram />} />
                <Route path="/alarm-download" element={<AlarmDownloadPage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </DataProvider>
        </Router>
    </AuthProvider>
  );
}
