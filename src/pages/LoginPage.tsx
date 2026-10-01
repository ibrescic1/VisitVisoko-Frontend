import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
      //alert('Uspješna prijava!');
      navigate('/admin'); 
    } catch (err) {
      console.error(err);
      setError('Neispravno korisničko ime ili lozinka.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: isDarkMode ? '#f8fafc' : '#0f172a'
        }}>
          Admin Prijava
        </h2>
        
        {error && (
          <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: '500',
              color: isDarkMode ? '#cbd5e1' : '#475569'
            }}>
              Korisničko ime
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '6px',
                border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: '500',
              color: isDarkMode ? '#cbd5e1' : '#475569'
            }}>
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '6px',
                border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Prijava...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
};