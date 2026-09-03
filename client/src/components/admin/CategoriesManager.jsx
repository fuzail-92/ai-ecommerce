import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Categories</h3>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>{c.name} ({c.slug})</li>
        ))}
      </ul>
    </div>
  );
}
