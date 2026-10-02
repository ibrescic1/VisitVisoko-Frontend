import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationById } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';
import { ReviewForm } from '../components/ReviewForm';

const checkIsAdmin = (): boolean => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const payloadBase64 = token.split('.')[1];

    if (!payloadBase64) {
      return false;
    }

    const base64 = payloadBase64
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );

    const decodedJson = atob(paddedBase64);
    const payload = JSON.parse(decodedJson);

    const role =
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ||
      payload.role ||
      payload.Role;

    if (Array.isArray(role)) {
      return role.includes('Admin');
    }

    return role === 'Admin';
  } catch (error) {
    console.error('Greška pri čitanju JWT tokena:', error);
    return false;
  }
};

const getImageUrl = (url?: string) => {
  const fallbackImage =
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80';

  if (!url || url === 'string' || url.trim() === '') {
    return fallbackImage;
  }

  let cleanUrl = url.trim().replace(/\\/g, '/');

  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://')
  ) {
    return cleanUrl;
  }

  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(cleanUrl)) {
    cleanUrl += '.jpg';
  }

  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5086/api'
  ).replace(/\/api\/?$/, '');

  return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

export const LocationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [location, setLocation] = useState<LocationDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isDarkMode } = useTheme();

  const isAdmin = checkIsAdmin();

  useEffect(() => {
    if (!id) {
      setError('Neispravan ID lokacije.');
      setLoading(false);
      return;
    }

    const locationId = Number(id);

    if (Number.isNaN(locationId)) {
      setError('Neispravan ID lokacije.');
      setLoading(false);
      return;
    }

    getLocationById(locationId)
      .then((data) => {
        setLocation(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Greška pri učitavanju detalja o lokaciji.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          paddingTop: '3rem',
          textAlign: 'center',
        }}
      >
        Učitavanje detalja...
      </div>
    );
  }

  if (error || !location) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          color: '#ef4444',
          paddingTop: '3rem',
          textAlign: 'center',
        }}
      >
        {error || 'Lokacija nije pronađena.'}
      </div>
    );
  }

  const locationTitle =
    location.title ||
    (location as any).name ||
    'Detalji lokacije';

  const latitude = location.latitude || 43.9878;
  const longitude = location.longitude || 18.1783;

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        padding: '2.5rem 3rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            style={{
              color: isDarkMode ? '#38bdf8' : '#2563eb',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            ← Nazad na sve lokacije
          </Link>

          {isAdmin && (
            <Link
              to={`/admin?edit=${location.id}`}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              ✏️ Uredi ovu lokaciju
            </Link>
          )}
        </div>

        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode
              ? '1px solid #334155'
              : '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: isDarkMode
              ? '0 4px 12px rgba(0,0,0,0.4)'
              : '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >    
          <div
            style={{
              width: '100%',
              height: '520px',
              overflow: 'hidden',
              backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
            }}
          >
            <img
              src={getImageUrl(location.imageUrl)}
              alt={locationTitle}
              onError={(e) => {
                const image = e.currentTarget;

                if (!image.dataset.fallback) {
                  image.dataset.fallback = 'true';

                  image.src =
                    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80';
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          <div
            style={{
              padding: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <h1
                style={{
                  fontSize: '2.25rem',
                  margin: 0,
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                }}
              >
                {locationTitle}
              </h1>

              {location.categoryName && (
                <span
                  style={{
                    backgroundColor: isDarkMode
                      ? '#334155'
                      : '#e2e8f0',
                    color: isDarkMode ? '#38bdf8' : '#2563eb',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {location.categoryName}
                </span>
              )}
            </div>

            <p
              style={{
                color: isDarkMode ? '#cbd5e1' : '#334155',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                marginBottom: 0,
              }}
            >
              {location.description &&
              location.description !== 'string' &&
              location.description.trim() !== ''
                ? location.description
                : 'Za ovu lokaciju trenutno nije unesen detaljan opis.'}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '2.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: isDarkMode ? '#f8fafc' : '#0f172a',
            }}
          >
            Lokacija na mapi
          </h2>

          {location.address && (
            <p
              style={{
                color: isDarkMode ? '#94a3b8' : '#64748b',
                marginBottom: '1rem',
              }}
            >
              📍 Adresa: {location.address}
            </p>
          )}

          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              height: '350px',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(0,0,0,0.4)'
                : '0 4px 6px -1px rgba(0,0,0,0.1)',
              border: isDarkMode
                ? '1px solid #334155'
                : '1px solid #e2e8f0',
            }}
          >
            <iframe
              title={`Karta za ${locationTitle}`}
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            />
          </div>

          <div
            style={{
              marginTop: '1rem',
              textAlign: 'right',
            }}
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: isDarkMode ? '#38bdf8' : '#2563eb',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Otvori navigaciju u Google Maps ↗
            </a>
          </div>

          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '12px',
              border: isDarkMode
                ? '1px solid #334155'
                : '1px solid #e2e8f0',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(0,0,0,0.25)'
                : '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
              }}
            >
              Recenzije i mišljenja posjetitelja
            </h2>

            <ReviewForm locationId={location.id} />
          </div>
        </div>
      </div>
    </div>
  );
};