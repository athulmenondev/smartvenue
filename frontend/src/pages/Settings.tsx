import { motion } from 'framer-motion';
import { Save, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-10 space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-gray-400 mt-1">Configure SmartVenue engine and thresholds</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-blue-400" />
            <h2 className="text-xl font-bold">Alert Thresholds</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Red Alert Density Capacity</label>
              <input type="range" className="w-full accent-blue-500" min="50" max="500" defaultValue="150" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>50</span>
                <span>150 pax (Current)</span>
                <span>500</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-dispatch Security Staff on Red Alert</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-purple-400" />
            <h2 className="text-xl font-bold">Data Integrations</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">ML Service API Endpoint</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500" defaultValue={import.meta.env.VITE_ML_API_URL || "https://ml-service-6xakglkw2a-uc.a.run.app/api/"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">IoT Sensor Feed URL</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500" defaultValue={import.meta.env.VITE_IOT_SENSOR_URL || "wss://telemetry.smartvenue-cloud.app/stream"} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-green-400" />
            <h2 className="text-xl font-bold">Privacy & Security</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">SmartVenue strictly uses anonymized spatial maps and does not store personal identifiable information.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Enable Full Data Anonymization</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-medium shadow-lg">
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>
    </motion.div>
  );
}
