import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './Layouts/DashboardLayout';
import MainDashboard from './Pages/MainDashboard';
import FIleView from './Pages/FIleView';
import Test from './Pages/test';

// import SettingsPage from './pages/SettingsPage';
// import AnalyticsPage from './pages/AnalyticsPage';
// import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes that should have the sidebar */}
        <Route element={<DashboardLayout/>}>
          <Route path="/" element={<MainDashboard/>} />
          <Route path="/fileview" element={<FIleView/>} />
          <Route path="/test" element={<Test />} />
          {/* <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
        
        {/* Routes without sidebar (if needed) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        
        {/* 404 page */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;