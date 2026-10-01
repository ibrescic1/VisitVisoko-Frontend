import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationById } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';
import { ReviewForm } from '../components/ReviewForm';

const getImageUrl = (url?: string) => {
  if (!url || url === 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5086/api').replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const LocationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (id) {
      getLocationById(Number(id))
        .then((data) => setLocation(data))
        .catch((err) => {
          console.error(err);
          setError('Greška pri učitavanju detalja o lokaciji.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        paddingTop: '3rem',
        textAlign: 'center'
      }}>
        Učitavanje detalja...
      </div>
    );
  }

  if (error || !location) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        color: '#ef4444',
        paddingTop: '3rem',
        textAlign: 'center'
      }}>
        {error || 'Lokacija nije pronađena.'}
      </div>
    );
  }

  const locationTitle = location.name || (location as any).name || 'Detalji lokacije';

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      padding: '2.5rem 3rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            color: isDarkMode ? '#38bdf8' : '#2563eb',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}
        >
          ← Nazad na sve lokacije
        </Link>

        <div style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <img
            src={getImageUrl(location.imageUrl)}
            alt={locationTitle}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80';
            }}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
          />
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h1 style={{
                fontSize: '2.25rem',
                margin: 0,
                color: isDarkMode ? '#f8fafc' : '#0f172a'
              }}>
                {locationTitle}
              </h1>

              {location.categoryName && (
                <span style={{
                  backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                  color: isDarkMode ? '#38bdf8' : '#2563eb',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {location.categoryName}
                </span>
              )}
            </div>

            <p style={{
              color: isDarkMode ? '#cbd5e1' : '#334155',
              fontSize: '1.1rem',
              lineHeight: '1.7',
              whiteSpace: 'pre-line'
            }}>
              {location.description && location.description !== 'string' && location.description.trim() !== ''
                ? location.description
                : 'Za ovu lokaciju trenutno nije unesen detaljan opis.'}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
            Lokacija na mapi
          </h2>
          
          {location.address && (
            <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '1rem' }}>
              📍 Adresa: {location.address}
            </p>
          )}

          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            height: '350px',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
          }}>
            <iframe
              title={`Karta za ${locationTitle}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${location.latitude || 43.9878},${location.longitude || 18.1783}&z=15&output=embed`}
            ></iframe>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude || 43.9878},${location.longitude || 18.1783}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: isDarkMode ? '#38bdf8' : '#2563eb',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Otvori navigaciju u Google Maps ↗
            </a>


<div style={{
  marginTop: '3rem',
  padding: '2rem',
  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
  borderRadius: '12px',
  border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
}}>
  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
    Recenzije i Utisci
  </h2>

  <ReviewForm locationId={location.id} />
</div>
          </div>
        </div>
      </div>
    </div>
  );
};