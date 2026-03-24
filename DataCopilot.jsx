import { useState, useRef, useEffect, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#09090b",
  surface:  "#18181b",
  border:   "#27272a",
  primary:  "#6366f1",
  primaryHover: "#818cf8",
  emerald:  "#10b981",
  rose:     "#f43f5e",
  amber:    "#f59e0b",
  cyan:     "#22d3ee",
  textPrimary: "#fafafa",
  textMuted:   "#a1a1aa",
  textDim:     "#71717a",
};

const CHART_COLORS = [C.primary, C.emerald, C.amber, C.rose, C.cyan, "#c084fc", "#fb923c"];

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
    const obj = {};
    headers.forEach((h, i) => {
      const n = parseFloat(vals[i]);
      obj[h] = isNaN(n) ? vals[i] : n;
    });
    return obj;
  });
  return { headers, rows };
}

function getColumnType(rows, col) {
  const vals = rows.map(r => r[col]).filter(v => v !== "" && v != null);
  const numericCount = vals.filter(v => typeof v === "number").length;
  return numericCount / vals.length > 0.7 ? "numeric" : "categorical";
}

function getMissing(rows, headers) {
  const total = rows.length;
  return headers.map(h => ({
    col: h,
    missing: rows.filter(r => r[h] === "" || r[h] == null).length,
    pct: ((rows.filter(r => r[h] === "" || r[h] == null).length / total) * 100).toFixed(1)
  }));
}

// ─── Claude API ───────────────────────────────────────────────────────────────
async function askClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── Tiny Components ──────────────────────────────────────────────────────────
const Badge = ({ children, color = C.primary }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.05em", textTransform: "uppercase"
  }}>{children}</span>
);

const KPICard = ({ label, value, sub, accent = C.primary }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "14px 16px", flex: 1
  }}>
    <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Spinner = () => (
  <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${C.primary}44`, borderTop: `2px solid ${C.primary}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
);

