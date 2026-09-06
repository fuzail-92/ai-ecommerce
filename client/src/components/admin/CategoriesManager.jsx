import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CategoryForm from './CategoryForm';
import { Button } from '../ui/button';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchCategories();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Add Category'}</Button>
      </div>
      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <CategoryForm onSuccess={handleFormSuccess} />
        </div>
      )}
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