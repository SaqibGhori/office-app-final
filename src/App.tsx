import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './Layouts/DashboardLayout';
import MainDashboard from './Pages/MainDashboard';
import FIleView from './Pages/FIleView';
import Phase2 from './Pages/Phase2';
import Phase3 from './Pages/Phase3';
import Test from './Pages/Test';

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
          <Route path="/test" element={<Test/>} />

          
          {/* <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} /> */}

          <Route path="/phase2" element={<Phase2/> } />
          <Route path="/phase3" element={<Phase3/>} />

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