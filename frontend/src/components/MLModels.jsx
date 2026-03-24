import React, { useState } from 'react';
import axios from "axios";
import { BrainCircuit, Play, BarChart3, Target, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function MLModels({ dataInfo, API_BASE_URL }) {
  const [target, setTarget] = useState("");
  const [features, setFeatures] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrain = async () => {
    if (!target) return alert("Please select a target column.");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/predict`, { target, features });
      setResult(res.data);
    } catch (err) {
      alert("ML Error. Check backend logs.");
    }
    setLoading(false);
  };

  const toggleFeature = (col) => {
    if (features.includes(col)) setFeatures(features.filter(f => f !== col));
    else setFeatures([...features, col]);
  };

  return (
    <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Automated ML Pipeline</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Select features and a target variable to train a Random Forest model.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Target size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Select Target</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {dataInfo.headers.map(h => (
              <button 
                key={h}
                onClick={() => setTarget(h)}
                style={{ 
                  padding: '8px 16px', borderRadius: 8, border: target === h ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: target === h ? 'var(--primary)11' : 'transparent', color: target === h ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: target === h ? 700 : 500
                }}
              >
                {h}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '32px 0 24px' }}>
            <Layers size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Select Features</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {dataInfo.headers.filter(h => h !== target).map(h => (
              <button 
                key={h}
                onClick={() => toggleFeature(h)}
                style={{ 
                  padding: '8px 16px', borderRadius: 8, border: features.includes(h) ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: features.includes(h) ? 'var(--primary)11' : 'transparent', color: features.includes(h) ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: features.includes(h) ? 700 : 500
                }}
              >
                {h}
              </button>
            ))}
          </div>

          <button 
            disabled={loading}
            onClick={handleTrain}
            style={{ 
              width: '100%', padding: '16px', borderRadius: 12, background: 'var(--primary)', 
              color: 'white', border: 'none', fontWeight: 700, marginTop: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: loading ? 0.7 : 1
            }}
          >
            <Play size={18} /> {loading ? "Training Model..." : "Train Model"}
          </button>
        </div>

        <div>
          {!result ? (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div>
                <BrainCircuit size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <p>Results will appear here after training.</p>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <BarChart3 size={20} color="var(--success)" />
                    <h3 style={{ margin: 0 }}>Model Accuracy</h3>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>{(result.score * 100).toFixed(1)}%</div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                  <div style={{ width: `${result.score * 100}%`, height: '100%', background: 'var(--success)', borderRadius: 10 }}></div>
                </div>
                <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.insight}</p>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ margin: '0 0 20px 0' }}>Feature Importance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {result.topFeatures.map((f, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                        <span>{f.feature}</span>
                        <span style={{ fontWeight: 700 }}>{(f.importance * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                        <div style={{ width: `${f.importance * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 10 }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
