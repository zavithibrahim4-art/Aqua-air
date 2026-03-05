import React, { useState } from 'react';
import { SimulatorProvider } from './data/simulator';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DeviceStatus from './pages/DeviceStatus';
import WaterQuality from './pages/WaterQuality';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';

const PAGES = {
  dashboard: Dashboard,
  analytics: Analytics,
  device: DeviceStatus,
  quality: WaterQuality,
  maintenance: Maintenance,
  settings: Settings,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <SimulatorProvider>
      <div className="app-layout">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="main-content">
          <Header activePage={activePage} />
          <div className="page-wrapper">
            <PageComponent />
          </div>
        </main>
      </div>
    </SimulatorProvider>
  );
}
