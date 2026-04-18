import React, { useState } from 'react';
import { 
  Users as People, Award, Activity, Mail, Github, Clock, MoreVertical, Search, Filter, Plus, X, Briefcase, Calendar, FolderKanban, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const INITIAL_TEAM = [
  { 
    name: 'Arjun Mehta', role: 'CEO & Co-Founder', 
    skills: ['Strategy', 'Fundraising', 'Leadership'], 
    status: 'Active', workload: 92, color: '#6366f1',
    email: 'arjun@nexavault.ai', joined: 'Jan 2025', projects: 8
  },
  { 
    name: 'Priya Sharma', role: 'CTO & Co-Founder', 
    skills: ['System Design', 'Python', 'AWS'], 
    status: 'Active', workload: 88, color: '#8b5cf6',
    email: 'priya@nexavault.ai', joined: 'Jan 2025', projects: 6
  },
  { 
    name: 'Rahul Verma', role: 'Full Stack Developer', 
    skills: ['React', 'Node.js', 'MongoDB'], 
    status: 'Active', workload: 75, color: '#10b981',
    email: 'rahul@nexavault.ai', joined: 'Mar 2025', projects: 5
  },
  { 
    name: 'Sneha Iyer', role: 'Data Scientist', 
    skills: ['Python', 'TensorFlow', 'Pandas'], 
    status: 'Away', workload: 40, color: '#f59e0b',
    email: 'sneha@nexavault.ai', joined: 'Apr 2025', projects: 3
  },
  { 
    name: 'Karan Joshi', role: 'Product Manager', 
    skills: ['Roadmaps', 'Agile', 'Analytics'], 
    status: 'Active', workload: 82, color: '#14b8a6',
    email: 'karan@nexavault.ai', joined: 'Feb 2025', projects: 7
  },
  { 
    name: 'Ananya Reddy', role: 'UI/UX Designer', 
    skills: ['Figma', 'CSS', 'Framer'], 
    status: 'Busy', workload: 70, color: '#ec4899',
    email: 'ananya@nexavault.ai', joined: 'May 2025', projects: 4
  },
];

export default function TeamSquad({ team, setTeam }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', skills: '' });

  const handleAddMember = (e) => {
    e.preventDefault();
    const member = {
      ...newMember,
      skills: newMember.skills.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Active',
      workload: Math.floor(Math.random() * 40) + 20,
      color: ['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6'][Math.floor(Math.random() * 6)],
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      projects: 0
    };
    setTeam(prev => [...prev, member]);
    setShowAddModal(false);
    setNewMember({ name: '', role: '', email: '', skills: '' });
  };

  const handleRemoveMember = (email) => {
    setTeam(prev => prev.filter(m => m.email !== email));
  };

  const filtered = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
             <input 
               placeholder="Search team member..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 13, outline: 'none' }} 
             />
          </div>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Members', value: team.length, icon: People, color: '#6366f1' },
          { label: 'Active Now', value: team.filter(m => m.status === 'Active').length, icon: Activity, color: '#10b981' },
          { label: 'Avg Workload', value: `${Math.round(team.reduce((a, m) => a + m.workload, 0) / team.length)}%`, icon: Briefcase, color: '#f59e0b' },
          { label: 'Total Projects', value: team.reduce((a, m) => a + m.projects, 0), icon: FolderKanban, color: '#14b8a6' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {filtered.map((m, i) => (
          <motion.div 
            key={m.name + m.email} 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card" style={{ padding: 32, position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: m.color + '22', border: `2px solid ${m.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: m.color }}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: m.status === 'Active' ? 'var(--success)' : m.status === 'Busy' ? 'var(--danger)' : 'var(--warning)', border: '3px solid var(--bg-card)', position: 'absolute', bottom: -2, right: -2 }}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ 
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
                  padding: '4px 10px', borderRadius: 6, 
                  background: m.status === 'Active' ? 'rgba(16,185,129,0.1)' : m.status === 'Busy' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                  color: m.status === 'Active' ? 'var(--success)' : m.status === 'Busy' ? 'var(--danger)' : 'var(--warning)',
                }}>{m.status.toUpperCase()}</span>
                <Trash2 
                  size={16} 
                  color="#ef4444" 
                  style={{ cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', marginLeft: 4 }} 
                  onClick={() => handleRemoveMember(m.email)}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                  title="Remove Member"
                />
                <MoreVertical size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>{m.role}</div>
              {m.email && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, opacity: 0.7 }}>{m.email}</div>}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
              {m.skills.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{s.toUpperCase()}</span>)}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {m.joined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <Calendar size={12} /> Joined {m.joined}
                </div>
              )}
              {m.projects !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <FolderKanban size={12} /> {m.projects} projects
                </div>
              )}
            </div>

            <div style={{ padding: '20px 0 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>
                <span>TEAM UTILIZATION</span>
                <span style={{ color: m.workload > 90 ? 'var(--danger)' : m.workload > 80 ? 'var(--warning)' : 'var(--success)' }}>{m.workload}% LOAD</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <div style={{ width: `${m.workload}%`, height: '100%', background: m.color, borderRadius: 10, boxShadow: `0 0 10px ${m.color}66`, transition: 'width 0.5s ease' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}><Mail size={14}/> Message</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}><Github size={14}/> Profile</button>
            </div>
          </motion.div>
        ))}

        {/* Add Team Member Card */}
        <div 
          onClick={() => setShowAddModal(true)}
          style={{ border: '2px dashed var(--border)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, cursor: 'pointer', transition: 'all 0.3s' }} 
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px dashed var(--primary)44' }}>
              <Plus size={26} color="var(--primary)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Add Team Member</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Invite new talent to the squad</div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ width: 480, padding: 40, background: 'var(--bg-card)', border: '1px solid var(--primary)33', borderRadius: 28, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Add Team Member</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'white', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>FULL NAME</label>
                  <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="e.g. John Doe" style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', fontSize: 14 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ROLE</label>
                    <input required value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="e.g. Backend Developer" style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', fontSize: 14 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>EMAIL</label>
                    <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="e.g. john@company.ai" style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', fontSize: 14 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SKILLS (comma-separated)</label>
                  <input required value={newMember.skills} onChange={e => setNewMember({...newMember, skills: e.target.value})} placeholder="e.g. React, Python, Docker" style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', fontSize: 14 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', border: '1px solid var(--border)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, boxShadow: '0 8px 20px -5px var(--primary-glow)' }}>Add Member</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
