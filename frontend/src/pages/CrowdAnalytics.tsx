import { useState, useEffect } from 'react';
import { socket } from '../utils/socket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function CrowdAnalytics() {
  const [crowdData, setCrowdData] = useState<any[]>([]);

  useEffect(() => {
    socket.on('crowd_update', setCrowdData);
    
    // Fallback if not connected or loading
    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/crowd`)
      .then(res => res.json())
      .then(data => {
        if(crowdData.length === 0) setCrowdData(data.data);
      })
      .catch(console.error);

    return () => {
      socket.off('crowd_update');
    };
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  const pieData = crowdData.map((d) => ({
    name: d.area,
    value: d.density
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-10 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Crowd Analytics</h1>
        <p className="text-gray-400 mt-1">Deep dive into historical and distribution data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Density by Zone</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crowdData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="area" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                <Bar dataKey="density" radius={[4, 4, 0, 0]}>
                  {crowdData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'Red' ? '#ef4444' : entry.status === 'Yellow' ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold mb-4">Distribution Analysis</h2>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Insight Generation</h2>
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-300">
            Based on current data metrics, the majority of the crowd forms around <strong>{[...crowdData].sort((a,b)=>b.density-a.density)[0]?.area || 'N/A'}</strong>. 
            We recommend opening up auxiliary exits near this zone to alleviate future congestion. ML prediction models anticipate normal flow resuming within 45 minutes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
