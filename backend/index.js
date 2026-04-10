require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Mock DB state for the demo
let crowdData = [
  { area: 'Gate A', density: 120, status: 'Red', baseDensity: 100, type: 'entrance' },
  { area: 'Gate B', density: 45, status: 'Green', baseDensity: 50, type: 'entrance' },
  { area: 'Food Court 1', density: 80, status: 'Yellow', baseDensity: 60, type: 'service' },
  { area: 'Restroom North', density: 20, status: 'Green', baseDensity: 30, type: 'service' },
  { area: 'Section 101', density: 300, status: 'Red', baseDensity: 200, type: 'seating' },
];

const SCENARIOS = {
  'NORMAL': { multiplier: 1.0, noise: 10, description: 'Normal operation' },
  'PRE_GAME': { multiplier: 1.5, noise: 20, description: 'Pre-game rush: High entrance traffic' },
  'HALFTIME': { multiplier: 2.0, noise: 30, description: 'Halftime: Extreme service area pressure' },
  'POST_GAME': { multiplier: 1.8, noise: 25, description: 'Post-game: Massive exit flow' },
};

let currentScenario = 'NORMAL';
let scenarioTimer = 0;

function updateScenario() {
  const keys = Object.keys(SCENARIOS);
  currentScenario = keys[Math.floor(Math.random() * keys.length)];
  scenarioTimer = 60; // Scenario lasts 60 seconds
  console.log(`🚨 Scenario Changed to: ${currentScenario} - ${SCENARIOS[currentScenario].description}`);

  io.emit('scenario_change', {
    scenario: currentScenario,
    description: SCENARIOS[currentScenario].description
  });
}

// Initial scenario
updateScenario();

let alerts = [
  { id: 1, message: 'High congestion at Gate A. Please use Gate B.', type: 'warning' }
];

// --- AI Mitigation Engine ---
const getMitigationSuggestions = () => {
  const suggestions = [];
  const redZones = crowdData.filter(z => z.status === 'Red');
  const greenZones = crowdData.filter(z => z.status === 'Green');

  redZones.forEach(zone => {
    if (zone.type === 'entrance') {
      const alternative = greenZones.find(gz => gz.type === 'entrance');
      suggestions.push({
        id: `mit-${zone.area}`,
        target: zone.area,
        action: `Redirect attendee flow from ${zone.area} to ${alternative ? alternative.area : 'nearest available gate'}`,
        impact: 'High',
        estimatedReduction: '15-20%'
      });
    } else if (zone.type === 'service') {
      suggestions.push({
        id: `mit-${zone.area}`,
        target: zone.area,
        action: `Deploy 2 additional staff members to ${zone.area} to accelerate queue processing`,
        impact: 'Medium',
        estimatedReduction: '10-12%'
      });
    } else {
      suggestions.push({
        id: `mit-${zone.area}`,
        target: zone.area,
        action: `Initiate staggered seating protocols for ${zone.area} to prevent bottlenecking`,
        impact: 'Medium',
        estimatedReduction: '5-8%'
      });
    }
  });

  return suggestions;
};

// Provide REST endpoints
app.get('/api/crowd', (req, res) => {
  res.json({ data: crowdData });
});

app.get('/api/alerts', (req, res) => {
  res.json({ data: alerts });
});

app.get('/api/mitigations', (req, res) => {
  res.json({ data: getMitigationSuggestions() });
});

// Mock POST to add an alert
app.post('/api/alerts', (req, res) => {
  const newAlert = { id: Date.now(), message: req.body.message, type: req.body.type || 'info' };
  alerts.unshift(newAlert);
  io.emit('new_alert', newAlert);
  res.json({ success: true, alert: newAlert });
});

// Fetch prediction from ML service
app.post('/api/queue-prediction', async (req, res) => {
  try {
    const { type, density } = req.body;
    const response = await axios.post(`${ML_SERVICE_URL}/api/predict_queue`, { type, density });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prediction from ML Service' });
  }
});

// Websocket real-time events
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Send initial data
  socket.emit('crowd_update', crowdData);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Periodic mock updates for Hackathon demo effect
setInterval(() => {
  const scenario = SCENARIOS[currentScenario];

  // Update scenario timer
  scenarioTimer--;
  if (scenarioTimer <= 0) {
    updateScenario();
  }

  // Randomly update densities based on scenario
  crowdData = crowdData.map(c => {
    let multiplier = scenario.multiplier;

    // Scenario-specific logic
    if (currentScenario === 'PRE_GAME' && c.type === 'entrance') multiplier *= 1.5;
    if (currentScenario === 'HALFTIME' && c.type === 'service') multiplier *= 2.0;
    if (currentScenario === 'POST_GAME' && c.type === 'entrance') multiplier *= 1.8;

    const change = Math.floor((Math.random() * 21 - 10) * scenario.noise / 10);
    let newDensity = Math.max(0, Math.floor(c.baseDensity * multiplier) + change);

    let status = 'Green';
    if (newDensity > 180) status = 'Red';
    else if (newDensity > 80) status = 'Yellow';

    // Emit a telemetry log for this specific zone update
    io.emit('telemetry_log', {
      timestamp: new Date().toLocaleTimeString(),
      message: `[SENS_${Math.floor(Math.random()*1000)}] ${c.area}: ${change >= 0 ? '+' : ''}${change} pax | New Density: ${newDensity}`,
      level: status === 'Red' ? 'CRITICAL' : (status === 'Yellow' ? 'WARN' : 'INFO')
    });

    return { ...c, density: newDensity, status };
  });

  io.emit('crowd_update', crowdData);
}, 5000); // 5 seconds

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
