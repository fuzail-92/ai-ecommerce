import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users ({users.length})</h2>
        <button onClick={fetchUsers} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((u) => (
          <li key={u._id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {u.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
