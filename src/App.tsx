import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './Layouts/DashboardLayout';
import MainDashboard from './Pages/MainDashboard';
import FIleView from './Pages/FIleView';
import Phase2 from './Pages/Phase2';
import Phase3 from './Pages/Phase3';
// import Test from './Pages/Test';
import Harmonics from './Pages/Harmonics';
import Alaram from './Pages/Alaram';
import Settings from './Pages/Settings';
import Home from './Pages/Home';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {/* All routes that should have the sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/maindashboard" element={<MainDashboard />} />
            <Route path="/fileview" element={<FIleView />} />
            <Route path="/harmonics" element={<Harmonics />} />
            <Route path="/alaram" element={<Alaram />} />
            <Route path="/settings" element={<Settings />} />


            <Route path="/phase2" element={<Phase2 />} />
            <Route path="/phase3" element={<Phase3 />} />

          </Route>

          {/* Routes without sidebar (if needed) */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* 404 page */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </DataProvider>

    </Router>
  );
}

export default App;