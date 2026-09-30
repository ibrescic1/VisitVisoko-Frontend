import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 3rem',
      backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
      borderBottom: isDarkMode ? '1px solid #334155' : 'none',
      color: '#fff',
      width: '100%'
    }}>
      <Link to="/" style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
        VisitVisoko
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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
            fontSize: '0.9rem'
          }}
        >
          {isDarkMode ? '☀️ Svijetli režim' : '🌙 Tamni režim'}
        </button>

        <Link to="/login" style={{
          border: '1px solid #38bdf8',
          color: '#38bdf8',
          padding: '0.4rem 0.9rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Admin Login
        </Link>
      </div>
    </nav>
  );
};