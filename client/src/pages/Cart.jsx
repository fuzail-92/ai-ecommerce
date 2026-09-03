import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    api.get('/cart').then((res) => setCart(res.data.data));
  }, []);

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <h2>Cart</h2>
      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.items.map((item) => (
          <div key={item._id}>
            <p>{item.product?.name} - Qty: {item.quantity} - Price: {item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
