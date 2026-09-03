import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
  const [addressId, setAddressId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/checkout', { addressId });
      alert(`Order created! Order ID: ${res.data.data._id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Address ID" value={addressId} onChange={(e) => setAddressId(e.target.value)} required />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}
