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
  { area: 'Gate A', density: 120, status: 'Red' },
  { area: 'Gate B', density: 45, status: 'Green' },
  { area: 'Food Court 1', density: 80, status: 'Yellow' },
  { area: 'Restroom North', density: 20, status: 'Green' },
  { area: 'Section 101', density: 300, status: 'Red' },
];

let alerts = [
  { id: 1, message: 'High congestion at Gate A. Please use Gate B.', type: 'warning' }
];

// Provide REST endpoints
app.get('/api/crowd', (req, res) => {
  res.json({ data: crowdData });
});

app.get('/api/alerts', (req, res) => {
  res.json({ data: alerts });
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
  // Randomly update densities
  crowdData = crowdData.map(c => {
    const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
    let newDensity = Math.max(0, c.density + change);
    let status = 'Green';
    if (newDensity > 150) status = 'Red';
    else if (newDensity > 60) status = 'Yellow';
    
    return { ...c, density: newDensity, status };
  });

  io.emit('crowd_update', crowdData);
}, 5000); // 5 seconds

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
