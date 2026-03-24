import React from 'react';
import { Settings as SettingsIcon, User, Database, Shield, Bell, Moon, Globe } from "lucide-react";

export default function Settings({ user }) {
  return (
    <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Manage your workspace preferences and system configuration.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
        <SettingsCard icon={User} title="Account Profile" sub="Update your profile photo, business name, and email.">
           <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white' }}>
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user.email}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Work Account • Admin Access</div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Database} title="Data Persistence" sub="Configure MongoDB connection and data retention policies.">
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
            mongodb://localhost:27017/datacopilot
          </div>
        </SettingsCard>

        <SettingsCard icon={Globe} title="Regional Settings" sub="Set your default timezone and currency for analysis.">
          <div style={{ display: 'flex', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TIMEZONE</label>
              <div style={{ marginTop: 8, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8 }}>UTC +05:30 (India Standard Time)</div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CURRENCY</label>
              <div style={{ marginTop: 8, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8 }}>USD ($)</div>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

const SettingsCard = ({ icon: Icon, title, sub, children }) => (
  <div className="card" style={{ padding: 32 }}>
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>{sub}</p>
      </div>
    </div>
    {children}
  </div>
);
