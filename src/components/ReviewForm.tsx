import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewForm = ({ locationId }: { locationId: number }) => {
  const { isDarkMode } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const storageKey = `visit_visoko_reviews_${locationId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
  }, [locationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      author: author.trim() || 'Anonymus posjetilac',
      rating,
      comment,
      date: new Date().toLocaleDateString('bs-BA')
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setComment('');
    setAuthor('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Vaše ime"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#0f172a',
              flex: 1
            }}
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#0f172a'
            }}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
            <option value={3}>⭐⭐⭐ (3/5)</option>
            <option value={2}>⭐⭐ (2/5)</option>
            <option value={1}>⭐ (1/5)</option>
          </select>
        </div>

        <textarea
          placeholder="Napišite vaše utiske o ovoj lokaciji..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
            color: isDarkMode ? '#f8fafc' : '#0f172a'
          }}
        />

        <button
          type="submit"
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          Ostavi recenziju
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.length === 0 ? (
          <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Budite prvi koji će ostaviti recenziju za ovu lokaciju!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} style={{
              padding: '1rem',
              backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
              borderRadius: '8px',
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <strong>{rev.author}</strong>
                <span>{'⭐'.repeat(rev.rating)}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{rev.comment}</p>
              <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8' }}>{rev.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};