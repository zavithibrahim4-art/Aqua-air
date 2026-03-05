import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Droplets } from 'lucide-react';
import { useSimulator } from '../data/simulator';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-value" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const sim = useSimulator();
  const [activeTab, setActiveTab] = useState('hourly');

  const scatterData = sim.hourlyData.map(h => ({
    humidity: +h.humidity,
    water: +h.water,
  }));

  return (
    <div className="animate-in">
      <div className="tabs">
        {[
          { id: 'hourly', label: 'Hourly', icon: BarChart3 },
          { id: 'daily', label: 'Daily', icon: TrendingUp },
          { id: 'monthly', label: 'Monthly', icon: Calendar },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            {activeTab === 'hourly' && 'Hourly Water Production'}
            {activeTab === 'daily' && 'Daily Water Production'}
            {activeTab === 'monthly' && 'Monthly Water Generation'}
          </div>
          <span className="card-subtitle">
            {activeTab === 'hourly' && 'Last 24 hours'}
            {activeTab === 'daily' && 'Last 7 days'}
            {activeTab === 'monthly' && 'Last 6 months'}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          {activeTab === 'hourly' ? (
            <BarChart data={sim.hourlyData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A6EBD" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#5EB7E8" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="water" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name={`Water (${sim.volumeLabel})`} />
            </BarChart>
          ) : activeTab === 'daily' ? (
            <AreaChart data={sim.dailyData}>
              <defs>
                <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="water" stroke="#00C9A7" fill="url(#dailyGrad)" strokeWidth={2.5} name={`Water (${sim.volumeLabel})`} />
              <Line type="monotone" dataKey="humidity" stroke="#F39C12" strokeWidth={2} dot={false} name="Humidity (%)" />
            </AreaChart>
          ) : (
            <BarChart data={sim.monthlyData}>
              <defs>
                <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8E44AD" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#BB8FCE" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="water" fill="url(#monthGrad)" radius={[6, 6, 0, 0]} name={`Water (${sim.volumeLabel})`} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Humidity vs Water Output */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Droplets size={16} style={{ marginRight: 6, color: 'var(--primary)' }} />
              Humidity vs Water Output
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="humidity" name="Humidity" unit="%" tick={{ fontSize: 11 }} label={{ value: 'Humidity (%)', position: 'bottom', fontSize: 12 }} />
              <YAxis dataKey="water" name="Water" unit="L" tick={{ fontSize: 11 }} label={{ value: 'Water (L)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter data={scatterData} fill="#0A6EBD" fillOpacity={0.7} name="Data Point" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Production Summary</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div className="insight-row">
              <div className="insight-icon"><Droplets size={16} /></div>
              <div>
                <div className="insight-label">Today's Production</div>
                <div className="insight-value">{sim.convertVolume(sim.waterToday)} {sim.volumeLabel}</div>
              </div>
            </div>
            <div className="insight-row">
              <div className="insight-icon"><TrendingUp size={16} /></div>
              <div>
                <div className="insight-label">Average Daily Output (7 days)</div>
                <div className="insight-value">
                  {sim.convertVolume(sim.dailyData.reduce((s, d) => s + d.water, 0) / sim.dailyData.length)} {sim.volumeLabel}
                </div>
              </div>
            </div>
            <div className="insight-row">
              <div className="insight-icon"><BarChart3 size={16} /></div>
              <div>
                <div className="insight-label">Peak Hourly Production</div>
                <div className="insight-value">
                  {sim.convertVolume(Math.max(...sim.hourlyData.map(h => h.water)))} {sim.volumeLabel}
                </div>
              </div>
            </div>
            <div className="insight-row">
              <div className="insight-icon" style={{ background: 'rgba(0,201,167,0.1)', color: 'var(--accent)' }}>
                <Calendar size={16} />
              </div>
              <div>
                <div className="insight-label">Best Month This Period</div>
                <div className="insight-value">
                  {sim.monthlyData.reduce((best, m) => m.water > best.water ? m : best, sim.monthlyData[0]).month} – {sim.convertVolume(Math.max(...sim.monthlyData.map(m => m.water)))} {sim.volumeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
