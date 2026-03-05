import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SimulatorContext = createContext(null);

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => min + Math.random() * (max - min);
const drift = (current, min, max, maxDelta) => {
  const delta = (Math.random() - 0.5) * 2 * maxDelta;
  return clamp(current + delta, min, max);
};

const DEVICE_LOCATIONS = [
  { id: 1, name: 'Lab A – Jakarta', lat: -6.2088, lng: 106.8456, baseHumidity: 78 },
  { id: 2, name: 'Field Unit – Bandung', lat: -6.9175, lng: 107.6191, baseHumidity: 72 },
  { id: 3, name: 'Coastal – Semarang', lat: -6.9666, lng: 110.4196, baseHumidity: 82 },
  { id: 4, name: 'Highland – Malang', lat: -7.9666, lng: 112.6326, baseHumidity: 68 },
];

function generateInitialHistory(count, genFn) {
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(genFn(i));
  return arr;
}

const ALERTS_POOL = [
  { id: 1, type: 'warning', text: 'Filter replacement recommended – 89% usage', time: '12 min ago' },
  { id: 2, type: 'danger', text: 'Compressor temperature elevated (82°C)', time: '25 min ago' },
  { id: 3, type: 'info', text: 'System maintenance scheduled for tomorrow 06:00', time: '1 hr ago' },
  { id: 4, type: 'warning', text: 'Low humidity detected – water output may decrease', time: '2 hr ago' },
  { id: 5, type: 'info', text: 'Water tank at 78% capacity', time: '3 hr ago' },
  { id: 6, type: 'warning', text: 'UV purifier lamp nearing end of life (820 hrs)', time: '5 hr ago' },
  { id: 7, type: 'danger', text: 'Tank full – drain or redistribute water', time: '6 hr ago' },
];

const MAINTENANCE_LOG = [
  { date: '2026-03-05', action: 'Air filter cleaned', status: 'Completed', severity: 'routine' },
  { date: '2026-03-03', action: 'Condensation coil inspection', status: 'Completed', severity: 'routine' },
  { date: '2026-03-01', action: 'UV lamp replacement', status: 'Completed', severity: 'important' },
  { date: '2026-02-27', action: 'Compressor coolant refill', status: 'Completed', severity: 'important' },
  { date: '2026-02-25', action: 'Water tank sanitization', status: 'Completed', severity: 'routine' },
  { date: '2026-02-20', action: 'Full system diagnostic', status: 'Completed', severity: 'critical' },
  { date: '2026-02-18', action: 'TDS sensor calibration', status: 'Completed', severity: 'routine' },
  { date: '2026-02-15', action: 'Fan motor lubrication', status: 'Completed', severity: 'routine' },
];

function createInitialState() {
  const humidity = rand(65, 80);
  const temperature = rand(26, 32);
  const dewPoint = temperature - ((100 - humidity) / 5);
  const condenserTemp = rand(8, 15);
  const airflow = rand(1.8, 3.2);
  const waterRate = (humidity / 100) * rand(0.3, 0.6);
  const tds = rand(60, 95);
  const ph = rand(6.9, 7.3);
  const tankLevel = rand(40, 80);
  const powerWatts = rand(280, 420);
  const totalWater = rand(420, 680);
  const waterToday = rand(8, 18);
  const efficiency = rand(72, 92);

  const hourlyData = generateInitialHistory(24, (i) => ({
    hour: `${String(i).padStart(2,'0')}:00`,
    water: +(rand(0.3, 1.2)).toFixed(2),
    humidity: +(rand(55, 85)).toFixed(0),
  }));

  const dailyData = generateInitialHistory(7, (i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      water: +(rand(8, 22)).toFixed(1),
      humidity: +(rand(60, 82)).toFixed(0),
    };
  });

  const monthlyData = generateInitialHistory(6, (i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleDateString('en', { month: 'short' }),
      water: +(rand(200, 550)).toFixed(0),
    };
  });

  const locationData = DEVICE_LOCATIONS.map(loc => ({
    ...loc,
    water: +(rand(5, 18)).toFixed(1),
    humidity: +(loc.baseHumidity + rand(-5, 5)).toFixed(0),
    status: 'online',
  }));

  return {
    humidity,
    temperature,
    dewPoint,
    condenserTemp,
    airflow,
    waterRate,
    tds,
    ph,
    tankLevel,
    powerWatts,
    totalWater,
    waterToday,
    efficiency,
    hourlyData,
    dailyData,
    monthlyData,
    locationData,
    systemRunning: true,
    targetHumidity: 70,
    coolingLevel: 65,
    fan: 'Running',
    compressor: 'Active',
    condenser: 'Cooling – Level 3',
    uvPurifier: 'Active',
    alerts: ALERTS_POOL,
    maintenanceLog: MAINTENANCE_LOG,
  };
}

