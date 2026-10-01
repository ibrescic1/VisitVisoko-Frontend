import { useEffect, useState } from 'react';
import { getLocations } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { LocationCard } from '../components/LocationCard';
import { useTheme } from '../context/ThemeContext';

export const HomePage = () => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Sve');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('visit_visoko_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const { isDarkMode } = useTheme();

  useEffect(() => {
    getLocations()
      .then((data) => setLocations(data))
      .catch((err) => {
        console.error(err);
        setError('Neuspješno učitavanje lokacija.');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('visit_visoko_favorites', JSON.stringify(updated));
  };

  const fetchedCategories = Array.from(new Set(locations.map((l) => l.categoryName).filter(Boolean)));
  const categories = ['Sve', ...fetchedCategories];

  const filteredLocations = locations.filter((loc) => {
    const query = searchQuery.toLowerCase().trim();
    const titleText = (loc.name || (loc as any).name || '').toLowerCase();
    const descText = (loc.description || '').toLowerCase();

    const matchesSearch = query === '' || titleText.includes(query) || descText.includes(query);
    const matchesCategory = selectedCategory === 'Sve' || loc.categoryName === selectedCategory;
    const matchesFavorites = !showOnlyFavorites || favorites.includes(loc.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

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

<div style={{
  background: isDarkMode 
    ? 'linear-gradient(180deg, #132e38 0%, #0f172a 100%)' 
    : 'linear-gradient(180deg, #6c9eb5 0%, #5b8fa7 65%, transparent 100%)',
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  marginTop: '-2.5rem',
  padding: '4rem 2rem 4rem 2rem',
  borderRadius: '0 0 28px 28px',
  marginBottom: '2.5rem'
}}>
  <header style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '13rem',
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#ffffff',
    position: 'relative',
    flexWrap: 'wrap'
  }}>
    <div style={{ flex: '1 1 420px', maxWidth: '520px', textAlign: 'left', zIndex: 2 }}>
      <h1 style={{ 
        fontSize: '2.8rem', 
        fontWeight: '800', 
        marginBottom: '0.75rem', 
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: '#ffffff',
        textShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        Istražite <span style={{ color: '#fef08a' }}>Visoko</span>
      </h1>

      <p style={{ 
        fontSize: '1.1rem', 
        lineHeight: 1.6,
        color: '#f8fafc',
        marginBottom: '1.75rem',
        textShadow: '0 1px 4px rgba(0,0,0,0.15)'
      }}>
        Otkrijte kulturna, historijska i prirodna bogatstva grada Visoko, od tajanstvenih piramida do kraljevske historije.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        
        <button 
          onClick={() => {
            const el = document.getElementById('locations');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          style={{
            backgroundColor: isDarkMode ? '#72cffa' : '#ffffff', 
            color: '#0f172a',
            border: isDarkMode ? '1px solid #7dd3fc' : 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(56, 189, 248, 0.35)' 
              : '0 4px 15px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Istraži lokacije ↓
        </button>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fef08a', lineHeight: 1 }}>8+</div>
            <div style={{ fontSize: '0.8rem', color: '#f1f5f9' }}>Lokacija</div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fef08a', lineHeight: 1 }}>Bogata</div>
            <div style={{ fontSize: '0.8rem', color: '#f1f5f9' }}>Historija</div>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      flex: '0 0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2
    }}>
      <div style={{
        padding: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
      }}>
        <img 
          src="/hero-bg.jpg" 
          alt="Visoko Piramida Ilustracija" 
          style={{
            height: '240px',
            width: 'auto',
            borderRadius: '14px',
            display: 'block',
            objectFit: 'cover'
          }}
        />
      </div>
    </div>
  </header>
</div>

      <section style={{
        maxWidth: '1000px',
        margin: '0 auto 3rem auto',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
        lineHeight: '1.7'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: isDarkMode ? '#38bdf8' : '#2563eb',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
           O gradu Visoko  
        </h2>

        <p style={{ fontSize: '1.05rem', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: '1rem' }}>
          Visoko je historijski i kulturni biser smješten u samom srcu Bosne i Hercegovine, na ušću rijeke Fojnice u Bosnu. Grad sa bogatom višestoljetnom tradicijom nekada je bio srednjovjekovno sjedište bosanskih vladara i krunidbeno mjesto kraljeva na lokalitetu Mile.
        </p>

        <p style={{ fontSize: '1.05rem', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: '1.5rem' }}>
          Danas je Visoko globalno prepoznatljivo po kompleksu Bosanskih piramida i arheološko-turističkom parku Ravne, ali i po dugoj obrtničkoj tradiciji kožarstva, bogatoj gastronomiji te srdačnom gostoprimstvu.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', color: isDarkMode ? '#f8fafc' : '#0f172a', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}> Srednjovjekovna prijestolnica 👑</span>
          <span style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', color: isDarkMode ? '#f8fafc' : '#0f172a', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>  Bosanske piramide 📐</span>
          <span style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', color: isDarkMode ? '#f8fafc' : '#0f172a', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}> Netaknuta priroda 🌿</span>
          <span style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1', color: isDarkMode ? '#f8fafc' : '#0f172a', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}> Tradicija kožarstva 👞</span>
        </div>
      </section>

      <section id = "locations"style={{ maxWidth: '800px', margin: '0 auto 2.5rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Pretraži lokacije po nazivu ili opisu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#0f172a',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: showOnlyFavorites ? '#ef4444' : isDarkMode ? '#334155' : '#e2e8f0',
              color: showOnlyFavorites ? '#ffffff' : isDarkMode ? '#f8fafc' : '#0f172a',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {showOnlyFavorites ? '❤️ Prikaži sve' : '❤️ Omiljene'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#2563eb' : isDarkMode ? '#1e293b' : '#e2e8f0',
                color: selectedCategory === cat ? '#ffffff' : isDarkMode ? '#cbd5e1' : '#475569',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filteredLocations.length === 0 ? (
        <p style={{ textAlign: 'center', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '2rem' }}>
          Nema pronađenih lokacija za zadani kriterij pretrage.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginBottom: '4rem'
        }}>
          {filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isFavorite={favorites.includes(location.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
          Mape i navigacija - Visoko
        </h2>
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          height: '400px'
        }}>
          <iframe
            title="Visoko Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://maps.google.com/maps?q=Visoko,%20Bosnia%20and%20Herzegovina&t=&z=13&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>
      </section>
    </main>
  );
};