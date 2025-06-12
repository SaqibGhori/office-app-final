
import Sidebar from '../Components/Sidebar'
// import MainDashboard from '../Pages/MainDashboard'
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet/>
      </main>
    </div>

  )
}

export default DashboardLayout