import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data.products || res.data.data || []));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{p.name}</h3>
          <p>Price: {p.price}</p>
          <Link to={`/products/${p._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
