import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

export default function BrandForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/brands', { name, slug });
      toast.success('Brand created!');
      setName('');
      setSlug('');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Slug *</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 w-full border rounded-md px-3 py-2" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Brand'}</Button>
    </form>
  );
}