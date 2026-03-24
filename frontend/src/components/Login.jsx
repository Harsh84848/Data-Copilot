import React, { useState } from 'react';
import axios from "axios";
import { Mail, Lock, Zap, ArrowRight, UserPlus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:8010";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const endpoint = isSignup ? "/signup" : "/login";
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, { email, password });
      if (res.data.email) {
        onLogin(res.data);
      } else if (res.data.message) {
        alert(res.data.message);
        setIsSignup(false);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Connection failed. Is MongoDB and Backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: 420, padding: 48, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            <Zap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{isSignup ? "Create Account" : "DataCopilot AI"}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
            {isSignup ? "Join the next generation of data analysis." : "Login to your workspace to continue."}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--danger)', padding: '12px', borderRadius: 12, marginBottom: 24, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '14px 14px 14px 48px', borderRadius: 12, color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '14px 14px 14px 48px', borderRadius: 12, color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <button disabled={loading} type="submit" style={{ 
            background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: 12, 
            border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12,
            boxShadow: '0 10px 20px -5px var(--primary-glow)', fontSize: 16,
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? "Processing..." : (isSignup ? "Create Account" : "Sign In")} <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button 
            onClick={() => setIsSignup(!isSignup)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginLeft: 8 }}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
