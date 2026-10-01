import { useState, useEffect } from 'react';
import { getLocations } from '../services/locationService';
import type { LocationDto } from '../types/location';
import { useTheme } from '../context/ThemeContext';

export const AdminPage = () => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState(43.9878);
  const [longitude, setLongitude] = useState(18.1783);
  const [categoryId, setCategoryId] = useState(1);

  const { isDarkMode } = useTheme();

  const loadData = () => {
    getLocations().then(setLocations).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (loc: LocationDto) => {
    setEditingId(loc.id);
    setTitle(loc.name || (loc as any).name || '');
    setDescription(loc.description || '');
    setAddress(loc.address || '');
    setImageUrl(loc.imageUrl || '');
    setLatitude(loc.latitude || 43.9878);
    setLongitude(loc.longitude || 18.1783);
    setCategoryId(loc.categoryId || 1);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setAddress('');
    setImageUrl('');
    setLatitude(43.9878);
    setLongitude(18.1783);
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
      ? `http://localhost:5086/api/locations/${editingId}`
      : 'http://localhost:5086/api/locations';

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
        alert(editingId ? 'Lokacija izmijenjena!' : 'Nova lokacija dodana!');
        resetForm();
        loadData();
      } else {
        alert('Greška pri spremanju lokacije.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu lokaciju?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5086/api/locations/${id}`, {
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
          {editingId ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
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

        <input
          type="text"
          placeholder="URL Slike (https://...)"
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
            <th style={{ padding: '0.75rem' }}>Naslov</th>
            <th style={{ padding: '0.75rem' }}>Adresa</th>
            <th style={{ padding: '0.75rem' }}>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id} style={{ borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.75rem' }}>{loc.id}</td>
              <td style={{ padding: '0.75rem' }}>{loc.name || (loc as any).name}</td>
              <td style={{ padding: '0.75rem' }}>{loc.address || '-'}</td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(loc)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>E</button>
                <button onClick={() => handleDelete(loc.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};