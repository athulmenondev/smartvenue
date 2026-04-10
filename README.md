# SmartVenue AI: Next-Gen Stadium Experience Optimization 🏟️

SmartVenue AI is a high-performance, real-time operational intelligence platform designed to eliminate crowd congestion, reduce waiting times, and enhance safety in large-scale sporting and entertainment venues.

By combining **Real-time Telemetry Simulation**, **Predictive AI Analytics**, and a **Command Center Interface**, SmartVenue transforms raw venue data into actionable operational insights.

## 🌟 The "First Prize" Vision

Most venue management tools are reactive. **SmartVenue AI is proactive.** It doesn't just tell you that a gate is crowded; it predicts the trend and suggests optimal routing to prevent a bottleneck before it happens.

---
#Screenshots
<img width="1881" height="915" alt="2026-04-10_17-41" src="https://github.com/user-attachments/assets/a240c975-ba4f-4036-ba08-fc54c13149ce" />
<img width="1900" height="892" alt="2026-04-10_17-42" src="https://github.com/user-attachments/assets/c896ce78-d0b1-4854-bffd-51ed56920956" />
<img width="1907" height="912" alt="2026-04-10_17-42_1" src="https://github.com/user-attachments/assets/08a622ca-2bed-4b32-9cd1-10e76e9b150c" />

---

#Screenshots
<img width="1881" height="915" alt="2026-04-10_17-41" src="https://github.com/user-attachments/assets/a240c975-ba4f-4036-ba08-fc54c13149ce" />
<img width="1900" height="892" alt="2026-04-10_17-42" src="https://github.com/user-attachments/assets/c896ce78-d0b1-4854-bffd-51ed56920956" />
<img width="1907" height="912" alt="2026-04-10_17-42_1" src="https://github.com/user-attachments/assets/08a622ca-2bed-4b32-9cd1-10e76e9b150c" />

---

## 🛠️ Technical Architecture

The system uses a decoupled microservices architecture to ensure scalability and low-latency responses.

### 1. 📡 The Operational Hub (Backend)

- **Stack:** Node.js, Express, Socket.IO
- **Key Innovation:** **Scenario Engine.** Instead of static mocks, the backend runs dynamic event cycles (Pre-game, Halftime, Post-game) to simulate real-world pressure on specific venue zones.
- **Role:** Orchestrates real-time data streaming via WebSockets to all clients.

### 2. 🧠 The Predictive Brain (ML Service)

- **Stack:** Python, Flask, Scikit-Learn
- **Key Innovation:** **Trend Analysis.** The AI doesn't just provide a wait-time estimate; it calculates the _trajectory_ (Increasing/Decreasing/Stable) and provides a confidence score.
- **Role:** Processes density data to provide a "Smart Prediction" for queue times.

### 3. 💻 The Command Center (Frontend)

- **Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **Key Innovation:** **High-Fidelity UX.** Featuring a "NASA-style" dark mode command center and an interactive, color-coded stadium map with pulsing congestion alerts.
- **Role:** Provides administrators with a global "God View" and users with "Magic Navigation."

---

## 🚀 Quick Start Guide

### Prerequisites

- Docker & Docker Compose (Recommended)
- OR Node.js (v18+), Python (3.9+), and NPM

### Option A: The "One-Click" Demo (Docker)

The fastest way to experience the full power of SmartVenue AI.

```bash
docker-compose up --build
```

- **Admin Dashboard:** `http://localhost:80`
- **Backend API:** `http://localhost:3001`
- **ML Brain:** `http://localhost:5000`

### Option B: Manual Setup

1. **ML Service:**
   ```bash
   cd ml_service && pip install -r requirements.txt && python app.py
   ```
2. **Backend:**
   ```bash
   cd backend && npm install && node index.js
   ```
3. **Frontend:**
   ```bash
   cd frontend && npm install && npm run dev
   ```

---

## 📈 Competition Impact & Future Roadmap

### Why SmartVenue AI Wins:

- **Technical Depth:** Real-time WebSocket integration + Python AI Predictive Engine.
- **Operational Reality:** Use of "Scenarios" to prove the system works under extreme pressure (e.g., Halftime rush).
- **User-Centric Design:** Focuses on the _emotion_ of the attendee—reducing the stress of long lines.

### Future Vision:

- **Computer Vision Integration:** Replace simulation with real-time YOLOv8 person counting from CCTV feeds.
- **Dynamic Wayfinding:** Integration with digital signage to automatically update route arrows based on AI predictions.
- **Edge Deployment:** Moving the ML inference to the "Edge" (near the sensors) for sub-millisecond response times.

---

🤖 _Generated with [Claude Code](https://claude.com/claude-code)_
