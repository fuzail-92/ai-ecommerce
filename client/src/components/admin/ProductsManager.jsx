import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';
import { Button } from '../ui/button';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?status=all');
      setProducts(res.data.products || res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Products ({products.length})</h2>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingProduct(null); setShowForm(true); }}>Add Product</Button>
          <button onClick={fetchProducts} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>
      </div>
      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
          <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
          <button onClick={() => setShowForm(false)} className="mt-2 text-sm text-gray-500">Cancel</button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{p.name}</td>
                <td className="px-4 py-3 text-sm">PKR {p.price}</td>
                <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}