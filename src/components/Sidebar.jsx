import React from 'react';
import { Droplets, LayoutDashboard, BarChart3, Cpu, FlaskConical, Wrench, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'device', label: 'Device Status', icon: Cpu },
  { id: 'quality', label: 'Water Quality', icon: FlaskConical },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Droplets size={24} color="#fff" />
        </div>
        <div>
          <h1>Aqua Air</h1>
          <span>AWG Monitor</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        Aqua Air v1.0 &middot; Symposium Edition
      </div>
    </aside>
  );
}
