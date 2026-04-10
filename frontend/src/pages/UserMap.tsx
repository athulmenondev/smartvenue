import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMap() {
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<{ time: number; trend: string; confidence: number } | null>(null);

  useEffect(() => {
    socket.on('crowd_update', setCrowdData);
    return () => {
      socket.off('crowd_update');
    };
  }, []);

  const handlePredictQueue = async (area: string, density: number) => {
    try {
      setPrediction(null);
      const type = area.toLowerCase().includes('food') ? 'food' : area.toLowerCase().includes('gate') ? 'gate' : 'restroom';
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/queue-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, density })
      });
      const data = await res.json();
      setPrediction({
        time: data.predicted_wait_time_minutes,
        trend: data.trend,
        confidence: data.confidence
      });
    } catch (err) {
      console.error("Failed to predict queue");
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Live Venue Map</h1>
          <p className="text-gray-400 mt-1">Navigate seamlessly avoiding crowded areas</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">System Status</div>
          <div className="flex items-center justify-end space-x-2 text-green-400 text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>Live Telemetry Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl relative min-h-[600px] overflow-hidden group">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

          {/* High-Fidelity Simulated Stadium Layout */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
             {/* Central Pitch/Stage */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-72 h-36 border-4 border-green-500/30 rounded-3xl flex items-center justify-center text-green-500 font-black text-xl tracking-tighter uppercase bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.2)] mb-20 z-10"
             >
               Pitch / Main Stage
             </motion.div>

             {/* Zone Layout Grid */}
             <div className="absolute inset-0 p-12 grid grid-cols-3 gap-8">
                {crowdData.map((zone, idx) => {
                   const isRed = zone.status === 'Red';
                   const isYellow = zone.status === 'Yellow';
                   const colorClass = isRed ? 'bg-red-500/20 border-red-500/50 text-red-400' : isYellow ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-green-500/20 border-green-500/50 text-green-400';
                   const pulseClass = isRed ? 'animate-pulse' : '';

                   return (
                       <motion.button
                           key={idx}
                           whileHover={{ scale: 1.05, y: -5 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => handlePredictQueue(zone.area, zone.density)}
                           className={`h-32 rounded-2xl border-2 ${colorClass} ${pulseClass} backdrop-blur-xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center shadow-lg group-hover:shadow-2xl`}
                       >
                           <span className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">{zone.area}</span>
                           <span className="text-2xl font-black font-mono">{zone.density}</span>
                           <span className="text-[10px] uppercase font-medium opacity-60">pax</span>
                       </motion.button>
                   )
                })}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
               <div className="text-[10px] font-bold text-gray-500 uppercase">AI Engine v2.1</div>
            </div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
              <span className="mr-2">🧠</span> Queue Predictor
            </h2>
            <p className="text-sm text-gray-400 mb-6">AI-powered wait time estimation based on current zone density and historical patterns.</p>

            <AnimatePresence mode="wait">
              {prediction !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl text-center relative overflow-hidden group"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="text-8xl font-black">AI</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Estimated Wait</p>
                  <p className="text-5xl font-black mt-2 mb-4">{prediction.time.toFixed(1)} <span className="text-lg font-medium opacity-70">min</span></p>

                  <div className="flex justify-between items-center pt-4 border-t border-white/20 text-xs font-bold">
                    <div className="flex items-center">
                       <span className={`mr-1 ${prediction.trend === 'increasing' ? 'text-red-300' : prediction.trend === 'decreasing' ? 'text-green-300' : 'text-gray-300'}`}>
                         {prediction.trend === 'increasing' ? '📈' : prediction.trend === 'decreasing' ? '📉' : '↔️'}
                       </span>
                       {prediction.trend.toUpperCase()}
                    </div>
                    <div className="opacity-70">
                       Confidence: {prediction.confidence * 100}%
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 bg-gray-900/50 rounded-2xl border border-dashed border-gray-700 text-center text-gray-500 italic"
                >
                  Click a zone to run AI analysis...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Smart Routing</h2>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                <span className="text-sm text-gray-300">Restrooms North: <span className="font-bold text-green-400">OPTIMAL</span></span>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm text-gray-300">Gate A: <span className="font-bold text-red-400">CONGESTED</span></span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">Suggested: <span className="font-bold text-blue-400">Gate C</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
