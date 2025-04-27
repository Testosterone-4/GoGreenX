// UserProfile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const Motin = motion.div;

  const getUserInfo = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const res = await axios.get("http://127.0.0.1:8000/auth/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="user-profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="profile-header">
        {user.avatar ? (
          <img src={user.avatar} alt="Profile" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <h2>{user.username}</h2>
        <p className="user-email">{user.email}</p>
      </div>

      <div className="profile-info">
        <h4>Gender</h4>
        <p>{user.gender || 'Not specified'}</p>

        <h4>Points</h4>
        <p>{user.points || 0}</p>
      </div>

      <div className="profile-bio">
        <h4>About</h4>
        <p>{user.bio || 'No bio provided'}</p>
      </div>

      <div className='profile-actions'>
        <button onClick={() => navigate('/profile/edit')} className="edit-profile-btn">
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
};

export default UserProfile;
