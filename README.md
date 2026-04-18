# DataCopilot AI 🚀

![Project Status](https://img.shields.io/badge/Project%20Status-80%25%20Completed-brightgreen?style=for-the-badge)

DataCopilot is a cutting-edge, AI-driven analytics dashboard designed specifically for modern startup ecosystems. By bridging the gap between structured databases and Natural Language Processing, this platform allows teams to upload flat-file CSVs, generate instant heuristics, chat directly with their data using Google's GenAI infrastructure, and automatically map insight outputs into fully exportable Client Summaries.

## ✨ Core Features
- **AI File Analysis**: Drag and drop CSV datasets to instantly extract data heuristics, missing configurations, and typed schemas.
- **Conversational Matrix**: Ask analytical questions directly to your data environment in plain English, completely eliminating the need for SQL.
- **Automated Client Reporting**: Programmatically map ML context to render beautiful, downloadable Markdown reports.
- **Dynamic Startup Workspace**: Manage team squad rosters, toggle dynamic Kanban priorities, and explore software workflows.
- **Integrated ML Models**: Generate linear regression mapping or churn predictions instantly using standard Python Data Science pipelines.

## 🛠 Technical Stack
- **Frontend Core**: React 18 powered by Vite.
- **Styling Architecture**: Raw scalable CSS paired intricately with Framer Motion (micro-animations) and Lucide-React.
- **Backend Infrastructure**: Python-based FastAPI server processing synchronous and asynchronous execution pipelines.
- **Database**: MongoDB Atlas driven natively via `motor` asynchronously.
- **Language Models**: Powered natively by Google GenAI SDK (`gemini-2.5-flash`).

## 🚀 Quickstart Guide

### 1. Launch the Backend API
Navigate to the `backend` directory, bind your local environment, and execute the backend framework:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The backend engine natively serves requests via `http://localhost:8010`. *Note: An active MongoDB environment or Atlas string is required inside `database.py`.*

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
