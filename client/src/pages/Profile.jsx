import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Link to="/orders" className="text-blue-600 hover:underline">
          My Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium">{profile.role}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email Verified</label>
            <p className="font-medium">{profile.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Addresses</h2>
        {profile.addresses.length === 0 ? (
          <p className="text-gray-500">No addresses added yet.</p>
        ) : (
          <div className="space-y-3">
            {profile.addresses.map((addr) => (
              <div key={addr._id} className="border rounded p-3">
                <p className="font-medium">{addr.fullName} ({addr.label})</p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                </p>
                <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
