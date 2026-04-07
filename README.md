# SmartVenue: AI-Powered Stadium Experience Optimization System 🏟️

SmartVenue is a comprehensive edge-to-cloud prototype built to optimize the spectator experience at massive events. It acts like a "Google Maps for inside the stadium", monitoring crowd levels, predicting queues, and smoothing out traffic to ensure safety and convenience.

## 📖 The Big Idea

Large-scale sporting venues and concerts face major challenges:

- Dangerous crowd congestion.
- Painfully long waiting times for food and restrooms.
- Lack of real-time coordination for security and staff.

**SmartVenue** solves this by centralizing real-time telemetry (simulated hardware sensor data) into a central hub, allowing organizers to foresee bottlenecks before they happen, and giving users smart navigation tools to bypass congestion.

---

## 🧩 How the Pieces Fit Together

The system is a fully decoupled, modern architecture split into three main microservices:

### 1. The "Traffic Controller" (Backend Server)

- **Stack:** Node.js, Express, Socket.IO
- **What it does:** This is the middleman that holds everything together. For this prototype, this backend **simulates** the live IoT data. It has an internal simulation loop that adds and subtracts people from different stadium zones every 5 seconds. It instantly broadcasts these spatial changes out to the dashboards using WebSockets.

### 2. The "Smart Brain" (Machine Learning Service)

- **Stack:** Python, Flask, Scikit-Learn
- **What it does:** It acts as the Predictive Engine. When a user asks "how long is the line at Gate A?", the frontend asks this Python service. The service analyzes the current density and the zone type (e.g., food stalls move slower than bathrooms) and outputs an estimated waiting time in minutes.

### 3. The "Face of the App" (Frontend Client)

- **Stack:** React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion
- **What it does:** The visual interfaces consumed by admins and users.
  - **Admin Dashboard & Analytics:** Shows total attendees, bounding-box alerts, historical area graphs, and pie-chart distributions.
  - **User Map:** A simulated interactive map. Click on any colored zone to query the AI "Smart Brain" for live wait times.
  - **Settings:** Configuration toggles regulating alert thresholds.

---

## 🚀 Setup & Execution Guide

Follow these steps to run the complete environment locally. You will need 3 separate terminal tabs.

### 1. Boot up the ML Service (Python / Flask)

Navigate to the `ml_service` directory to start the predictive AI API:

```bash
cd ml_service
python3 -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

> Runs on `http://localhost:5000`

### 2. Boot up the Real-time Backend (Node.js)

Navigate to the backend server to begin the crowd simulation loop:

```bash
cd backend
npm install
node index.js
```

> Runs on `http://localhost:3001` and immediately begins streaming WebSocket data.

### 3. Boot up the Frontend App (React / TS)

Navigate to the frontend client to view the dashboard:

```bash
cd frontend
npm install
npm run dev
```

> Runs on `http://localhost:5173`

---

## 🧠 Usage & Demonstration Flow

1. **Launch the Frontend:** Open `http://localhost:5173` in your browser.
2. **Watch the Simulation:** the charts and metric cards will automatically jump and animate every 5 seconds. This represents exactly how the UI reacts to incoming WebSocket signals from physical IoT cameras counting head-traffic.
3. **Trigger the AI:** Click on the **User Map View** in the sidebar. The UI will render zones (e.g., Food Court, Section 101). Click any zone block—this silently hits the Python Flask API, retrieving and displaying an estimated queue time!
4. **Analytics:** Ensure everything works by visiting the beautiful **Crowd Analytics** tab to view historic distributions across the stadium.

---

_Built for the ultimate Hackathon challenge focusing on scale, real-time feedback, and predictive AI._
