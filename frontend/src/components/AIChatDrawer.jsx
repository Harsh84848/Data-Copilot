import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Mic, MicOff } from "lucide-react";
import DynamicChart from "./DynamicChart";

export default function AIChatDrawer({ isOpen, onClose, messages, queryInput, setQueryInput, askData, chatEndRef }) {
  const [isListening, setIsListening] = useState(false);
  
  let recognition = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

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
                  <div style={{ marginTop: 12, width: '100%' }}>
                    <DynamicChart config={m.chart} />
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
              {recognition && (
                <button onClick={toggleListening} style={{ background: isListening ? '#ef4444' : 'transparent', border: '1px solid var(--border)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
                  {isListening ? <MicOff size={16} color="white" /> : <Mic size={16} color="white" />}
                </button>
              )}
              <button onClick={askData} style={{ background: 'var(--primary)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Search size={16} color="white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
