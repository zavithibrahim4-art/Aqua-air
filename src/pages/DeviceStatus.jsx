import React from 'react';
import {
  Fan, Thermometer, Snowflake, Sun, Droplets,
  Power, PowerOff, MapPin, Cpu
} from 'lucide-react';
import { useSimulator } from '../data/simulator';

function StatusDot({ status }) {
  const color = status === 'Running' || status === 'Active' ? 'green'
    : status === 'Idle' || status === 'Off' ? 'yellow'
    : 'green';
  return <span className={`status-dot ${color}`}></span>;
}

export default function DeviceStatus() {
  const sim = useSimulator();

  const components = [
    { name: 'Fan', status: sim.fan, icon: Fan, color: sim.fan === 'Running' ? '#0A6EBD' : '#F39C12' },
    { name: 'Compressor', status: sim.compressor, icon: Cpu, color: sim.compressor === 'Active' ? '#00C9A7' : '#F39C12' },
    { name: 'Condenser', status: sim.condenser, icon: Snowflake, color: '#5EB7E8' },
    { name: 'UV Purifier', status: sim.uvPurifier, icon: Sun, color: '#8E44AD' },
    { name: 'Water Tank', status: `${sim.tankLevel.toFixed(0)}% Full`, icon: Droplets, color: sim.tankLevel > 80 ? '#F39C12' : '#00C9A7' },
  ];

  const tankColor = sim.tankLevel > 85 ? 'var(--warning)' : sim.tankLevel > 50 ? 'var(--accent)' : 'var(--primary)';

  return (
    <div className="animate-in">
      {/* Device Components */}
      <div className="section-header">
        <div className="section-title"><Cpu size={20} className="icon" /> System Components</div>
        <span className={`status-badge ${sim.systemRunning ? 'safe' : 'danger'}`}>
          {sim.systemRunning ? 'System Online' : 'System Offline'}
        </span>
      </div>

      <div className="device-grid">
        {components.map((c, i) => (
          <div key={i} className="device-card">
            <div className="device-icon" style={{ background: `${c.color}15`, color: c.color }}>
              <c.icon size={24} />
            </div>
            <div className="device-name">{c.name}</div>
            <div className="device-status">
              <StatusDot status={c.status} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Control Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Power size={16} style={{ marginRight: 6, color: 'var(--primary)' }} />
              Control Panel
            </div>
          </div>

          <div className="control-row">
            <div>
              <div className="control-label">System Power</div>
              <div className="control-sublabel">Start or stop the AWG system</div>
            </div>
            <button
              className={`btn ${sim.systemRunning ? 'btn-danger' : 'btn-primary'} btn-sm`}
              onClick={sim.toggleSystem}
            >
              {sim.systemRunning ? <><PowerOff size={14} /> Stop</> : <><Power size={14} /> Start</>}
            </button>
          </div>

          <div className="control-row">
            <div>
              <div className="control-label">Target Humidity</div>
              <div className="control-sublabel">Set the desired collection threshold</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180 }}>
              <input
                type="range"
                min="40"
                max="90"
                value={sim.targetHumidity}
                onChange={e => sim.setTargetHumidity(+e.target.value)}
                style={{ flex: 1 }}
              />
              <span className="control-value">{sim.targetHumidity}%</span>
            </div>
          </div>

          <div className="control-row">
            <div>
              <div className="control-label">Cooling Level</div>
              <div className="control-sublabel">Adjust condenser cooling intensity</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180 }}>
              <input
                type="range"
                min="0"
                max="100"
                value={sim.coolingLevel}
                onChange={e => sim.setCoolingLevel(+e.target.value)}
                style={{ flex: 1 }}
              />
              <span className="control-value">{sim.coolingLevel}%</span>
            </div>
          </div>
        </div>

        {/* Water Tank Visual */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-title" style={{ marginBottom: 20 }}>Water Tank Level</div>
          <div style={{
            width: 140,
            height: 200,
            borderRadius: '12px 12px 24px 24px',
            border: `3px solid ${tankColor}`,
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg)',
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${sim.tankLevel}%`,
              background: `linear-gradient(to top, ${tankColor}, ${tankColor}88)`,
              transition: 'height 1s ease',
              borderRadius: '0 0 20px 20px',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 1,
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: sim.tankLevel > 50 ? '#fff' : 'var(--text)' }}>
                {sim.tankLevel.toFixed(0)}%
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: sim.tankLevel > 50 ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
                Tank Level
              </span>
            </div>
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span className={`status-badge ${sim.tankLevel > 85 ? 'warning' : 'safe'}`}>
              {sim.tankLevel > 85 ? 'Nearly Full' : sim.tankLevel > 50 ? 'Good Level' : 'Low Level'}
            </span>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="card" style={{ marginTop: 4 }}>
        <div className="card-header">
          <div className="card-title"><MapPin size={16} style={{ marginRight: 6, color: 'var(--primary)' }} /> Device Locations</div>
          <span className="card-subtitle">{sim.locationData.length} devices deployed</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {sim.locationData.map(loc => (
            <div key={loc.id} style={{
              padding: 16,
              background: 'var(--bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <MapPin size={14} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{loc.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>💧 {loc.water} {sim.volumeLabel}/day</span>
                <span>💨 {loc.humidity}%</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="status-badge safe" style={{ fontSize: '0.72rem' }}>
                  <span className="status-dot green" style={{ marginRight: 0 }}></span>
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
