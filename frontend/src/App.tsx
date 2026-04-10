import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Map, LayoutDashboard, Settings as SettingsIcon, Shield } from 'lucide-react';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserMap = React.lazy(() => import('./pages/UserMap'));
const CrowdAnalytics = React.lazy(() => import('./pages/CrowdAnalytics'));
const Settings = React.lazy(() => import('./pages/Settings'));

function SidebarLink({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} aria-current={isActive ? 'page' : undefined} aria-label={`Navigate to ${label}`} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
      isActive
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}>
      <Icon size={20} aria-hidden="true" className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0f] text-white font-sans selection:bg-blue-500/30">
        {/* Sidebar */}
        <aside aria-label="Main Navigation" className="w-64 bg-[#11111a] border-r border-gray-800/50 flex flex-col shadow-2xl z-20">
          <div className="p-6 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/40">
                <Shield aria-hidden="true" className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SmartVenue AI
              </h1>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-3 mb-2" id="nav-op">Operational</div>
            <ul aria-labelledby="nav-op" className="space-y-2">
              <li><SidebarLink to="/" icon={LayoutDashboard} label="Admin Dashboard" /></li>
              <li><SidebarLink to="/map" icon={Map} label="User Map View" /></li>
            </ul>

            <div className="pt-6">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-3 mb-2" id="nav-an">Analysis</div>
              <ul aria-labelledby="nav-an" className="space-y-2">
                <li><SidebarLink to="/analytics" icon={Activity} label="Crowd Analytics" /></li>
                <li><SidebarLink to="/settings" icon={SettingsIcon} label="Settings" /></li>
              </ul>
            </div>
          </nav>

          <div className="p-4 m-4 bg-gray-800/30 rounded-2xl border border-gray-700/50" role="status" aria-live="polite">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
              <span className="text-xs font-medium text-gray-400">System: Nominal</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,17,26,0)_0%,rgba(10,10,15,1)_100%)] pointer-events-none z-0"></div>
          <div className="relative z-10">
            <Suspense fallback={<div className="flex h-full items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<UserMap />} />
                <Route path="/analytics" element={<CrowdAnalytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
