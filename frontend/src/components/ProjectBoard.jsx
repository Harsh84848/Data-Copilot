import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Plus, MoreHorizontal, Clock, Tag, User, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:8010";

export const SAMPLE_TASKS = [
  { _id: 's1', text: 'Set up CI/CD pipeline with GitHub Actions', priority: 'High', type: 'DevOps', staff: 'Priya', status: 'done' },
  { _id: 's2', text: 'Design landing page & brand identity kit', priority: 'High', type: 'Design', staff: 'Ananya', status: 'done' },
  { _id: 's3', text: 'Build user authentication & onboarding flow', priority: 'High', type: 'Dev', staff: 'Rahul', status: 'review' },
  { _id: 's4', text: 'Integrate Stripe payment gateway', priority: 'Medium', type: 'Dev', staff: 'Rahul', status: 'progress' },
  { _id: 's5', text: 'Train ML model for churn prediction', priority: 'Medium', type: 'Data', staff: 'Sneha', status: 'progress' },
  { _id: 's6', text: 'Conduct 10 user research interviews', priority: 'High', type: 'Product', staff: 'Karan', status: 'todo' },
  { _id: 's7', text: 'Write investor pitch deck for Series A', priority: 'High', type: 'Strategy', staff: 'Arjun', status: 'todo' },
  { _id: 's8', text: 'Set up analytics dashboard with Mixpanel', priority: 'Low', type: 'Dev', staff: 'Priya', status: 'todo' },
];

export default function ProjectBoard({ tasks, setTasks, fetchTasks, usingLocal }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ text: '', priority: 'Medium', type: 'Dev', staff: 'Rahul' });
  const [loading, setLoading] = useState(false);

  // fetchTasks is now passed as prop

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (usingLocal) {
      const localTask = { _id: 'l' + Date.now(), ...newTask, status: 'todo' };
      setTasks(prev => [...prev, localTask]);
      setShowAddModal(false);
      setNewTask({ text: '', priority: 'Medium', type: 'Dev', staff: 'Rahul' });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/tasks`, { ...newTask, status: 'todo' });
      fetchTasks();
      setShowAddModal(false);
      setNewTask({ text: '', priority: 'Medium', type: 'Dev', staff: 'Rahul' });
    } catch (err) { alert("Failed to add task."); }
  };

  const updateStatus = async (taskId, newStatus) => {
    if (usingLocal) {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) { alert("Update failed."); }
  };

  // Grouping tasks by status
  const columns = [
    { id: 'todo', title: 'BACKLOG', color: 'var(--text-muted)' },
    { id: 'progress', title: 'IN PROGRESS', color: 'var(--warning)' },
    { id: 'review', title: 'REVIEW', color: 'var(--primary)' },
    { id: 'done', title: 'COMPLETED', color: 'var(--success)' },
  ];

  return (
    <div style={{ padding: 40, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Project Board</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Manage tasks and project timelines across your startup team.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', boxShadow: '0 10px 20px -5px var(--primary-glow)' }}>
          <Plus size={18} /> New Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, overflowX: 'auto', paddingBottom: 20 }}>
        {columns.map(col => (
          <div key={col.id} style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 16px', borderBottom: '2px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }}></div>
                 <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{col.title} ({tasks.filter(t => t.status === col.id).length})</span>
              </div>
              <MoreHorizontal size={16} color="var(--text-muted)" />
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={(s) => updateStatus(task._id, s)} />
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && !loading && (
                <div style={{ padding: '32px', border: '1px dashed var(--border)', borderRadius: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  No tasks here.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card" style={{ width: 450, padding: 40, border: '1px solid var(--primary)33' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>New Task</h2>
              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>TASK DESCRIPTION</label>
                    <input required value={newTask.text} onChange={e => setNewTask({...newTask, text: e.target.value})} placeholder="What needs to be done?" style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>PRIORITY</label>
                       <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ padding: '12px', borderRadius: 12, background: '#191c2b', border: '1px solid var(--border)', color: 'white' }}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                       </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>STAFF</label>
                       <select value={newTask.staff} onChange={e => setNewTask({...newTask, staff: e.target.value})} style={{ padding: '12px', borderRadius: 12, background: '#191c2b', border: '1px solid var(--border)', color: 'white' }}>
                           <option>Arjun</option>
                           <option>Priya</option>
                           <option>Rahul</option>
                           <option>Sneha</option>
                           <option>Karan</option>
                           <option>Ananya</option>
                        </select>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', border: '1px solid var(--border)', color: 'white', fontWeight: 700 }}>Cancel</button>
                    <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'var(--primary)', border: 'none', color: 'white', fontWeight: 700 }}>Create Task</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TaskCard = ({ task, onStatusChange }) => (
  <motion.div layout id={task._id} className="card" style={{ padding: 24, background: 'var(--bg-card)', borderRadius: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
       <span style={{ fontSize: 10, fontWeight: 900, background: task.priority === 'High' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)', color: task.priority === 'High' ? 'var(--danger)' : 'var(--text-muted)', padding: '6px 12px', borderRadius: 8, letterSpacing: '0.05em' }}>
         {task.priority.toUpperCase()}
       </span>
       <div style={{ display: 'flex', gap: 8 }}>
          {task.status !== 'done' && <button onClick={() => onStatusChange(task.status === 'todo' ? 'progress' : task.status === 'progress' ? 'review' : 'done')} style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}><CheckCircle2 size={16}/></button>}
       </div>
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: 20 }}>{task.text}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
            <Tag size={13} /> {task.type}
         </div>
      </div>
      <div style={{ width: 28, height: 28, borderRadius: 10, background: 'var(--primary)22', border: '1px solid var(--primary)44', color: 'var(--primary)', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.staff[0]}</div>
    </div>
  </motion.div>
);
