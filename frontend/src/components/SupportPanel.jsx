import React, { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, FileText, Send, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportPanel() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketSubject("");
    setTicketMessage("");
    setTimeout(() => setTicketSent(false), 3000);
  };

  const faqs = [
    { q: "How do I invite team members?", a: "Go to the Team Squad page and click 'Add Team Member'." },
    { q: "Where can I upload my CSV data?", a: "Click the 'Upload CSV' button in the sidebar from any page." },
    { q: "Can I export Client Reports?", a: "Yes, you can download them as PDFs from the Client Reports tab." }
  ];

  return (
    <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Support Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Get help, submit a ticket, or browse our frequently asked questions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.5fr) 1fr', gap: 32 }}>
        
        {/* Support Ticket Form */}
        <div className="card" style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>Submit a Request</h2>
          </div>
          
          {ticketSent ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 32, textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 16, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
               <HelpCircle size={40} color="var(--success)" style={{ marginBottom: 16 }} />
               <h3 style={{ margin: 0, color: 'var(--success)', marginBottom: 8 }}>Ticket Submitted!</h3>
               <p style={{ color: 'var(--success)', opacity: 0.8, fontSize: 14 }}>Our support team will get back to you shortly.</p>
             </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>SUBJECT</label>
                <input 
                  required value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} 
                  placeholder="What is this regarding?" 
                  style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>MESSAGE</label>
                <textarea 
                  required value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} 
                  placeholder="Describe your issue in detail..." 
                  style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', minHeight: 150, resize: 'vertical' }} 
                />
              </div>
              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <Send size={18} /> Send Ticket
              </button>
            </form>
          )}
        </div>

        {/* Side Panel: FAQs and Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card" style={{ padding: 24, background: 'var(--bg-card)', borderRadius: 20 }}>
            <h3 style={{ fontSize: 16, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
               <HelpCircle size={18} color="var(--primary)" /> Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: i < faqs.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{faq.q}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{faq.a}</div>
                </div>
              ))}
            </div>
            <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', padding: '10px', borderRadius: 8, width: '100%', marginTop: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View All FAQs</button>
          </div>

          <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--primary)22, var(--secondary)11)', border: '1px solid var(--primary)33', borderRadius: 20 }}>
             <h3 style={{ fontSize: 16, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
               <Mail size={18} color="var(--primary)" /> Contact Us Directly
             </h3>
             <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
               For urgent inquiries, you can reach out to our dedicated priority support channel.
             </p>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 10 }}>
               <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></div>
               <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>support@datacopilot.ai</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
