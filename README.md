# ⚡ DataCopilot: Startup Management & Analytics Platform

**DataCopilot** is a premium, high-performance analytical engine designed for startups to manage teams, projects, and data-driven insights in a single, unified interface. Built with a **Cyber-Teal Matrix** aesthetic, it combines raw power (FastAPI + Pandas) with modern aesthetics (React + Framer Motion).

---

## 📈 Project Progress [ ▓▓▓▓▓▓░░░░ 60% ]
The project is currently in **Phase 2 (Interaction & Persistence)**. Core analytics and project management foundations are live, with advanced AI features and automated reporting currently under development.

| Feature Area | Status | Progress |
| :--- | :--- | :--- |
| **Data Engine** | Fully Operational | 100% |
| **Authentication** | Active (MongoDB) | 90% |
| **Analytics Dashboard** | Live (Dynamic) | 85% |
| **Project Management** | Functional (Kanban) | 70% |
| **ML Module** | Working (Random Forest) | 60% |
| **AI Conversations** | Experimental | 40% |
| **Client Reporting** | UI Placeholder | 20% |
| **Notifications/API Sync** | Planning | 5% |

---

## 🚀 Core Features

### 📊 1. Data Analytics & ML Engine
*   **CSV Intelligence**: Drag-and-drop CSV upload for real-time automated EDA.
*   **Dynamic Dashboard**: KPI cards and interactive charts that auto-populate based on your dataset schema.
*   **ML Pipeline**: Select features and targets to train Random Forest models directly in the browser.
*   **AI Chat (NLP)**: Query your data using natural language (e.g., "What is the average sales in March?").

### 💼 2. Startup OS (Management)
*   **Project Board (Kanban)**: Track tasks through Backlog, In-Progress, Review, and Completed columns.
*   **Team Squad**: Monitor team workload, skill distribution, and real-time availability.
*   **Synthesis Reports**: Auto-generated client-ready summaries with budget warnings and efficiency alerts.

### 🌓 3. Visual Experience
*   **Cyber-Teal Theme**: Ultra-high contrast pure black background with vibrant teal accents.
*   **Glassmorphic UI**: Smooth transitions, hover glows, and responsive elevations.
*   **Theme Engine**: Intelligent Dark/Light mode switching.

---

## 🛠️ Tech Stack

### **Frontend**
*   **Framework**: React.js + Vite
*   **Aesthetics**: Vanilla CSS (Custom Variable Engine) + Framer Motion
*   **Charts**: Recharts (D3-based)
*   **Icons**: Lucide React

### **Backend**
*   **Engine**: FastAPI (Python)
*   **Analysis**: Pandas, NumPy
*   **AI/ML**: Scikit-learn
*   **Persistence**: MongoDB (Motor / Async Pymongo)

---

## ⚙️ Project Structure

```bash
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── database.py         # MongoDB connection
│   ├── services/
│   │   ├── analysis_service.py  # CSV & Query logic
│   │   ├── ml_service.py        # RF Training pipeline
│   │   └── project_service.py   # Task/Team CRUD
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/     # Modular UI sections
    │   ├── App.jsx         # Main router and state
    │   └── index.css       # Global Cyber-Teal styles
    └── package.json
```

---

## 🛠️ Quick Setup

### 1. Backend Initialization
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Note: Ensure MongoDB is running on `localhost:27017`.*

### 2. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Roadmap 2026
- [x] Phase 1: Analytics & CSV Exploration
- [x] Phase 2: Project Management & Teams
- [ ] Phase 3: AI-Suggested Team Allocation (ML based on project risk)
- [ ] Phase 4: Automated PDF/Excel Client Reporting
- [ ] Phase 5: Slack/Teams Notification Integration

---

**Developed with ❤️ for Advanced Agentic Coding.**
**© 2026 DataCopilot AI. Premium Startup Solutions.**
