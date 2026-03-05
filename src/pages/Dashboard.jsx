import React from 'react';
import {
  Droplets, CloudRain, Thermometer, Gauge, Zap, TrendingUp,
  Wind, Activity, Brain, Lightbulb, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
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

export default function Dashboard() {
  const sim = useSimulator();

  const metrics = [
    { label: 'Water Produced Today', value: `${sim.convertVolume(sim.waterToday)} ${sim.volumeLabel}`, icon: Droplets, color: 'blue', trend: 'up', trendVal: '+12%' },
    { label: 'Total Water Generated', value: `${sim.convertVolume(sim.totalWater)} ${sim.volumeLabel}`, icon: CloudRain, color: 'cyan', trend: 'up', trendVal: '+8%' },
    { label: 'Current Humidity', value: `${sim.humidity.toFixed(1)}%`, icon: Gauge, color: 'green', trend: sim.humidity > 70 ? 'up' : 'down', trendVal: sim.humidity > 70 ? 'Optimal' : 'Low' },
    { label: 'Temperature', value: `${sim.convertTemp(sim.temperature)}${sim.tempLabel}`, icon: Thermometer, color: 'orange', trend: 'up', trendVal: 'Normal' },
    { label: 'System Efficiency', value: `${sim.efficiency.toFixed(1)}%`, icon: TrendingUp, color: 'purple', trend: sim.efficiency > 80 ? 'up' : 'down', trendVal: sim.efficiency > 80 ? 'High' : 'Moderate' },
    { label: 'Power Consumption', value: `${sim.powerWatts.toFixed(0)} W`, icon: Zap, color: 'red', trend: 'down', trendVal: `${(sim.powerWatts * 24 / 1000).toFixed(1)} kWh/day` },
  ];

  const liveData = [
    { label: 'Humidity', value: `${sim.humidity.toFixed(1)}%`, icon: Gauge },
    { label: 'Temperature', value: `${sim.convertTemp(sim.temperature)}${sim.tempLabel}`, icon: Thermometer },
    { label: 'Dew Point', value: `${sim.convertTemp(sim.dewPoint)}${sim.tempLabel}`, icon: Droplets },
    { label: 'Condenser Temp', value: `${sim.convertTemp(sim.condenserTemp)}${sim.tempLabel}`, icon: Activity },
    { label: 'Airflow Speed', value: `${sim.airflow.toFixed(1)} m/s`, icon: Wind },
    { label: 'Collection Rate', value: `${sim.waterRate.toFixed(2)} ${sim.volumeLabel}/hr`, icon: CloudRain },
  ];

  const optimalMin = 65, optimalMax = 85;
  const currentEffLevel = sim.humidity >= optimalMin && sim.humidity <= optimalMax ? 'Optimal' : 'Sub-optimal';
  const estimatedOutput = ((sim.humidity / 100) * 4.2).toFixed(1);

  return (
    <div className="animate-in">
      {/* Metric Cards */}
      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <div key={i} className={`metric-card ${m.color}`}>
            <div className="metric-card-top">
              <div className={`metric-icon ${m.color}`}>
                <m.icon size={22} />
              </div>
              <span className={`metric-trend ${m.trend}`}>
                {m.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {m.trendVal}
              </span>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Live Monitoring */}
      <div className="section-header">
        <div className="section-title">
          <Activity size={20} className="icon" />
          Live Monitoring
        </div>
        <span className="status-badge safe" style={{ animation: 'pulse-dot 2s infinite' }}>
          <span className="status-dot green" style={{ marginRight: 0 }}></span>
          Live
        </span>
      </div>

      <div className="live-grid">
        {liveData.map((item, i) => (
          <div key={i} className="live-card">
            <item.icon size={22} className="live-icon" />
            <div className="live-value">{item.value}</div>
            <div className="live-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Charts + Prediction Row */}
      <div className="grid-2">
        {/* Production Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Water Production (24 Hours)</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={sim.hourlyData}>
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A6EBD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0A6EBD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="water" stroke="#0A6EBD" fill="url(#waterGrad)" strokeWidth={2} name="Water (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right Column: Prediction + Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="prediction-card">
            <h3><Brain size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> AI Water Prediction</h3>
            <div className="prediction-value">
              {sim.convertVolume(sim.prediction)} {sim.volumeLabel}
            </div>
            <div className="prediction-sub">Estimated water production tomorrow</div>
            <div style={{ marginTop: 12, fontSize: '0.78rem', opacity: 0.7 }}>
              Based on humidity trends, temperature, and historical data
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><Lightbulb size={16} style={{ marginRight: 6, color: 'var(--warning)' }} />Environmental Insights</div>
            </div>
            <div className="insight-row">
              <div className="insight-icon"><Gauge size={16} /></div>
              <div>
                <div className="insight-label">Optimal Humidity Range</div>
                <div className="insight-value">{optimalMin}% – {optimalMax}%</div>
              </div>
            </div>
            <div className="insight-row">
              <div className="insight-icon"><TrendingUp size={16} /></div>
              <div>
                <div className="insight-label">Current Efficiency Level</div>
                <div className="insight-value">{currentEffLevel}</div>
              </div>
            </div>
            <div className="insight-row">
              <div className="insight-icon"><Droplets size={16} /></div>
              <div>
                <div className="insight-label">Estimated Output at {sim.humidity.toFixed(0)}% Humidity</div>
                <div className="insight-value">{estimatedOutput} {sim.volumeLabel}/hour</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
