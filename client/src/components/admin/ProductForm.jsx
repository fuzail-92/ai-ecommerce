import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

export default function ProductForm({ product = null, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    status: 'draft',
    images: [],
    variants: [],
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || product.category || '',
        brand: product.brand?._id || product.brand || '',
        status: product.status || 'draft',
        images: product.images || [],
        variants: product.variants || [],
      });
    }
    fetchCategories();
    fetchBrands();
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get('/brands');
      setBrands(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, images: value.split(',').map((s) => s.trim()).filter(Boolean) }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data.imageUrl;
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (product) {
        await api.put(`/products/${product._id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug *</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price *</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Brand</label>
          <select name="brand" value={formData.brand} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
            <option value="">Select Brand</option>
            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mt-1 w-full" disabled={uploading} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Image URLs (comma separated)</label>
          <input type="text" value={formData.images.join(', ')} onChange={handleImagesChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}</Button>
      </div>
    </form>
  );
}
