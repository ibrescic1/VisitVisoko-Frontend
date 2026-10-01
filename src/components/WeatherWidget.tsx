import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

const getWeatherInfo = (code: number) => {
  if (code === 0) return { condition: 'Vedro', icon: '☀️' };
  if (code >= 1 && code <= 3) return { condition: 'Oblačno', icon: '⛅' };
  if (code === 45 || code === 48) return { condition: 'Magla', icon: '🌫️' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { condition: 'Kiša', icon: '🌧️' };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { condition: 'Snijeg', icon: '❄️' };
  if (code >= 95) return { condition: 'Grmljavina', icon: '🌩️' };
  return { condition: 'Sunčano', icon: '🌤️' };
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.9878&longitude=18.1783&current_weather=true')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current_weather) {
          const { condition, icon } = getWeatherInfo(data.current_weather.weathercode);
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            windSpeed: Math.round(data.current_weather.windspeed),
            condition,
            icon
          });
        }
      })
      .catch((err) => console.error('Greška pri dohvaćanju prognoze:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        fontSize: '0.85rem',
        color: '#94a3b8',
        padding: '0.3rem 0.75rem',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '20px'
      }}>
        ☀️ Učitavanje prognoze...
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
      border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
      padding: '0.35rem 0.85rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      whiteSpace: 'nowrap'
    }}>
      <span>{weather.icon} <strong>{weather.temp}°C</strong></span>
      <span style={{ color: isDarkMode ? '#64748b' : '#cbd5e1' }}>|</span>
      <span>{weather.condition}</span>
      <span style={{ color: isDarkMode ? '#64748b' : '#cbd5e1' }}>|</span>
      <span style={{ fontSize: '0.8rem', color: isDarkMode ? '#38bdf8' : '#2563eb' }}>
        💨 {weather.windSpeed} km/h
      </span>
    </div>
  );
};