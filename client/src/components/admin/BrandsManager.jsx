import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    const res = await api.get('/brands');
    setBrands(res.data.data || []);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <h3>Brands</h3>
      <ul>
        {brands.map((b) => (
          <li key={b._id}>{b.name} ({b.slug})</li>
        ))}
      </ul>
    </div>
  );
}
