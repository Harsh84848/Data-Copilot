import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, Download, Share2, Eye, Calendar, User, LayoutGrid, CheckCircle2, AlertTriangle, BarChart3, Clock, MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientReports({ dataInfo, API_BASE_URL }) {
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleGenerate = async () => {
    if (!dataInfo) {
      alert("Please upload a CSV file from the left sidebar first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/generate-report`, { 
        dataInfo: dataInfo 
      });
      
      const content = res.data.report;
      const newReport = {
        id: `REP-${String(reports.length + 1).padStart(3, '0')}`,
        name: `Automated ${dataInfo.filename.replace('.csv', '')} Summary`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'AI Summary',
        status: 'Approved',
        size: `${(new Blob([content]).size / 1024).toFixed(1)} KB`,
        content: content
      };
      setReports([newReport, ...reports]);
    } catch (err) {
      alert("Failed to generate report. Make sure backend is responsive.");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (report) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/ /g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Client Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Auto-generated analytical summaries and project milestones for client syncs.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating}
          style={{ background: generating ? 'rgba(255,255,255,0.05)' : 'var(--primary)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, cursor: generating ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: generating ? 'none' : '0 10px 20px -5px var(--primary-glow)' }}
        >
           {generating ? <Clock size={18} className="spin" /> : <LayoutGrid size={18} />} 
           {generating ? "Generating..." : "Generate New Report"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {reports.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-card)', borderRadius: 20, border: '1px dashed var(--border)' }}>
                <FileText size={40} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                <h3 style={{ margin: 0, fontWeight: 700 }}>No reports generated yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Upload a dataset and click Generate New Report.</p>
              </div>
            )}
            {reports.map((r, i) => (
              <motion.div 
                key={r.id} 
                initial={{ opacity: 0, x: -15, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.05 }}
              >
                <div className="card" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>{r.id.toUpperCase()}</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}><Calendar size={14}/> {r.date}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}><User size={14}/> AI Generator</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 40, flexShrink: 0 }}>
                     <div style={{ fontSize: 11, fontWeight: 800, color: r.status === 'Approved' ? 'var(--success)' : 'var(--warning)', background: r.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '4px 12px', borderRadius: 20 }}>{r.status.toUpperCase()}</div>
                     <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{r.size} MD</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => handleExport(r)} title="Export to File" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}><Download size={14} /></button>
                    <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} title="Preview Report" style={{ width: 36, height: 36, borderRadius: 10, background: expandedId === r.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}><Eye size={14} /></button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedId === r.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div className="markdown-body" style={{ margin: '12px 12px 24px', padding: 32, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: 15, lineHeight: 1.8 }}>
                        <ReactMarkdown>{r.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: 18 }}>Synthesis Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={16}/></div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 700 }}>Project On Track</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Milestone 4 reached 2 days early. Efficiency is up by 14%.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={16}/></div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 700 }}>Budget Warning</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Cloud spending is 12% above projected Q1 synthesis forecast.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BarChart3 size={16}/></div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 700 }}>Team Utilization</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Design resources are peaking. Suggest outsourcing Landing Page v2.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, var(--primary)22, var(--secondary)11)', border: '1px solid var(--primary)33' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
               <Clock size={18} color="var(--primary)" />
               <h3 style={{ margin: 0, fontSize: 16 }}>Next Automated Sync</h3>
             </div>
             <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your next Synthesis Report is scheduled for <b>Friday, March 27</b>. Data will be compiled at 12:00 UTC.</p>
             <button style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, marginTop: 12, width: '100%' }}>Modify Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}
