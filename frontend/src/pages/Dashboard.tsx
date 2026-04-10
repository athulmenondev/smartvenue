import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { AlertCircle, Users, Layout, MapPin, ShieldAlert, Zap, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [scenario, setScenario] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    socket.on('crowd_update', (data) => {
      setCrowdData(data);
      setHistory(prev => {
        const newHist = [...prev, { time: new Date().toLocaleTimeString(), total: data.reduce((acc: number, d: any) => acc + d.density, 0) }];
        return newHist.slice(-20);
      });
    });

    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    socket.on('scenario_change', (data) => {
      setScenario(data);
    });

    socket.on('telemetry_log', (log) => {
      setLogs(prev => [log, ...prev].slice(0, 50));
    });

    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/alerts`)
      .then(res => res.json())
      .then(data => setAlerts(data.data.slice(0, 5)))
      .catch(console.error);

    return () => {
      socket.off('crowd_update');
      socket.off('new_alert');
      socket.off('scenario_change');
      socket.off('telemetry_log');
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="relative">
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> COMMAND CENTER </h1>
          <p className="text-gray-400 mt-1 font-medium">Real-time stadium operational intelligence</p>

          {scenario && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-10 left-0 flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="h-3 w-3 animate-pulse" />
              <span>Scenario: {scenario.scenario}</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700 flex items-center space-x-3">
             <div className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
             </div>
             <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">System Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Attendees" value={totalCrowd} icon={<Users />} color="text-white" trend="+12% from last hour" trendColor="text-green-400" />
        <StatCard label="Active Zones" value={crowdData.length} icon={<Layout />} color="text-white" />
        <StatCard label="Critical Alerts" value={crowdData.filter(d => d.status === 'Red').length} icon={<ShieldAlert />} color="text-red-400" trend="Capacity Warning" trendColor="text-red-400" alert />
        <StatCard label="Gate A Density" value={crowdData.find(d => d.area === 'Gate A')?.density || 0} icon={<MapPin />} color="text-white" trend="High Congestion" trendColor="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
              Live Crowd Density Trend
            </h2>
            <div className="text-xs text-gray-500 font-mono">T-Minus: {new Date().toLocaleTimeString()}</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" tick={{fontSize: 10}} />
                <YAxis stroke="#6b7280" tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
            Zone Status
          </h2>
          <div className="space-y-3 max-h-72 overflow-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {crowdData.map((zone, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  <span className="font-semibold text-gray-300">{zone.area}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-tighter ${
                    zone.status === 'Red' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                    zone.status === 'Yellow' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-500 border border-green-500/30'
                  }`}>
                    {zone.density} PAX
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-gray-900/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl font-mono overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center text-gray-400">
            <Terminal className="h-5 w-5 mr-2" />
            Telemetry Stream
          </h2>
          <div className="flex-1 space-y-2 overflow-y-auto text-[10px] scrollbar-hide">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className="flex space-x-2"
                >
                  <span className="text-gray-600">[{log.timestamp}]</span>
                  <span className={`font-bold ${log.level === 'CRITICAL' ? 'text-red-500' : (log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-500')}`}>
                    {log.level}
                  </span>
                  <span className="text-gray-400">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <div className="w-2 h-6 bg-red-500 rounded-full mr-3"></div>
          Operational Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`p-4 rounded-2xl flex gap-4 ${alert.type === 'warning' ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}
            >
              <div className={`p-2 rounded-full ${alert.type === 'warning' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                <AlertCircle className={`h-5 w-5 ${alert.type === 'warning' ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              <div className="text-sm font-medium text-gray-300">{alert.message}</div>
            </motion.div>
          ))}
          {alerts.length === 0 && <div className="col-span-2 text-center py-8 text-gray-500 italic">No active alerts. System nominal.</div>}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, color, trend, trendColor, alert = false }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl border ${alert ? 'border-red-500/50' : 'border-gray-700'} shadow-xl relative overflow-hidden group`}
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</h3>
        <div className={`p-2 rounded-lg bg-gray-900/50 ${color}`}>{icon}</div>
      </div>
      <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
      {trend && <p className={`text-xs font-bold mt-2 ${trendColor}`}>{trend}</p>}
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
    </motion.div>
  );
}
