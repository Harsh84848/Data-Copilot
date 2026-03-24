import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search } from "lucide-react";
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export default function AIChatDrawer({ isOpen, onClose, messages, queryInput, setQueryInput, askData, chatEndRef }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
          style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 450, background: 'var(--bg-sidebar)', borderLeft: '1px solid var(--border)', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)' }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={20} color="var(--primary)" />
              <span style={{ fontWeight: 700 }}>AI Analysis</span>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'ai' && <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--primary)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={12} color="var(--primary)" /></div>}
                  <div style={{ padding: '12px 16px', borderRadius: 16, background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-card)', fontSize: 14, maxWidth: '85%', lineHeight: 1.6, border: m.role === 'user' ? 'none' : '1px solid var(--border)' }}>
                    {m.text}
                  </div>
                </div>
                {m.chart && (
                  <div style={{ marginTop: 12, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%' }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChartComponent chart={m.chart} />
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '12px 16px', border: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <input 
                value={queryInput} 
                onChange={e => setQueryInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && askData()}
                placeholder="Ask for deeper analysis..." 
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none' }} 
              />
              <button onClick={askData} style={{ background: 'var(--primary)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={16} color="white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const BarChartComponent = ({ chart }) => (
  <BarChart data={chart.data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
    <XAxis dataKey={chart.xKey} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
    <Bar dataKey={chart.yKey} fill="var(--primary)" radius={[4, 4, 0, 0]} />
    <Tooltip contentStyle={{background: '#16161a'}} />
  </BarChart>
);
