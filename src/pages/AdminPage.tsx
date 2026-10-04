import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLocations } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';

interface CategoryDto {
  id: number;
  name: string;
}

const RAW_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5086';
const BASE_URL = RAW_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api`;

const getImageUrl = (url?: string) => {
  if (!url || url === 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80';
  }

  let cleanUrl = url.replace(/\\/g, '/');

  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(cleanUrl) && !cleanUrl.startsWith('http')) {
    cleanUrl += '.jpg';
  }

  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  if (!cleanUrl.startsWith('/')) {
    cleanUrl = `/${cleanUrl}`;
  }

  return `${BASE_URL}${cleanUrl}`;
};

export const AdminPage = () => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState(43.9878);
  const [longitude, setLongitude] = useState(18.1783);
  const [categoryId, setCategoryId] = useState<number>(1);

  const { isDarkMode } = useTheme();

  const loadData = async () => {
    getLocations().then(setLocations).catch(console.error);

    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !editingId) {
          setCategoryId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Greška pri dohvaćanju kategorija:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (loc: any) => {
    setEditingId(loc.id);
    setTitle(loc.title || loc.name || '');
    setDescription(loc.description || '');
    setAddress(loc.address || '');
    setImageUrl(loc.imageUrl || '');
    setLatitude(loc.latitude || 43.9878);
    setLongitude(loc.longitude || 18.1783);
    setCategoryId(loc.categoryId || (categories[0]?.id ?? 1));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setAddress('');
    setImageUrl('');
    setLatitude(43.9878);
    setLongitude(18.1783);
    setCategoryId(categories[0]?.id ?? 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      id: editingId || 0,
      title,
      description,
      address,
      imageUrl,
      latitude,
      longitude,
      categoryId
    };

    const url = editingId
      ? `${API_URL}/locations/${editingId}`
      : `${API_URL}/locations`;

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingId ? 'Lokacija uspješno izmijenjena!' : 'Nova lokacija dodana!');
        resetForm();
        loadData();
      } else {
        alert('Greška pri spremanju lokacije.');
      }
    } catch (err) {
      console.error(err);
      alert('Mrežna greška pri spajanju na API.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu lokaciju?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      padding: '2.5rem 3rem',
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
      minHeight: 'calc(100vh - 70px)'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Control Panel - Upravljanje Lokacijama</h1>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '3rem',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr 1fr'
      }}>
        <h2 style={{ gridColumn: '1 / -1', margin: 0 }}>
          {editingId ? `Uredi lokaciju (ID: ${editingId})` : 'Dodaj novu lokaciju'}
        </h2>

        <input
          type="text"
          placeholder="Naslov lokacije"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '0.6rem', borderRadius: '6px' }}
        />

        <input
          type="text"
          placeholder="Adresa"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px' }}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '600' }}>
            Kategorija lokacije:
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.69rem',
              borderRadius: '6px',
              border: isDarkMode ? '1px solid #475569' : '1px solid #ccc',
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#0f172a'
            }}
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value={1}>Učitavanje kategorija...</option>
            )}
          </select>
        </div>

        <input
          type="text"
          placeholder="URL Slike (https://... ili /uploads/images/...)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', gridColumn: '1 / -1' }}
        />

        <textarea
          placeholder="Detaljan opis..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ padding: '0.6rem', borderRadius: '6px', gridColumn: '1 / -1' }}
        />

        <input
          type="number"
          step="any"
          placeholder="Latitude (Npr. 43.9878)"
          value={latitude}
          onChange={(e) => setLatitude(Number(e.target.value))}
          style={{ padding: '0.6rem', borderRadius: '6px' }}
        />

        <input
          type="number"
          step="any"
          placeholder="Longitude (Npr. 18.1783)"
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
          style={{ padding: '0.6rem', borderRadius: '6px' }}
        />

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {editingId ? 'Spremi izmjene' : 'Kreiraj lokaciju'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Odustani
            </button>
          )}
        </div>
      </form>

      <h2>Postojeće lokacije ({locations.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem' }}>ID</th>
            <th style={{ padding: '0.75rem' }}>Slika</th>
            <th style={{ padding: '0.75rem' }}>Naslov</th>
            <th style={{ padding: '0.75rem' }}>Kategorija</th>
            <th style={{ padding: '0.75rem' }}>Adresa</th>
            <th style={{ padding: '0.75rem' }}>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc: any) => (
            <tr key={loc.id} style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.75rem' }}>{loc.id}</td>
              <td style={{ padding: '0.75rem' }}>
                <img
                  src={getImageUrl(loc.imageUrl)}
                  alt={loc.title || loc.name || 'Lokacija'}
                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </td>
              <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                <Link
                  to={`/locations/${loc.id}`}
                  style={{ color: isDarkMode ? '#38bdf8' : '#2563eb', textDecoration: 'none' }}
                  title="Otvori detalje lokacije"
                >
                  {loc.title || loc.name || 'Bez naslova'} 
                </Link>
              </td>
              <td style={{ padding: '0.75rem' }}>
                {loc.categoryName || categories.find(c => c.id === loc.categoryId)?.name || '-'}
              </td>
              <td style={{ padding: '0.75rem' }}>{loc.address || '-'}</td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => handleEdit(loc)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Uredi</button>
                <button onClick={() => handleDelete(loc.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};