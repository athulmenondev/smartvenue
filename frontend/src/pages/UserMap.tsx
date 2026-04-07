import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { motion } from 'framer-motion';

export default function UserMap() {
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [queueTime, setQueueTime] = useState<number | null>(null);

  useEffect(() => {
    socket.on('crowd_update', setCrowdData);
    return () => {
      socket.off('crowd_update');
    };
  }, []);

  const handlePredictQueue = async (area: string, density: number) => {
    try {
      setQueueTime(null);
      const type = area.toLowerCase().includes('food') ? 'food' : area.toLowerCase().includes('gate') ? 'gate' : 'restroom';
      const res = await fetch('http://localhost:3001/api/queue-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, density })
      });
      const data = await res.json();
      setQueueTime(data.predicted_wait_time_minutes);
    } catch (err) {
      console.error("Failed to predict queue");
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Live Venue Map</h1>
        <p className="text-gray-400 mt-1">Navigate seamlessly avoiding crowded areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl relative min-h-[500px]">
          {/* Simulated Map Visual */}
          <div className="absolute inset-4 border-2 border-dashed border-gray-600 rounded-xl bg-gray-900/50 flex flex-col justify-center items-center">
             <div className="w-64 h-32 border border-gray-500 rounded-full flex items-center justify-center text-gray-500 font-bold mb-10">Pitch / Stage</div>
             <div className="w-full h-full flex flex-wrap gap-4 absolute top-0 p-8 justify-around items-center">
                 {crowdData.map((zone, idx) => {
                    const color = zone.status === 'Red' ? 'bg-red-500' : zone.status === 'Yellow' ? 'bg-yellow-500' : 'bg-green-500';
                    return (
                        <motion.button 
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePredictQueue(zone.area, zone.density)}
                            className={`p-4 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-md bg-opacity-30 ${color} transition cursor-pointer w-32`}
                        >
                            <h4 className="font-bold text-center text-sm">{zone.area}</h4>
                            <p className="text-xs text-center mt-2 font-mono">{zone.density} pax</p>
                        </motion.button>
                    )
                 })}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Queue Predictor</h2>
            <p className="text-sm text-gray-400 mb-4">Click any zone on the map to query the AI model for real-time wait times.</p>
            {queueTime !== null ? (
               <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-inner text-center">
                   <p className="text-sm font-semibold opacity-80">Estimated Wait Time</p>
                   <p className="text-4xl font-bold mt-1">{queueTime.toFixed(1)} <span className="text-lg font-normal">min</span></p>
               </div>
            ) : (
                <div className="p-4 bg-gray-700 rounded-lg shadow-inner text-center text-gray-400">
                    Select a zone...
                </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Smart Navigation</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Fastest route to Restroom: <span className="font-bold text-green-400">Clear</span></span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span>Route to Exit A: <span className="font-bold text-red-400">Congested</span> - take Exit C</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
