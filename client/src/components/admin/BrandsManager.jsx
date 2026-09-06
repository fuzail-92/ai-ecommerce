import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import BrandForm from './BrandForm';
import { Button } from '../ui/button';

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/brands');
      setBrands(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchBrands();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Brands ({brands.length})</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Add Brand'}</Button>
      </div>
      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <BrandForm onSuccess={handleFormSuccess} />
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {brands.map((b) => (
          <li key={b._id} className="py-3 flex justify-between items-center">
            <span className="font-medium">{b.name}</span>
            <span className="text-sm text-gray-500">{b.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}