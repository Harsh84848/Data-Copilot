import React, { useState } from 'react';
import { Bot, Play, Clock, Save, Plus, Database, Share2, Server } from "lucide-react";

export default function AgenticWorkflows() {
  const [workflows, setWorkflows] = useState([
    { id: 1, name: "Weekly Churn Analysis", schedule: "Every Monday, 9:00 AM", status: "Active", lastRun: "2 hours ago", target: "Client Reports" },
    { id: 2, name: "Sales DB Sync & Clean", schedule: "Daily, Midnight", status: "Active", lastRun: "12 hours ago", target: "Dashboard" },
  ]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bot size={32} color="var(--primary)" /> Agentic Workflows
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>Schedule autonomous AI agents to fetch, clean, analyze, and report on your data automatically.</p>
        </div>
        <button style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <Plus size={16} /> New Workflow
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {workflows.map(wf => (
          <div key={wf.id} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{wf.name}</div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{wf.status}</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Clock size={16} color="var(--text-muted)" /> <span>Runs: {wf.schedule}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Database size={16} color="var(--text-muted)" /> <span>Source: PostgreSQL (Sales_Prod)</span>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Share2 size={16} color="var(--text-muted)" /> <span>Action: Generate Markdown & Email</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last run: {wf.lastRun}</div>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                <Play size={14} /> Run Now
              </button>
            </div>
          </div>
        ))}

        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--primary)22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Plus size={24} color="var(--primary)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Create Custom Agent</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Set up a new cron job</div>
        </div>
      </div>
      
      <div style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid var(--border)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px 0' }}><Server size={20} color="var(--primary)"/> Multi-Modal Connections</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Connect your external databases to allow Agents to fetch data dynamically instead of relying on manual CSV uploads.</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Connect PostgreSQL</button>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Connect MongoDB</button>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Google Sheets API</button>
        </div>
      </div>
    </div>
  );
}
