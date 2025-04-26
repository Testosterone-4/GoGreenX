import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile/UserProfile';
import { fetchCurrentUser } from '../services/api';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
      setLoading(false);
    };
    loadUser();
  }, [setUser]);

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <UserProfile user={user} />
    </div>
  );
};

export default Profile;