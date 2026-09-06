import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/users/profile');
        setAddresses(profileRes.data.data.addresses || []);
        if (profileRes.data.data.addresses?.length > 0) {
          setSelectedAddress(profileRes.data.data.addresses[0]._id);
        }
      } catch (err) {
        console.error('Failed to load checkout data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const res = await api.post('/checkout', { addressId: selectedAddress });
      alert(`Order created! Order ID: ${res.data.data._id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-3">Select Shipping Address</h2>
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found. Please add an address in your profile.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label key={addr._id} className="flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">{addr.fullName} ({addr.label})</p>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <p className="text-gray-500 text-sm">Cart summary will be displayed here from the server during checkout.</p>
        </div>

        <Button onClick={handlePlaceOrder} disabled={placing || addresses.length === 0} className="w-full">
          {placing ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
