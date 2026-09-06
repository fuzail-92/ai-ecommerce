import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { useAuth } from '../store/authContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart/items', {
        productId: product._id,
        variantId: selectedVariant || null,
        quantity,
      });
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-2">
            {product.images.map((img, idx) => (
              <img key={idx} src={img} alt={`${product.name} ${idx}`} className="h-20 w-20 object-cover rounded border" />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.description}</p>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-blue-600">PKR {product.price}</span>
          {product.compareAtPrice && (
            <span className="text-lg text-gray-400 line-through">PKR {product.compareAtPrice}</span>
          )}
        </div>
        <p className="mb-2 text-sm">
          Status: <span className="font-medium">{product.status}</span>
        </p>
        {product.category && (
          <p className="mb-2 text-sm">Category: {product.category.name}</p>
        )}
        {product.brand && (
          <p className="mb-4 text-sm">Brand: {product.brand.name}</p>
        )}

        {/* Variant Selection */}
        {product.variants?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Select Variant</h3>
            <select
              value={selectedVariant || ''}
              onChange={(e) => setSelectedVariant(e.target.value || null)}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Base Product</option>
              {product.variants.map((v) => (
                <option key={v._id} value={v._id}>
                  {Object.values(v.options).join(' / ')} - PKR {v.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-medium">Quantity:</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-3 py-2 w-20"
          />
        </div>

        <Button onClick={handleAddToCart} className="w-full md:w-auto">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
