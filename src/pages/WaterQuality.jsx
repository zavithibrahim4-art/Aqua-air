import React from 'react';
import {
  FlaskConical, Droplets, Activity, ShieldCheck, ShieldAlert, ShieldX
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useSimulator } from '../data/simulator';

function GaugeSVG({ value, max, label, unit, color }) {
  const pct = Math.min(value / max, 1);
  const r = 50;
  const cx = 80;
  const cy = 65;
  const arcLen = Math.PI * r;
  const filled = arcLen * pct;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <div className="gauge-container">
      <svg width="160" height="85" viewBox="0 0 160 85">
        <path d={d} fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${arcLen}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--text)">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
          {unit}
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

export default function WaterQuality() {
  const sim = useSimulator();

  const tdsStatus = sim.tds < 100 ? 'safe' : sim.tds < 150 ? 'warning' : 'danger';
  const tdsText = sim.tds < 100 ? 'Safe for drinking' : sim.tds < 150 ? 'Acceptable' : 'Unsafe – needs filtration';
  const phStatus = sim.ph >= 6.5 && sim.ph <= 7.5 ? 'safe' : sim.ph >= 6.0 && sim.ph <= 8.0 ? 'warning' : 'danger';
  const phText = phStatus === 'safe' ? 'Neutral – Optimal' : phStatus === 'warning' ? 'Slightly off-balance' : 'Out of range';
  const overallStatus = tdsStatus === 'safe' && phStatus === 'safe' ? 'safe' : tdsStatus === 'danger' || phStatus === 'danger' ? 'danger' : 'warning';
  const StatusIcon = overallStatus === 'safe' ? ShieldCheck : overallStatus === 'warning' ? ShieldAlert : ShieldX;

  const historyData = sim.hourlyData.slice(-12).map((h, i) => ({
    time: h.hour,
    tds: +(60 + Math.sin(i * 0.5) * 20 + Math.random() * 10).toFixed(1),
    ph: +(7.0 + Math.sin(i * 0.3) * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(2),
  }));

  return (
    <div className="animate-in">
      {/* Overall Status Banner */}
      <div className={`alert-banner ${overallStatus === 'safe' ? 'info' : overallStatus}`} style={{ marginBottom: 24 }}>
        <StatusIcon size={22} />
        <span className="alert-text" style={{ fontWeight: 600 }}>
          {overallStatus === 'safe' && 'Water quality is excellent — safe for consumption'}
          {overallStatus === 'warning' && 'Water quality needs attention — some parameters slightly off'}
          {overallStatus === 'danger' && 'Water quality alert — immediate filtration required'}
        </span>
        <span className={`status-badge ${overallStatus}`}>
          {overallStatus === 'safe' ? 'Safe' : overallStatus === 'warning' ? 'Warning' : 'Unsafe'}
        </span>
      </div>

      {/* Quality Gauges */}
      <div className="quality-grid">
        <div className="quality-card">
          <GaugeSVG value={sim.tds} max={300} label="Total Dissolved Solids" unit="ppm" color={tdsStatus === 'safe' ? '#00C9A7' : tdsStatus === 'warning' ? '#F39C12' : '#E74C3C'} />
          <div className="quality-value" style={{ color: tdsStatus === 'safe' ? 'var(--accent)' : tdsStatus === 'warning' ? 'var(--warning)' : 'var(--danger)' }}>
            {sim.tds.toFixed(0)} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>ppm</span>
          </div>
          <div className="quality-label">TDS Level</div>
          <div style={{ marginTop: 12 }}>
            <span className={`status-badge ${tdsStatus}`}>{tdsText}</span>
          </div>
        </div>

        <div className="quality-card">
          <GaugeSVG value={sim.ph} max={14} label="pH Level" unit="pH" color={phStatus === 'safe' ? '#0A6EBD' : phStatus === 'warning' ? '#F39C12' : '#E74C3C'} />
          <div className="quality-value" style={{ color: phStatus === 'safe' ? 'var(--primary)' : phStatus === 'warning' ? 'var(--warning)' : 'var(--danger)' }}>
            {sim.ph.toFixed(2)}
          </div>
          <div className="quality-label">pH Level</div>
          <div style={{ marginTop: 12 }}>
            <span className={`status-badge ${phStatus}`}>{phText}</span>
          </div>
        </div>

        <div className="quality-card">
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 8px',
            background: overallStatus === 'safe' ? 'var(--success-light)' : overallStatus === 'warning' ? 'var(--warning-light)' : 'var(--danger-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StatusIcon size={36} color={overallStatus === 'safe' ? '#059669' : overallStatus === 'warning' ? '#D97706' : '#E74C3C'} />
          </div>
          <div className="quality-value" style={{ color: overallStatus === 'safe' ? '#059669' : overallStatus === 'warning' ? '#D97706' : '#E74C3C' }}>
            {overallStatus === 'safe' ? 'Pure' : overallStatus === 'warning' ? 'Fair' : 'Poor'}
          </div>
          <div className="quality-label">Water Purity Status</div>
          <div style={{ marginTop: 12 }}>
            <span className={`status-badge ${overallStatus}`}>
              {overallStatus === 'safe' ? 'Safe for Drinking' : overallStatus === 'warning' ? 'Use with Caution' : 'Do Not Consume'}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Activity size={16} style={{ marginRight: 6, color: 'var(--primary)' }} /> Historical TDS & pH</div>
          <span className="card-subtitle">Last 12 readings</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="tds" tick={{ fontSize: 11 }} label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <YAxis yAxisId="ph" orientation="right" domain={[6, 8]} tick={{ fontSize: 11 }} label={{ value: 'pH', angle: 90, position: 'insideRight', fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="tds" type="monotone" dataKey="tds" stroke="#00C9A7" strokeWidth={2.5} dot={{ r: 3 }} name="TDS (ppm)" />
            <Line yAxisId="ph" type="monotone" dataKey="ph" stroke="#0A6EBD" strokeWidth={2.5} dot={{ r: 3 }} name="pH Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