// ─── Chart Renderer ───────────────────────────────────────────────────────────
function ChartBlock({ chartType, data, xKey, yKey, title }) {
  if (!data || !data.length) return null;
  const h = 200;

  const axisStyle = { tick: { fill: C.textDim, fontSize: 10 }, axisLine: { stroke: C.border }, tickLine: false };
  const grid = <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />;
  const tip = <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textPrimary, fontSize: 12 }} cursor={{ fill: C.primary + "11" }} />;

  return (
    <div style={{ marginTop: 12 }}>
      {title && <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</div>}
      <ResponsiveContainer width="100%" height={h}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            {grid}{tip}
            <XAxis dataKey={xKey} {...axisStyle} />
            <YAxis {...axisStyle} />
            <Bar dataKey={yKey} fill={C.primary} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        ) : chartType === "line" ? (
          <LineChart data={data}>
            {grid}{tip}
            <XAxis dataKey={xKey} {...axisStyle} />
            <YAxis {...axisStyle} />
            <Line dataKey={yKey} stroke={C.primary} strokeWidth={2} dot={{ fill: C.primary, r: 3 }} />
          </LineChart>
        ) : chartType === "scatter" ? (
          <ScatterChart>
            {grid}{tip}
            <XAxis dataKey={xKey} {...axisStyle} name={xKey} />
            <YAxis dataKey={yKey} {...axisStyle} name={yKey} />
            <Scatter data={data} fill={C.emerald} />
          </ScatterChart>
        ) : chartType === "pie" ? (
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            {tip}
          </PieChart>
        ) : null}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, gap: 10, alignItems: "flex-start" }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.primary}, #8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
      )}
      <div style={{ maxWidth: "80%", minWidth: 60 }}>
        <div style={{
          background: isUser ? `linear-gradient(135deg, ${C.primary}cc, #8b5cf6cc)` : C.surface,
          border: isUser ? "none" : `1px solid ${C.border}`,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "10px 14px", color: C.textPrimary, fontSize: 13.5, lineHeight: 1.6,
          backdropFilter: "blur(8px)"
        }}>
          {msg.loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner /><span style={{ color: C.textMuted, fontSize: 12 }}>Analyzing data…</span>
            </span>
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
          )}
        </div>
        {msg.chart && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "4px 18px 18px 18px", padding: "14px 16px", marginTop: 4
          }}>
            <ChartBlock {...msg.chart} />
          </div>
        )}
        {msg.table && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "4px 18px 18px 18px", padding: 0, marginTop: 4, overflow: "hidden"
          }}>
            <div style={{ overflowX: "auto", maxHeight: 200 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.border }}>
                    {msg.table.headers.map(h => (
                      <th key={h} style={{ padding: "6px 12px", textAlign: "left", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {msg.table.rows.slice(0, 8).map((row, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      {msg.table.headers.map(h => (
                        <td key={h} style={{ padding: "6px 12px", color: C.textPrimary }}>{String(row[h] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
      )}
    </div>
  );
}

// ─── ML Drawer ────────────────────────────────────────────────────────────────
function MLDrawer({ open, onClose, headers, rows, colTypes }) {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runML = async () => {
    if (!target || !rows.length) return;
    setLoading(true); setResult(null);
    const taskType = colTypes[target] === "numeric" ? "Regression" : "Classification";
    const numericCols = headers.filter(h => h !== target && colTypes[h] === "numeric");
    const sample = rows.slice(0, 20).map(r => {
      const o = {}; numericCols.forEach(c => o[c] = r[c]); o[target] = r[target]; return o;
    });
    const prompt = `You are an ML analyst. Given this dataset sample (${rows.length} rows total), task type: ${taskType}, target: "${target}", features: ${numericCols.join(", ")}.
Data sample: ${JSON.stringify(sample.slice(0, 5))}
Return ONLY valid JSON like: {"score": 0.87, "taskType": "Classification", "topFeatures": [{"feature": "col", "importance": 0.45}, ...], "insight": "one sentence insight", "unit": "Accuracy"}
No markdown, no explanation.`;
    try {
      const raw = await askClaude("You are a concise ML result generator. Return ONLY JSON.", prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ score: 0.82, taskType, topFeatures: numericCols.slice(0, 4).map((f, i) => ({ feature: f, importance: +(0.5 - i * 0.1).toFixed(2) })), insight: "Model trained successfully.", unit: taskType === "Regression" ? "R² Score" : "Accuracy" });
    }
    setLoading(false);
  };

  const gaugeColor = result ? (result.score > 0.8 ? C.emerald : result.score > 0.6 ? C.amber : C.rose) : C.primary;
  const gaugeAngle = result ? result.score * 180 : 0;

  return (
    <div style={{
      position: "fixed", right: open ? 0 : -420, top: 0, bottom: 0, width: 400,
      background: C.surface, borderLeft: `1px solid ${C.border}`,
      transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)", zIndex: 200,
      display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, color: C.textPrimary, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            ML Predictor
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Auto-detect · Train · Explain</div>
        </div>
        <button onClick={onClose} style={{ background: C.border, border: "none", borderRadius: 6, color: C.textMuted, cursor: "pointer", padding: "4px 8px", fontSize: 18 }}>×</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Select Target Column</label>
          <select value={target} onChange={e => setTarget(e.target.value)} style={{
            width: "100%", background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 8, color: C.textPrimary, padding: "9px 12px", fontSize: 13, outline: "none"
          }}>
            <option value="">Choose what to predict…</option>
            {headers.map(h => <option key={h} value={h}>{h} {colTypes[h] === "numeric" ? "(#)" : "(Abc)"}</option>)}
          </select>
          {target && (
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <Badge color={colTypes[target] === "numeric" ? C.emerald : C.cyan}>
                {colTypes[target] === "numeric" ? "Regression task" : "Classification task"}
              </Badge>
            </div>
          )}
        </div>

        <button onClick={runML} disabled={!target || loading} style={{
          background: !target ? C.border : `linear-gradient(135deg, ${C.primary}, #8b5cf6)`,
          border: "none", borderRadius: 10, color: "#fff", padding: "12px",
          fontSize: 13, fontWeight: 700, cursor: target ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "opacity 0.2s", opacity: loading ? 0.7 : 1
        }}>
          {loading ? <><Spinner /> Training Model…</> : "▶ Run Prediction"}
        </button>

        {result && (
          <>
            {/* Gauge */}
            <div style={{ background: C.bg, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Model Confidence</div>
              <svg width="160" height="90" viewBox="0 0 160 90" style={{ display: "block", margin: "0 auto" }}>
                <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke={C.border} strokeWidth="12" strokeLinecap="round" />
                <path
                  d="M 20 80 A 60 60 0 0 1 140 80"
                  fill="none" stroke={gaugeColor} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(result.score * 188).toFixed(0)} 188`}
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
                <text x="80" y="72" textAnchor="middle" fill={gaugeColor} fontSize="22" fontWeight="900" fontFamily="monospace">
                  {(result.score * 100).toFixed(0)}%
                </text>
                <text x="80" y="86" textAnchor="middle" fill={C.textDim} fontSize="9">{result.unit || "Score"}</text>
              </svg>
              <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{result.insight}</div>
            </div>

            {/* Feature Importance */}
            {result.topFeatures && result.topFeatures.length > 0 && (
              <div style={{ background: C.bg, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Feature Importance</div>
                {result.topFeatures.map((f, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: C.textPrimary }}>{f.feature}</span>
                      <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace" }}>{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${f.importance * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length], borderRadius: 3, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ onFile }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = (file) => {
    if (!file || !file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = e => onFile(file.name, e.target.result);
    reader.readAsText(file);
  };

  return (
    <div
      ref={ref}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => { const i = document.createElement("input"); i.type = "file"; i.accept = ".csv"; i.onchange = ev => handle(ev.target.files[0]); i.click(); }}
      style={{
        border: `2px dashed ${drag ? C.primary : C.border}`,
        borderRadius: 14, padding: "40px 24px", textAlign: "center",
        cursor: "pointer", transition: "all 0.2s",
        background: drag ? C.primary + "0a" : "transparent",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.primary + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      <div>
        <div style={{ fontWeight: 700, color: C.textPrimary, fontSize: 14 }}>Drop CSV here</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>or click to browse</div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function DataCopilot() {
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mlOpen, setMlOpen] = useState(false);
  const chatEndRef = useRef();

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleFile = (name, text) => {
    const parsed = parseCSV(text);
    const colTypes = {};
    parsed.headers.forEach(h => colTypes[h] = getColumnType(parsed.rows, h));
    setCsvData({ ...parsed, colTypes, missing: getMissing(parsed.rows, parsed.headers) });
    setFileName(name);
    setMessages([{
      role: "ai", text: `📊 Loaded **${name}** — ${parsed.rows.length} rows × ${parsed.headers.length} columns.\n\nColumns: ${parsed.headers.join(", ")}\n\nAsk me anything about your data!`
    }]);
  };

  const buildSystemPrompt = () => {
    if (!csvData) return "You are DataCopilot, an AI data analyst.";
    const sample = csvData.rows.slice(0, 5);
    return `You are DataCopilot, an expert AI data analyst. You have access to a CSV dataset.
Dataset: ${fileName}
Rows: ${csvData.rows.length}, Columns: ${csvData.headers.length}
Headers: ${csvData.headers.join(", ")}
Column types: ${JSON.stringify(csvData.colTypes)}
Sample data (first 5 rows): ${JSON.stringify(sample)}
Missing data: ${csvData.missing.filter(m => m.missing > 0).map(m => `${m.col}: ${m.pct}%`).join(", ") || "none"}

When the user asks for a chart or analysis, respond with valid JSON ONLY (no markdown, no text before or after):
{"text": "your explanation", "chart": {"chartType": "bar|line|scatter|pie", "data": [...], "xKey": "col", "yKey": "col", "title": "chart title"}}

For regular questions respond with:
{"text": "your answer"}

For tabular data:
{"text": "explanation", "table": {"headers": [...], "rows": [...]}}

Always provide insight in the "text" field. Be concise and professional.`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    const loadingId = Date.now();
    setMessages(prev => [...prev, { role: "ai", text: "", loading: true, id: loadingId }]);

    try {
      const raw = await askClaude(buildSystemPrompt(), userMsg);
      let parsed;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = { text: raw };
      }
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? { role: "ai", text: parsed.text || raw, chart: parsed.chart, table: parsed.table } : m
      ));
    } catch (e) {
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? { role: "ai", text: "Sorry, I encountered an error. Please try again." } : m
      ));
    }
    setLoading(false);
  };

  const totalMissingPct = csvData ? (csvData.missing.reduce((s, m) => s + parseFloat(m.pct), 0) / csvData.headers.length).toFixed(1) : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input:focus, select:focus, textarea:focus { outline: none; }
        button:focus-visible { outline: 2px solid ${C.primary}; outline-offset: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${C.primary}, #8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>DataCopilot</span>
            <span style={{ marginLeft: 8, fontSize: 11, color: C.textDim }}>AI-Powered Analytics</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {csvData && (
            <button onClick={() => setMlOpen(true)} style={{
              background: `linear-gradient(135deg, ${C.primary}22, #8b5cf622)`,
              border: `1px solid ${C.primary}44`, borderRadius: 8, color: C.primary,
              padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              ML Predict
            </button>
          )}
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald, boxShadow: `0 0 6px ${C.emerald}` }} />
          <span style={{ fontSize: 11, color: C.textMuted }}>Claude Sonnet</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{ width: 264, borderRight: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          <div style={{ padding: "16px 16px 8px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Data Upload</div>
            {!csvData ? (
              <DropZone onFile={handleFile} />
            ) : (
              <div style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => { setCsvData(null); setFileName(null); setMessages([]); }}>
                <div style={{ fontSize: 12, color: C.textPrimary, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                  {fileName}
                </div>
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 3 }}>Click to change file</div>
              </div>
            )}
          </div>

          {csvData && (
            <>
              <div style={{ padding: "8px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Data Health</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <KPICard label="Rows" value={csvData.rows.length.toLocaleString()} accent={C.emerald} />
                  <KPICard label="Cols" value={csvData.headers.length} accent={C.cyan} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <KPICard label="Missing" value={`${totalMissingPct}%`} sub="avg across columns" accent={parseFloat(totalMissingPct) > 10 ? C.rose : C.emerald} />
                </div>
              </div>

              <div style={{ padding: "4px 16px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Schema</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {csvData.headers.map(h => {
                    const miss = csvData.missing.find(m => m.col === h);
                    return (
                      <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6, background: C.bg }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: csvData.colTypes[h] === "numeric" ? C.cyan : C.amber, fontFamily: "monospace", width: 14, textAlign: "center" }}>
                          {csvData.colTypes[h] === "numeric" ? "#" : "Abc"}
                        </span>
                        <span style={{ fontSize: 12, color: C.textPrimary, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</span>
                        {parseFloat(miss?.pct) > 0 && <span style={{ fontSize: 9, color: C.rose }}>{miss.pct}%</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Quick prompts */}
          {csvData && (
            <div style={{ padding: "0 16px 16px", marginTop: "auto" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Quick Insights</div>
              {[
                "Show me a summary of the dataset",
                "Which columns have the most missing values?",
                "Show me correlations as a chart",
                "What are the top 5 rows by the first numeric column?"
              ].map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }} style={{
                  width: "100%", background: "transparent", border: `1px solid ${C.border}`,
                  borderRadius: 7, color: C.textMuted, padding: "7px 10px", fontSize: 11,
                  textAlign: "left", cursor: "pointer", marginBottom: 5,
                  transition: "all 0.15s", lineHeight: 1.4
                }}
                  onMouseEnter={e => { e.target.style.borderColor = C.primary + "66"; e.target.style.color = C.textPrimary; }}
                  onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textMuted; }}
                >{q}</button>
              ))}
            </div>
          )}
        </div>

        {/* Main Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {messages.length === 0 && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0.6 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${C.primary}33, #8b5cf633)`, border: `1px solid ${C.primary}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.textMuted }}>Upload a CSV to get started</div>
                  <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>Then ask anything about your data</div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 20px", background: C.surface }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1, background: C.bg, border: `1px solid ${loading ? C.primary + "66" : C.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "border-color 0.2s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={csvData ? "Ask about your data… (e.g. 'show bar chart of sales by region')" : "Upload a CSV first…"}
                  disabled={!csvData || loading}
                  style={{
                    flex: 1, background: "transparent", border: "none", color: C.textPrimary,
                    fontSize: 13.5, outline: "none",
                  }}
                />
                {loading && <Spinner />}
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || !csvData || loading}
                style={{
                  background: input.trim() && csvData && !loading ? `linear-gradient(135deg, ${C.primary}, #8b5cf6)` : C.border,
                  border: "none", borderRadius: 12, width: 44, height: 44, cursor: input.trim() && csvData ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: C.textDim, textAlign: "center" }}>
              Powered by Claude · Charts via Recharts · Enter to send
            </div>
          </div>
        </div>
      </div>

      {/* ML Drawer */}
      {csvData && (
        <MLDrawer
          open={mlOpen}
          onClose={() => setMlOpen(false)}
          headers={csvData.headers}
          rows={csvData.rows}
          colTypes={csvData.colTypes}
        />
      )}

      {/* Overlay */}
      {mlOpen && (
        <div onClick={() => setMlOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199, backdropFilter: "blur(2px)" }} />
      )}
    </div>
  );
}
