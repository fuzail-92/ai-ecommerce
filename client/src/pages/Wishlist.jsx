import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    api.get('/wishlist').then((res) => setWishlist(res.data.data));
  }, []);

  if (!wishlist) return <p>Loading...</p>;

  return (
    <div>
      <h2>Wishlist</h2>
      {wishlist.products.length === 0 ? (
        <p>Wishlist is empty</p>
      ) : (
        wishlist.products.map((item) => (
          <div key={item._id}>
            <p>{item.product?.name}</p>
          </div>
        ))
      )}
    </div>
  );
}
