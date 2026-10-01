import { Link } from 'react-router-dom';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';

interface LocationCardProps {
  location: LocationDto;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
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

export const LocationCard = ({ location, isFavorite, onToggleFavorite }: LocationCardProps) => {
  const { isDarkMode } = useTheme();

  const rawTitle = location.title || (location as any).title;
  const hasValidTitle = rawTitle && rawTitle !== 'string' && rawTitle.trim() !== '';
  const hasValidDesc = location.description && location.description !== 'string' && location.description.trim() !== '';

  const displayTitle = hasValidTitle
    ? rawTitle
    : hasValidDesc
    ? location.description
    : 'Lokacija Visoko';

  const displayDescription = hasValidTitle && hasValidDesc
    ? location.description
    : 'Otkrijte više detalja i lokaciju na mapi za ovu turističku atrakciju.';

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(location.id);
        }}
        title={isFavorite ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '1.2rem',
          backdropFilter: 'blur(4px)',
          zIndex: 2
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <img
        src={getImageUrl(location.imageUrl)}
        alt={displayTitle}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80';
        }}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
            {displayTitle}
          </h3>
          {location.categoryName && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.2rem 0.55rem',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
              color: isDarkMode ? '#38bdf8' : '#2563eb',
              whiteSpace: 'nowrap'
            }}>
              {location.categoryName}
            </span>
          )}
        </div>

        <p style={{
          fontSize: '0.9rem',
          color: isDarkMode ? '#cbd5e1' : '#64748b',
          lineHeight: '1.5',
          marginBottom: '1.25rem',
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {displayDescription}
        </p>

        <Link
          to={`/locations/${location.id}`}
          style={{
            textAlign: 'center',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          Saznaj više →
        </Link>
      </div>
    </div>
  );
};