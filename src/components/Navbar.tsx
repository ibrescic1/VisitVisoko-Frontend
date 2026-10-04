import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { WeatherWidget } from './WeatherWidget';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const isAdmin = (): boolean => {
    if (!token) return false;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      const role =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role ||
        payload.Role;

      return role === 'Admin';
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '0.8rem 2rem',
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{ flex: '1 1 0px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: '160px' }}>
        <Link to="/" style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0284c7', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Visit<span style={{ color: isDarkMode ? '#38bdf8' : '#0f172a' }}>Visoko</span>
        </Link>
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <WeatherWidget />
      </div>

      <div style={{
        flex: '1 1 0px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        minWidth: '280px'
      }}>
        <Link to="/" style={{ color: isDarkMode ? '#f8fafc' : '#334155', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
          Početna
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
            border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '0.4rem 0.8rem',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          {isDarkMode ? '☀️ Svijetli režim' : '🌙 Tamni režim'}
        </button>

        {token ? (
          <>
            {isAdmin() && (
              <Link 
                to="/admin" 
                style={{ 
                  color: isDarkMode ? '#38bdf8' : '#0284c7', 
                  border: isDarkMode ? '1px solid #38bdf8' : '1px solid #0284c7',
                  backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.08)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  textDecoration: 'none', 
                  fontWeight: '700', 
                  fontSize: '0.85rem', 
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚙️ Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              Odjavi se
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            border: '1px solid #0284c7',
            color: '#0284c7',
            padding: '0.4rem 0.9rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}>
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};