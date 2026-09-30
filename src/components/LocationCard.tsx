import { Link } from 'react-router-dom';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';

interface LocationCardProps {
  location: LocationDto;
}

const getImageUrl = (url?: string) => {
  if (!url || url === 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5086/api').replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const LocationCard = ({ location }: LocationCardProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img
        src={getImageUrl(location.imageUrl)}
        alt={location.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80';
        }}
        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
      />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: isDarkMode ? '#f8fafc' : '#1a202c' }}>
          {location.name}
        </h3>
        <p style={{
          color: isDarkMode ? '#94a3b8' : '#4a5568',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          flexGrow: 1,
          marginBottom: '1rem'
        }}>
          {location.description && location.description !== 'string' && location.description.trim() !== ''
            ? (location.description.length > 100 ? `${location.description.substring(0, 100)}...` : location.description)
            : 'Za ovu lokaciju trenutno nije unesen detaljan opis.'}
        </p>
        <Link
          to={`/locations/${location.id}`}
          style={{
            display: 'inline-block',
            textAlign: 'center',
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Detaljnije
        </Link>
      </div>
    </div>
  );
};