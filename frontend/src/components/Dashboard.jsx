import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  Zap, Database, Activity, Filter, ChevronRight, Sparkles, ShoppingCart, TrendingUp, Award, Globe
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard({ dataInfo, setDataInfo }) {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  useEffect(() => {
    if (dataInfo) {
      fetchInsights();
    }
  }, [dataInfo]);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await axios.get('http://localhost:8010/ai-insights');
      setAiInsights(res.data.insights);
    } catch (err) {
      console.error(err);
      setAiInsights("**Data loaded!** Configure the AI parameters in the backend `.env` file to see deep insights.");
    }
    setIsLoadingInsights(false);
  };

  const handleCleanData = async () => {
    if (!dataInfo) return;
    setIsCleaning(true);
    try {
      const res = await axios.post('http://localhost:8010/clean');
      setDataInfo(res.data);
      alert("Data cleaned successfully! Nulls imputed and outliers handled.");
    } catch (err) {
      console.error(err);
      alert("Failed to clean data.");
    }
    setIsCleaning(false);
  };

  // Demo data if no CSV uploaded
  const demoKpis = [
    { label: "Total Sales", value: "$142,850.00", trend: "+12.5%", color: "var(--success)", icon: Zap, sparkData: [{v: 10}, {v: 15}, {v: 8}, {v: 25}, {v: 18}, {v: 40}] },
    { label: "Gross Profit", value: "$48,210.50", trend: "+8.2%", color: "var(--success)", icon: Database, sparkData: [{v: 5}, {v: 12}, {v: 20}, {v: 10}, {v: 25}, {v: 22}] },
    { label: "New Orders", value: "1,248", trend: "-2.4%", color: "var(--danger)", icon: ShoppingCart, sparkData: [{v: 20}, {v: 18}, {v: 22}, {v: 15}, {v: 10}, {v: 12}] },
    { label: "Return Rate", value: "1.8%", trend: "-15%", color: "var(--danger)", icon: TrendingUp, sparkData: [{v: 30}, {v: 20}, {v: 25}, {v: 15}, {v: 10}, {v: 5}] },
  ];

  const displayKpis = dataInfo ? [
    { label: "Total Records", value: dataInfo.kpis.total_records.toLocaleString(), trend: "+0.0%", color: "var(--success)", icon: Zap, sparkData: [{v: 10}, {v: 25}, {v: 20}, {v: 40}, {v: 30}, {v: 45}] },
    { label: "Data Columns", value: dataInfo.kpis.total_cols, trend: "Static", color: "var(--primary)", icon: Database, sparkData: [{v: 5}, {v: 15}, {v: 10}, {v: 25}, {v: 20}, {v: 35}] },
    { label: "Total Missing", value: dataInfo.kpis.total_missing, trend: "-2.4%", color: "var(--danger)", icon: ShoppingCart, sparkData: [{v: 20}, {v: 15}, {v: 18}, {v: 12}, {v: 25}, {v: 10}] },
    { label: "Avg. Numeric", value: dataInfo.kpis.numeric_avg.toFixed(1), trend: "Dynamic", color: "var(--success)", icon: TrendingUp, sparkData: [{v: 30}, {v: 25}, {v: 35}, {v: 20}, {v: 40}, {v: 15}] },
  ] : demoKpis;

  // Derive chart data if uploaded
  const numericHeaders = dataInfo ? dataInfo.headers.filter(h => dataInfo.col_types[h].includes('int') || dataInfo.col_types[h].includes('float')) : [];
  const catHeaders = dataInfo ? dataInfo.headers.filter(h => !dataInfo.col_types[h].includes('int') && !dataInfo.col_types[h].includes('float')) : [];
  
  const chartX = catHeaders[0] || (dataInfo?.headers[0]);
  const chartY = numericHeaders[0] || (dataInfo?.headers[1]);
  const chartData = dataInfo ? dataInfo.sample_rows.map(row => ({ name: String(row[chartX]).slice(0, 8), val: Number(row[chartY]) || 0 })) : [
    {name: 'WK 01', val: 4500}, {name: 'WK 02', val: 5200}, {name: 'WK 03', val: 4800}, {name: 'WK 04', val: 6100}
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Performance Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Real-time analytical overview of {dataInfo ? dataInfo.filename : 'Project Alpha'} metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {dataInfo && (
            <button onClick={handleCleanData} disabled={isCleaning} style={{ background: 'linear-gradient(45deg, #ec4899, #8b5cf6)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center', cursor: isCleaning ? 'not-allowed' : 'pointer', opacity: isCleaning ? 0.7 : 1 }}>
              <Sparkles size={16} /> {isCleaning ? 'Cleaning...' : 'Magic Clean'}
            </button>
          )}
          <button onClick={() => window.print()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Export PDF</button>
          <button style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>Refresh Data</button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {displayKpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 24, marginBottom: 40 }}>
        {/* Dynamic Data Trend Chart */}
        <Card title={dataInfo ? `${chartY} by ${chartX}` : "Sales Trend"} icon={TrendingUp} action={<span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Top Samples</span>}>
          <div style={{ height: 350, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Bar dataKey="val" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PEAK VALUE</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{Math.max(...chartData.map(d => d.val))}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG SAMPLE</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{(chartData.reduce((acc, v) => acc + v.val, 0) / chartData.length).toFixed(1)}</div>
            </div>
          </div>
        </Card>

        {/* Business Overview Table - Dynamic */}
        <Card title="Data Overview" icon={Globe} action={<span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>FIRST 5 ROWS <ChevronRight size={14}/></span>}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {dataInfo ? dataInfo.headers.slice(0, 5).map(h => <th key={h} style={{ padding: '16px 8px' }}>{h}</th>) : (
                    <><th>Region</th><th>Transactions</th><th>Revenue</th><th>Status</th><th>Efficiency</th></>
                  )}
                </tr>
              </thead>
              <tbody style={{ fontSize: 13, fontWeight: 500 }}>
                {dataInfo ? dataInfo.sample_rows.slice(0, 5).map((row, idx) => (
                   <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                     {dataInfo.headers.slice(0, 5).map(h => <td key={h} style={{ padding: '20px 8px' }}>{String(row[h]).slice(0, 50)}</td>)}
                   </tr>
                )) : (
                  <>
                    <TableRow region="North America" trans="4,285" rev="$842k" status="STABLE" progress={85} />
                    <TableRow region="European Union" trans="3,120" rev="$615k" status="ACCELERATING" progress={70} />
                    <TableRow region="Asia Pacific" trans="5,840" rev="$924k" status="RISK" progress={45} />
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr minmax(280px, 1fr)', gap: 24 }}>
        <Card title="Segments" action={<Activity size={16} color="var(--text-muted)" />}>
           <div style={{ height: 260, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{v: 45}, {v: 30}, {v: 25}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none" paddingAngle={8}>
                  <Cell fill="var(--primary)" />
                  <Cell fill="var(--secondary)" />
                  <Cell fill="var(--success)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>100%</div>
            </div>
          </div>
        </Card>

        <Card title="AI Data Insights" icon={Sparkles}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isLoadingInsights ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Generating deep AI insights...</div>
            ) : aiInsights ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)', 
                border: '1px solid rgba(16, 185, 129, 0.1)', 
                padding: '16px', 
                borderRadius: 16, 
                fontSize: 13, 
                lineHeight: 1.6,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <ReactMarkdown>{aiInsights}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Upload a dataset to generate AI insights.</div>
            )}
          </div>
        </Card>

        <Card title="Rankings" icon={Award}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <RankRow rank="#1" title="Dataset Ready" sub="Verified" />
            <RankRow rank="#2" title="Analytics Live" sub="Connected" />
          </div>
        </Card>
      </div>

      <footer style={{ marginTop: 80, padding: '40px 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>DataCopilot AI</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>© 2026 DataCopilot AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

const KPICard = ({ label, value, trend, color, icon: Icon, sparkData }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card kpi-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon && <Icon size={18} color="var(--primary)" />}
      </div>
      <div className="kpi-trend" style={{ background: color + '11', color: color }}>
        {trend}
      </div>
    </div>
    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div className="kpi-value" style={{ marginTop: 4 }}>{value}</div>
    <div style={{ height: 50, marginTop: 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparkData}>
          <Area type="monotone" dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.05} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const Card = ({ title, children, action, icon: Icon }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && <Icon size={18} color="var(--primary)" />}
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        </div>
      )}
      {action}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const TableRow = ({ region, trans, rev, status, progress }) => (
  <tr style={{ borderBottom: '1px solid var(--border)' }}>
    <td style={{ padding: '20px 8px', fontWeight: 700 }}>{region}</td>
    <td>{trans}</td>
    <td>{rev}</td>
    <td><span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>{status}</span></td>
    <td><div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}><div style={{ width: progress + '%', height: '100%', background: 'var(--primary)', borderRadius: 10 }} /></div></td>
  </tr>
);

const ProgressBar = ({ label, pct, val }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
       <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
       <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>{pct}</span>
    </div>
    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
       <div style={{ width: `${val}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #8b5cf6)', borderRadius: 10 }}></div>
    </div>
  </div>
);

const RankRow = ({ rank, title, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>{rank}</div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  </div>
);
