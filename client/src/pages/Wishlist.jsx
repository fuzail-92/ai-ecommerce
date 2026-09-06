import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeProduct = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      fetchWishlist();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove');
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />;

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.products.map((item) => (
          <div key={item._id} className="relative">
            <ProductCard product={item.product} />
            <button
              onClick={() => removeProduct(item.product._id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
