import React from 'react';
import { 
  Users as People, Award, Activity, Mail, Github, Clock, MoreVertical, Search, Filter 
} from "lucide-react";
import { motion } from "framer-motion";

export default function TeamSquad() {
  const team = [
    { name: 'Sarah Connor', role: 'Full Stack Dev', skills: ['React', 'Node', 'Mongo'], status: 'Active', workload: 85, color: '#6366f1' },
    { name: 'Alex Murphy', role: 'Data Scientist', skills: ['Python', 'Sci-Kit', 'Pandas'], status: 'Away', workload: 40, color: '#10b981' },
    { name: 'Ellen Ripley', role: 'Product Manager', skills: ['Planning', 'Reports', 'Slack'], status: 'Active', workload: 95, color: '#f59e0b' },
    { name: 'Rick Deckard', role: 'UI Designer', skills: ['Figma', 'CSS', 'Framer'], status: 'Busy', workload: 70, color: '#ec4899' },
  ];

  return (
    <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Team Squad</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Track team availability, skill strength, and individual utilization.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', width: 300 }}>
             <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
             <input placeholder="Search team member..." style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 13, outline: 'none' }} />
          </div>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {team.map((m, i) => (
          <motion.div 
            key={m.name} 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card" style={{ padding: 32, position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: m.color + '22', border: `2px solid ${m.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: m.color }}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: m.status === 'Active' ? 'var(--success)' : m.status === 'Busy' ? 'var(--danger)' : 'var(--warning)', border: '3px solid var(--bg-card)', position: 'absolute', bottom: -2, right: -2 }}></div>
              </div>
              <MoreVertical size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>{m.role}</div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
              {m.skills.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{s.toUpperCase()}</span>)}
            </div>

            <div style={{ marginTop: 24, padding: '20px 0 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>
                <span>TEAM UTILIZATION</span>
                <span style={{ color: m.workload > 90 ? 'var(--danger)' : m.workload > 80 ? 'var(--warning)' : 'var(--success)' }}>{m.workload}% LOAD</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <div style={{ width: `${m.workload}%`, height: '100%', background: m.color, borderRadius: 10, boxShadow: `0 0 10px ${m.color}66` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Mail size={14}/> Message</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Github size={14}/> Profile</button>
            </div>
          </motion.div>
        ))}

        <div style={{ border: '2px dashed var(--border)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)11', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Plus size={24} color="var(--primary)" />
            </div>
            <div style={{ fontWeight: 700 }}>Add Team Member</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Invite new talent to the squad</div>
          </div>
        </div>
      </div>
    </div>
  );
}
