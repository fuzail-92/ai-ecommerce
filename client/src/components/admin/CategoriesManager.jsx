import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
        <button onClick={fetchCategories} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
      <ul className="divide-y divide-gray-200">
        {categories.map((c) => (
          <li key={c._id} className="py-3 flex justify-between items-center">
            <span className="font-medium">{c.name}</span>
            <span className="text-sm text-gray-500">{c.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
