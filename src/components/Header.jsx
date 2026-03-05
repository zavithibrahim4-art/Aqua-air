import React, { useState, useEffect, useRef } from 'react';
import { Bell, Activity, Moon, Sun } from 'lucide-react';
import { useSimulator } from '../data/simulator';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', sub: 'Real-time AWG monitoring overview' },
  analytics: { title: 'Water Analytics', sub: 'Production trends and insights' },
  device: { title: 'Device Status', sub: 'Components, controls, and locations' },
  quality: { title: 'Water Quality', sub: 'TDS, pH, and purity monitoring' },
  maintenance: { title: 'Maintenance', sub: 'Alerts, logs, and scheduled upkeep' },
  settings: { title: 'Settings', sub: 'Preferences and calibration' },
};

export default function Header({ activePage }) {
  const { alerts, dismissAlert, systemRunning } = useSimulator();
  const [showNotif, setShowNotif] = useState(false);
  const [now, setNow] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('aqua-theme');
    return saved === 'dark';
  });
  const dropdownRef = useRef(null);

  const info = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('aqua-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <h2>{info.title}</h2>
        <p>{info.sub}</p>
      </div>

      <div className="header-right">
        <span className="header-time">
          {now.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' · '}
          {now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
        </span>

        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(prev => !prev)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="system-status-dot" title={systemRunning ? 'System Online' : 'System Offline'}
          style={{ background: systemRunning ? 'var(--accent)' : 'var(--danger)' }}
        />

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button className="notification-btn" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="notification-badge">{alerts.length}</span>
            )}
          </button>

          {showNotif && (
            <div className="notification-dropdown">
              <div className="notif-header">Notifications ({alerts.length})</div>
              {alerts.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No active notifications
                </div>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    className="notif-item"
                    onClick={() => dismissAlert(a.id)}
                    title="Click to dismiss"
                  >
                    <div
                      className="notif-dot"
                      style={{
                        background:
                          a.type === 'danger' ? 'var(--danger)' :
                          a.type === 'warning' ? 'var(--warning)' : 'var(--primary)',
                      }}
                    />
                    <div>
                      <div className="notif-text">{a.text}</div>
                      <div className="notif-time">{a.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
