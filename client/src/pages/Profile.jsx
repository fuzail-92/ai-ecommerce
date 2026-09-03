import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/users/profile').then((res) => setProfile(res.data.data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
}
