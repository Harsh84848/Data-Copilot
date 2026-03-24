import React from 'react';
import { MessageSquare, Sparkles, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import AIChatDrawer from "./AIChatDrawer";

export default function ConversationsView({ messages, queryInput, setQueryInput, askData, chatEndRef }) {
  // We reuse the AIChatDrawer logic but in a full page layout
  return (
    <div style={{ display: 'flex', height: '100%', flex: 1, overflow: 'hidden' }}>
      <div style={{ width: 300, borderRight: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>History</h3>
        </div>
        <div style={{ flex: 1, padding: 12 }}>
          <div style={{ padding: '12px', borderRadius: 8, background: 'var(--primary)11', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Current Session Chat
          </div>
          <div style={{ marginTop: 200, textAlign: 'center', opacity: 0.3 }}>
            <MessageSquare size={32} style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 12 }}>No archived chats</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18 }}>DataCopilot AI</h2>
              <div style={{ fontSize: 12, color: 'var(--success)' }}>Online • Connected to Dataset</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Sparkles size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: 20 }} />
                <h2 style={{ color: 'var(--text-muted)' }}>Start a new analysis</h2>
                <p style={{ color: 'var(--text-muted)' }}>Ask questions about your data like "What is the average sales?"</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                   <div style={{ display: 'flex', gap: 16, maxWidth: '80%', alignItems: 'flex-start' }}>
                    {m.role === 'ai' && <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={16} color="var(--primary)" /></div>}
                    <div style={{ padding: '16px 20px', borderRadius: 20, background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-card)', fontSize: 15, lineHeight: 1.6, border: m.role === 'user' ? 'none' : '1px solid var(--border)', color: 'white' }}>
                      {m.text}
                      {m.chart && <div style={{ marginTop: 20, fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Chart generated below.</div>}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div style={{ padding: '24px 40px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '16px 24px', border: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
            <input 
              value={queryInput} 
              onChange={e => setQueryInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && askData()}
              placeholder="Type your question..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 16, outline: 'none' }} 
            />
            <button onClick={askData} style={{ background: 'var(--primary)', border: 'none', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Search size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
