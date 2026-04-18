import React from 'react';
import { Search, Bell, Sun, Moon, User, HelpCircle } from "lucide-react";

export default function Header({ queryInput, setQueryInput, askData, activeTab, setActiveTab, theme, toggleTheme, notificationsCount }) {
  return (
    <header style={{ height: 80, padding: '0 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-header)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, flex: 1 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <NavHeader text="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavHeader text="ML Models" active={activeTab === "ml"} onClick={() => setActiveTab("ml")} />
          <NavHeader text="Conversations" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
          <NavHeader text="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
          <NavHeader text="Team" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
          <NavHeader text="Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
        </div>
        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askData()}
            placeholder="Search insights..." 
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '10px 14px 10px 44px', borderRadius: 12, color: 'var(--text-main)', fontSize: 14, outline: 'none' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          {notificationsCount > 0 ? (
             <div style={{ padding: '0 4px', minWidth: 14, height: 14, borderRadius: 7, background: 'var(--danger)', border: '2px solid var(--bg-header)', position: 'absolute', top: -5, right: -5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 800 }}>
               {notificationsCount}
             </div>
          ) : (
             <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--bg-header)', position: 'absolute', top: -2, right: -2 }}></div>
          )}
        </div>
        <HelpCircle size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="white" />
          </div>
        </div>
      </div>
    </header>
  );
}

const NavHeader = ({ text, active, onClick }) => (
  <div onClick={onClick} style={{ 
    fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    padding: '8px 0'
  }}>{text}</div>
);
