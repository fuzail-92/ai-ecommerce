import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await api.get('/brands');
      setBrands(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Brands ({brands.length})</h2>
        <button onClick={fetchBrands} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
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
