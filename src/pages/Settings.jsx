import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Droplets, Thermometer, Bell, Sliders, Save
} from 'lucide-react';
import { useSimulator } from '../data/simulator';

export default function Settings() {
  const { settings, setSettings } = useSimulator();
  const [humidityOffset, setHumidityOffset] = useState(0);
  const [tempOffset, setTempOffset] = useState(0);
  const [tdsFactor, setTdsFactor] = useState(1.0);

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="animate-in">
      <div className="grid-2">
        <div>
          {/* Unit Preferences */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="settings-group">
              <h3><Droplets size={18} /> Volume Unit</h3>
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-name">Water measurement unit</div>
                  <div className="setting-desc">Applies to all water volume displays</div>
                </div>
                <div className="radio-group">
                  <button
                    className={`radio-btn ${settings.volumeUnit === 'liters' ? 'active' : ''}`}
                    onClick={() => update('volumeUnit', 'liters')}
                  >
                    Liters
                  </button>
                  <button
                    className={`radio-btn ${settings.volumeUnit === 'gallons' ? 'active' : ''}`}
                    onClick={() => update('volumeUnit', 'gallons')}
                  >
                    Gallons
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-group">
              <h3><Thermometer size={18} /> Temperature Unit</h3>
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-name">Temperature display format</div>
                  <div className="setting-desc">Applies to all temperature readings</div>
                </div>
                <div className="radio-group">
                  <button
                    className={`radio-btn ${settings.tempUnit === 'celsius' ? 'active' : ''}`}
                    onClick={() => update('tempUnit', 'celsius')}
                  >
                    °C
                  </button>
                  <button
                    className={`radio-btn ${settings.tempUnit === 'fahrenheit' ? 'active' : ''}`}
                    onClick={() => update('tempUnit', 'fahrenheit')}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <div className="settings-group">
              <h3><Bell size={18} /> Notification Preferences</h3>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-name">Maintenance reminders</div>
                  <div className="setting-desc">Get notified about scheduled maintenance</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifMaintenance}
                    onChange={e => update('notifMaintenance', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-name">System alerts</div>
                  <div className="setting-desc">Critical alerts like overheating or malfunctions</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifAlerts}
                    onChange={e => update('notifAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-name">Performance reports</div>
                  <div className="setting-desc">Daily efficiency and production summaries</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifPerformance}
                    onChange={e => update('notifPerformance', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calibration */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="settings-group">
              <h3><Sliders size={18} /> Device Calibration</h3>

              <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div className="setting-info">
                  <div className="setting-name">Humidity sensor offset</div>
                  <div className="setting-desc">Fine-tune the humidity sensor reading (±5%)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range" min="-5" max="5" value={humidityOffset} step="0.5"
                    onChange={e => setHumidityOffset(+e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span className="control-value">{humidityOffset > 0 ? '+' : ''}{humidityOffset}%</span>
                </div>
              </div>

              <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div className="setting-info">
                  <div className="setting-name">Temperature sensor offset</div>
                  <div className="setting-desc">Fine-tune the temperature reading (±3°)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range" min="-3" max="3" value={tempOffset} step="0.5"
                    onChange={e => setTempOffset(+e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span className="control-value">{tempOffset > 0 ? '+' : ''}{tempOffset}°</span>
                </div>
              </div>

              <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div className="setting-info">
                  <div className="setting-name">TDS sensor calibration factor</div>
                  <div className="setting-desc">Adjust TDS multiplier for accuracy</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range" min="0.8" max="1.2" value={tdsFactor} step="0.01"
                    onChange={e => setTdsFactor(+e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span className="control-value">{tdsFactor.toFixed(2)}×</span>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card">
            <div className="settings-group" style={{ marginBottom: 0 }}>
              <h3><SettingsIcon size={18} /> About</h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <div><strong>Application:</strong> Aqua Air Monitor v1.0</div>
                <div><strong>Purpose:</strong> AWG Monitoring Dashboard</div>
                <div><strong>Edition:</strong> Symposium Prototype</div>
                <div><strong>Data Mode:</strong> Simulated (5s interval)</div>
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                  This dashboard uses simulated sensor data for demonstration purposes. In a production deployment, it would connect to real ESP32/Arduino hardware via MQTT or WebSocket.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
