import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Activity, Map, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import UserMap from './pages/UserMap';
import CrowdAnalytics from './pages/CrowdAnalytics';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 md:p-6 border-b border-gray-700">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SmartVenue AI
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition">
              <LayoutDashboard size={20} />
              <span>Admin Dashboard</span>
            </Link>
            <Link to="/map" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition">
              <Map size={20} />
              <span>User Map View</span>
            </Link>
            <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition">
              <Activity size={20} />
              <span>Crowd Analytics</span>
            </Link>
            <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition">
              <SettingsIcon size={20} />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<UserMap />} />
            <Route path="/analytics" element={<CrowdAnalytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
