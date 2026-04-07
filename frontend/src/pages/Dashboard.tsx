import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { AlertCircle, Users, Layout, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Listen for initial crowd data and updates
    socket.on('crowd_update', (data) => {
      setCrowdData(data);
      // Update history for graphs
      setHistory(prev => {
        const newHist = [...prev, { time: new Date().toLocaleTimeString(), total: data.reduce((acc: number, d: any) => acc + d.density, 0) }];
        return newHist.slice(-20); // Keep last 20 elements
      });
    });

    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    // Fetch initial alerts
    fetch('http://localhost:3001/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.data.slice(0, 5)))
      .catch(console.error);

    return () => {
      socket.off('crowd_update');
      socket.off('new_alert');
    };
  }, []);

  const totalCrowd = crowdData.reduce((acc, curr) => acc + curr.density, 0);

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="p-6 md:p-10 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Overview Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time stadium insights and monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Attendees</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalCrowd}</div>
          <p className="text-xs text-green-400 mt-1">+12% from last hour</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Active Zones</h3>
            <Layout className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{crowdData.length}</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-red-400">Critical Alerts</h3>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">{crowdData.filter(d => d.status === 'Red').length}</div>
          <p className="text-xs text-red-400 mt-1">Zones over capacity</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Main Entry Gate</h3>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{crowdData.find(d => d.area === 'Gate A')?.density || 0}</div>
          <p className="text-xs text-yellow-400 mt-1">Currently congested</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Live Crowd Density Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Area Status</h2>
          <div className="space-y-4 max-h-72 overflow-auto pr-2">
            {crowdData.map((zone, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="font-medium">{zone.area}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  zone.status === 'Red' ? 'bg-red-500/20 text-red-500' :
                  zone.status === 'Yellow' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {zone.density} pax
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div key={i} className={`p-4 rounded-lg flex gap-3 ${alert.type === 'warning' ? 'bg-red-500/10 border-l-4 border-red-500' : 'bg-blue-500/10 border-l-4 border-blue-500'}`}>
              <AlertCircle className={`h-5 w-5 ${alert.type === 'warning' ? 'text-red-500' : 'text-blue-500'}`} />
              <div className="text-sm">{alert.message}</div>
            </div>
          ))}
          {alerts.length === 0 && <div className="text-gray-400">No recent alerts.</div>}
        </div>
      </div>
    </motion.div>
  );
}
