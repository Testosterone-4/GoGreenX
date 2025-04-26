import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
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

      <div className="profile-bio">
        <h4>About</h4>
        <p>{user.bio || 'No bio provided'}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{user.follower_count || 0}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.following_count || 0}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-profile-btn">
          <i className="fas fa-edit"></i> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;