import React, { useState } from 'react';
import {
  Wrench, AlertTriangle, AlertCircle, Info, X, CheckCircle2,
  Clock, Filter, ChevronDown
} from 'lucide-react';
import { useSimulator } from '../data/simulator';

export default function Maintenance() {
  const sim = useSimulator();
  const [dismissedBanners, setDismissedBanners] = useState([]);

  const dangerAlerts = sim.alerts.filter(a => a.type === 'danger');
  const warningAlerts = sim.alerts.filter(a => a.type === 'warning');
  const infoAlerts = sim.alerts.filter(a => a.type === 'info');

  const AlertIcon = ({ type }) => {
    if (type === 'danger') return <AlertCircle size={18} />;
    if (type === 'warning') return <AlertTriangle size={18} />;
    return <Info size={18} />;
  };

  const activeBanners = [...dangerAlerts, ...warningAlerts]
    .filter(a => !dismissedBanners.includes(a.id))
    .slice(0, 3);

  const severityBadge = (severity) => {
    const styles = {
      critical: { bg: 'var(--danger-light)', color: 'var(--danger)', label: 'Critical' },
      important: { bg: 'var(--warning-light)', color: 'var(--warning)', label: 'Important' },
      routine: { bg: 'var(--success-light)', color: '#059669', label: 'Routine' },
    };
    const s = styles[severity] || styles.routine;
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="animate-in">
      {/* Warning Banners */}
      {activeBanners.map(alert => (
        <div key={alert.id} className={`alert-banner ${alert.type}`}>
          <AlertIcon type={alert.type} />
          <span className="alert-text">{alert.text}</span>
          <button className="alert-dismiss" onClick={() => setDismissedBanners(prev => [...prev, alert.id])}>
            <X size={16} />
          </button>
        </div>
      ))}

      <div className="grid-2" style={{ marginTop: activeBanners.length ? 12 : 0 }}>
        {/* Active Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={16} style={{ marginRight: 6, color: 'var(--warning)' }} />
              Active Alerts ({sim.alerts.length})
            </div>
          </div>

          {sim.alerts.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={48} className="empty-icon" style={{ color: 'var(--accent)' }} />
              <p>No active alerts — system running smoothly</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sim.alerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onClick={() => sim.dismissAlert(alert.id)}
                  title="Click to dismiss"
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: alert.type === 'danger' ? 'var(--danger-light)' : alert.type === 'warning' ? 'var(--warning-light)' : 'rgba(10,110,189,0.08)',
                    color: alert.type === 'danger' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--primary)',
                  }}>
                    <AlertIcon type={alert.type} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>
                      {alert.text}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Wrench size={16} style={{ marginRight: 6, color: 'var(--primary)' }} />
              Maintenance Summary
            </div>
          </div>

          <div className="insight-row">
            <div className="insight-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <AlertCircle size={16} />
            </div>
            <div>
              <div className="insight-label">Critical Alerts</div>
              <div className="insight-value">{dangerAlerts.length}</div>
            </div>
          </div>
          <div className="insight-row">
            <div className="insight-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <div className="insight-label">Warnings</div>
              <div className="insight-value">{warningAlerts.length}</div>
            </div>
          </div>
          <div className="insight-row">
            <div className="insight-icon" style={{ background: 'rgba(10,110,189,0.08)', color: 'var(--primary)' }}>
              <Info size={16} />
            </div>
            <div>
              <div className="insight-label">Informational</div>
              <div className="insight-value">{infoAlerts.length}</div>
            </div>
          </div>
          <div className="insight-row">
            <div className="insight-icon" style={{ background: 'var(--success-light)', color: '#059669' }}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="insight-label">Last Full Service</div>
              <div className="insight-value">Feb 20, 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Log Table */}
      <div className="card" style={{ marginTop: 4 }}>
        <div className="card-header">
          <div className="card-title">
            <Clock size={16} style={{ marginRight: 6, color: 'var(--primary)' }} />
            Maintenance Log
          </div>
          <span className="card-subtitle">{sim.maintenanceLog.length} records</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sim.maintenanceLog.map((log, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{log.date}</td>
                  <td>{log.action}</td>
                  <td>{severityBadge(log.severity)}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#059669', fontWeight: 500 }}>
                      <CheckCircle2 size={14} /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
