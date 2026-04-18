import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AIChatDrawer from "./components/AIChatDrawer";
import Login from "./components/Login";
import MLModels from "./components/MLModels";
import Settings from "./components/Settings";
import Conversations from "./components/Conversations";
import ProjectBoard, { SAMPLE_TASKS } from "./components/ProjectBoard";
import TeamSquad, { INITIAL_TEAM } from "./components/TeamSquad";
import ClientReports from "./components/ClientReports";
import SupportPanel from "./components/SupportPanel";
import SRS from "./components/SRS";

// Icons for the empty state
import { Sparkles } from "lucide-react";

const API_BASE_URL = "http://localhost:8010";

export default function App() {
  const [user, setUser] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [queryInput, setQueryInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAnalysisDrawerOpen, setAnalysisDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const chatEndRef = useRef();

  // Lifted state for live stats
  const [tasks, setTasks] = useState([]);
  const [usingLocalTasks, setUsingLocalTasks] = useState(false);
  const [team, setTeam] = useState(INITIAL_TEAM);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tasks`);
      const data = res.data;
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
      } else {
        setTasks(SAMPLE_TASKS);
        setUsingLocalTasks(true);
      }
    } catch (err) {
      setTasks(SAMPLE_TASKS);
      setUsingLocalTasks(true);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      setDataInfo(res.data);
      setMessages([{ role: "ai", text: `I've analyzed **${file.name}**. Dashboard is ready for exploration!` }]);
    } catch (err) {
      alert("Backend error. Check if it's running.");
    }
    setLoading(false);
  };

  const askData = async () => {
    if (!queryInput.trim()) return;
    const msg = queryInput;
    setQueryInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    if (activeTab !== 'chat') setAnalysisDrawerOpen(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/query`, { query: msg });
      setMessages(prev => [...prev, { role: "ai", text: res.data.text, chart: res.data.chart }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong..." }]);
    }
    setLoading(false);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Define views mapping for better routing
  const renderView = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard dataInfo={dataInfo} />;
      case "ml": return <MLModels dataInfo={dataInfo} API_BASE_URL={API_BASE_URL} />;
      case "chat": return <Conversations messages={messages} queryInput={queryInput} setQueryInput={setQueryInput} askData={askData} chatEndRef={chatEndRef} />;
      case "settings": return <Settings user={user} />;
      case "projects": return <ProjectBoard tasks={tasks} setTasks={setTasks} fetchTasks={fetchTasks} usingLocal={usingLocalTasks} />;
      case "team": return <TeamSquad team={team} setTeam={setTeam} />;
      case "reports": return <ClientReports dataInfo={dataInfo} API_BASE_URL={API_BASE_URL} />;
      case "srs": return <SRS />;
      case "support": return <SupportPanel />;
      default: return <Dashboard dataInfo={dataInfo} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-main)', color: 'var(--text-main)', transition: 'background 0.3s' }}>
      {/* ─── Sidebar ─── */}
      <Sidebar 
        dataInfo={dataInfo} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleUpload={handleUpload}
        teamCount={team.length}
        tasksCount={tasks.filter(t => t.status !== 'done').length}
      />

      {/* ─── Main Content Area ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header 
          queryInput={queryInput} 
          setQueryInput={setQueryInput} 
          askData={askData} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          theme={theme}
          toggleTheme={toggleTheme}
          notificationsCount={tasks.filter(t => t.status === 'todo').length}
        />

        {/* Dynamic View */}
        {!dataInfo && !['projects', 'team', 'reports', 'srs', 'settings', 'support'].includes(activeTab) ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <div style={{ 
                width: 80, height: 80, borderRadius: 20, background: 'var(--primary)11', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
              }}>
                <Sparkles size={40} color="var(--primary)" />
              </div>
              <h3>Ready to explore your startup?</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Upload any CSV to start analytics, or head to the <b>Project Board</b> to manage your team and tasks.
              </p>
            </div>
          </div>
        ) : (
          renderView()
        )}
      </div>

      {/* ─── AI Analysis Drawer ─── */}
      {activeTab !== 'chat' && (
        <AIChatDrawer 
          isOpen={isAnalysisDrawerOpen} 
          onClose={() => setAnalysisDrawerOpen(false)}
          messages={messages}
          queryInput={queryInput}
          setQueryInput={setQueryInput}
          askData={askData}
          chatEndRef={chatEndRef}
        />
      )}
    </div>
  );
}
