import { useEffect, useState } from 'react';
import { getLocations } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { LocationCard } from '../components/LocationCard';
import { useTheme } from '../context/ThemeContext';

export const HomePage = () => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    getLocations()
      .then((data) => setLocations(data))
      .catch((err) => {
        console.error(err);
        setError('Neuspješno učitavanje lokacija sa servera.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Učitavanje lokacija...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '3rem' }}>{error}</p>;

  return (
    <main style={{
      width: '100%',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      padding: '2.5rem 3rem',
      boxSizing: 'border-box'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Istražite Visoko
        </h1>
        <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '1.2rem' }}>
          Otkrijte kulturna, historijska i prirodna bogatstva grada Visoko.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%'
      }}>
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </main>
  );
};