export function SimulatorProvider({ children }) {
  const [data, setData] = useState(createInitialState);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aqua-air-settings');
      return saved ? JSON.parse(saved) : {
        volumeUnit: 'liters',
        tempUnit: 'celsius',
        notifMaintenance: true,
        notifAlerts: true,
        notifPerformance: true,
      };
    } catch { return { volumeUnit: 'liters', tempUnit: 'celsius', notifMaintenance: true, notifAlerts: true, notifPerformance: true }; }
  });

  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    localStorage.setItem('aqua-air-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        if (!prev.systemRunning) return prev;

        const humidity = drift(prev.humidity, 55, 88, 1.5);
        const temperature = drift(prev.temperature, 22, 36, 0.4);
        const dewPoint = temperature - ((100 - humidity) / 5);
        const condenserTemp = drift(prev.condenserTemp, 6, 18, 0.5);
        const airflow = drift(prev.airflow, 1.2, 3.8, 0.15);
        const waterRate = (humidity / 100) * rand(0.25, 0.55);
        const tds = drift(prev.tds, 45, 130, 2);
        const ph = drift(prev.ph, 6.7, 7.6, 0.05);
        const tankLevel = clamp(prev.tankLevel + rand(-0.5, 0.8), 10, 98);
        const powerWatts = drift(prev.powerWatts, 250, 480, 10);
        const waterToday = prev.waterToday + waterRate * (5 / 3600);
        const totalWater = prev.totalWater + waterRate * (5 / 3600);
        const efficiency = clamp(drift(prev.efficiency, 65, 96, 1), 0, 100);

        const newHourly = [...prev.hourlyData];
        const lastIdx = newHourly.length - 1;
        newHourly[lastIdx] = { ...newHourly[lastIdx], water: +(newHourly[lastIdx].water + waterRate * 0.01).toFixed(2), humidity: +humidity.toFixed(0) };

        const locationData = prev.locationData.map(loc => ({
          ...loc,
          water: +(loc.water + rand(0, 0.05)).toFixed(1),
          humidity: drift(+loc.humidity, 55, 90, 1),
        }));

        const compressorStatuses = ['Active', 'Active', 'Active', 'Idle'];
        const fanStatuses = ['Running', 'Running', 'Running', 'Off'];

        return {
          ...prev,
          humidity, temperature, dewPoint, condenserTemp, airflow, waterRate,
          tds, ph, tankLevel, powerWatts, waterToday, totalWater, efficiency,
          hourlyData: newHourly,
          locationData,
          fan: fanStatuses[Math.floor(Math.random() * fanStatuses.length)],
          compressor: compressorStatuses[Math.floor(Math.random() * compressorStatuses.length)],
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleSystem = useCallback(() => {
    setData(prev => ({ ...prev, systemRunning: !prev.systemRunning }));
  }, []);

  const setTargetHumidity = useCallback((val) => {
    setData(prev => ({ ...prev, targetHumidity: val }));
  }, []);

  const setCoolingLevel = useCallback((val) => {
    setData(prev => ({ ...prev, coolingLevel: val }));
  }, []);

  const dismissAlert = useCallback((id) => {
    setData(prev => ({ ...prev, alerts: prev.alerts.filter(a => a.id !== id) }));
  }, []);

  const prediction = (() => {
    const d = dataRef.current;
    const avgHumidity = d.hourlyData.slice(-6).reduce((s, h) => s + (+h.humidity), 0) / 6;
    const factor = avgHumidity / 100;
    return +(factor * rand(4.5, 7.2)).toFixed(1);
  })();

  const convertVolume = useCallback((liters) => {
    if (settings.volumeUnit === 'gallons') return +(liters * 0.264172).toFixed(2);
    return +liters.toFixed(2);
  }, [settings.volumeUnit]);

  const convertTemp = useCallback((celsius) => {
    if (settings.tempUnit === 'fahrenheit') return +((celsius * 9/5) + 32).toFixed(1);
    return +celsius.toFixed(1);
  }, [settings.tempUnit]);

  const volumeLabel = settings.volumeUnit === 'gallons' ? 'gal' : 'L';
  const tempLabel = settings.tempUnit === 'fahrenheit' ? '°F' : '°C';

  const value = {
    ...data,
    prediction,
    settings,
    setSettings,
    toggleSystem,
    setTargetHumidity,
    setCoolingLevel,
    dismissAlert,
    convertVolume,
    convertTemp,
    volumeLabel,
    tempLabel,
  };

  return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider');
  return ctx;
}
