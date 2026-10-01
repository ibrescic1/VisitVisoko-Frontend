import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { WeatherWidget } from './WeatherWidget';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Uspješno ste se odjavili!');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.8rem 3rem',
      backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
      borderBottom: isDarkMode ? '1px solid #334155' : 'none',
      color: '#fff',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Link to="/" style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
        VisitVisoko
      </Link>

      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <WeatherWidget />
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>
          Početna
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #475569',
            borderRadius: '20px',
            padding: '0.4rem 0.8rem',
            color: '#f8fafc',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {isDarkMode ? '☀️ Svijetli režim' : '🌙 Tamni režim'}
        </button>

        {token ? (
          <>
            <Link to="/admin" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#d32e2e',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Odjavi se 
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            padding: '0.4rem 0.9rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}>
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};