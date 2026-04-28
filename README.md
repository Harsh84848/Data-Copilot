# DataCopilot AI 🚀

![Project Status](https://img.shields.io/badge/Project%20Status-100%25%20Completed-brightgreen?style=for-the-badge)

### Project Progress [ ▓▓▓▓▓▓▓▓▓▓ 100% ]
The project has reached **Phase 4 (Enterprise Optimization)**. Core data analytics, AI integration APIs, automated data cleaning, real-time speech processing, and agentic workflows are fully operational.

| Feature Area | Status | Progress |
| --- | --- | --- |
| **Data Engine (Multi-File)** | Fully Operational (CSV, Excel, JSON) | 100% |
| **Authentication** | Active (MongoDB) | 100% |
| **Consulting-Level Client Reports**| Auto-Generating via GenAI (Gemini) | 100% |
| **Magic Data Cleaning** | Automated Imputation Pipeline | 100% |
| **ML Module & Synthesis** | Working with AI Business Translation | 100% |
| **Generative AI Conversations** | Dynamic UI Charts & Voice Input | 100% |
| **Agentic Workflows** | UI Configured | 90% |

---

DataCopilot is a cutting-edge, AI-driven analytics dashboard designed specifically for modern startup ecosystems. By bridging the gap between structured databases and Natural Language Processing, this platform allows teams to upload multiple flat-files (CSV, Excel, JSON) simultaneously, generate instant heuristics, speak directly to their data using voice commands, and automatically map insight outputs into fully exportable Client Summaries.

## ✨ Core Features
- **Multi-Modal Data Ingestion**: Drag and drop multiple datasets simultaneously. The system intelligently stitches together CSVs, Excel files, and JSONs into a master Dataframe automatically.
- **Generative UI & Voice Assistant**: Ask analytical questions directly to your data environment using your **Voice (Web Speech API)**. The AI responds not just with text, but by rendering **Dynamic Recharts (Bar, Line, Pie)** directly in the chat interface.
- **Magic Data Cleaning Wand**: One-click autonomous data cleaning. The backend automatically imputes missing numeric values with medians and categorical values with modes.
- **Automated Client Reporting**: Programmatically generate highly-detailed, McKinsey-style Markdown reports using Gemini 2.5 Pro based on your dataset's statistical profile.
- **Automated ML Pipeline & Business Synthesis**: Train Random Forest models on the fly. The system calculates feature importance and automatically uses GenAI to translate the mathematical results into human-readable business insights (e.g., "Sales dropped by 10% driven by feature X").
- **Agentic Workflows**: Schedule autonomous AI agents to fetch, clean, and analyze data dynamically from external sources.
- **Dynamic Startup Workspace**: Manage team squad rosters, toggle dynamic Kanban priorities, and export dashboards natively to PDF.

## 🛠 Technical Stack
- **Frontend Core**: React 18 powered by Vite.
- **Styling Architecture**: Raw scalable CSS paired intricately with Framer Motion (micro-animations) and Lucide-React.
- **Backend Infrastructure**: Python-based FastAPI server processing synchronous and asynchronous execution pipelines (`openpyxl`, `pandas`, `scikit-learn`).
- **Database**: MongoDB Atlas driven natively via `motor` asynchronously.
- **Language Models**: Powered natively by Google GenAI SDK (`gemini-2.5-flash` / `gemini-2.5-pro`).

## 🚀 Quickstart Guide

### 1. Launch the Backend API
Navigate to the `backend` directory, bind your local environment, and execute the backend framework:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The backend engine natively serves requests via `http://localhost:8010` (with `reload=True` enabled). *Note: Ensure your `.env` file contains your `GOOGLE_API_KEY` for AI features to function.*

### 2. Deploy the Frontend Gateway
Initialize the client via `npm` inside the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The system dashboard can immediately be accessed through Vite at `http://localhost:5173`. 

---
*Developed by Harsh.*
