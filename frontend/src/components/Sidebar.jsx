import React from 'react';
import { 
  Plus, Activity, BrainCircuit, MessageSquare, Settings, 
  Table as TableIcon, AlertCircle, Zap, LayoutGrid, Users as People, FileText, ChevronRight
} from "lucide-react";

export default function Sidebar({ dataInfo, activeTab, setActiveTab, handleUpload, teamCount, tasksCount }) {
  return (
    <div style={{ width: 280, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px var(--primary-glow)' }}>
          <Zap size={18} color="white" />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>DataCopilot</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {/* Project Context */}
        <div style={{ margin: '0 12px 24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PROJECT CONTEXT</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>NexaVault AI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}></div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>MANAGEMENT ACTIVE</span>
          </div>
        </div>

        <label style={{ margin: '0 12px 24px', display: 'block' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: 'white', 
            padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, 
            textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 20px -5px var(--primary-glow)'
          }}>
            <Plus size={18} /> Upload CSV
            <input type="file" hidden accept=".csv" onChange={handleUpload} />
          </div>
        </label>

        <div style={{ padding: '0 12px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
           Analytics & Data
        </div>
        <SidebarItem icon={Activity} text="Real-time Analytics" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
        <SidebarItem icon={BrainCircuit} text="ML Forecasting" active={activeTab === "ml"} onClick={() => setActiveTab("ml")} />
        <SidebarItem icon={MessageSquare} text="AI Conversations" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />

        <div style={{ padding: '24px 12px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
           Startup OS
        </div>
        <SidebarItem icon={LayoutGrid} text="Project Board" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} badge={tasksCount} />
        <SidebarItem icon={People} text="Team Squad" active={activeTab === "team"} onClick={() => setActiveTab("team")} badge={teamCount} />
        <SidebarItem icon={FileText} text="Client Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />

        {dataInfo && (
          <>
            <div style={{ padding: '32px 12px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               Inventory Source
            </div>
            <div style={{ maxHeight: 150, overflowY: 'auto' }}>
              {dataInfo.headers.map(h => (
                <div key={h} style={{ padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)44' }}></div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{h}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'monospace' }}>
                    {dataInfo.col_types[h].includes('int') || dataInfo.col_types[h].includes('float') ? 'INT' : 'STR'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
        <SidebarItem icon={Settings} text="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        <SidebarItem icon={AlertCircle} text="Support" />
      </div>
    </div>
  );
}

const SidebarItem = ({ icon: Icon, text, active, onClick, badge }) => (
  <div onClick={onClick} className={`sidebar-item ${active ? 'active' : ''}`} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
    <Icon size={18} />
    <span style={{ marginLeft: 8, flex: 1 }}>{text}</span>
    {badge !== undefined && (
      <div style={{ background: active ? 'white' : 'rgba(255,255,255,0.1)', color: active ? 'var(--primary)' : 'var(--text-muted)', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
        {badge}
      </div>
    )}
  </div>
);
