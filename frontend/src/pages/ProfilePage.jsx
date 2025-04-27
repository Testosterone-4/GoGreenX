// ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const Motin = motion.div;
  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get('http://127.0.0.1:8000/auth/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile.");
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append('first_name', profile.first_name);
    formData.append('last_name', profile.last_name);
    formData.append('username', profile.username);
    formData.append('bio', profile.bio || '');
    formData.append('location', profile.location || '');
    formData.append('gender', profile.gender || '');
    formData.append('points', profile.points || 0);
    if (profile.avatar instanceof File) {
      formData.append('avatar', profile.avatar);
    }

    try {
      const res = await axios.patch('http://127.0.0.1:8000/auth/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(res.data);
      console.log("Profile updated successfully:", res.data);
      setIsEditing(false);
      setIsLoading(false);
      navigate('/profile');
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsLoading(false);
      setError("Failed to save profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      setProfile(prev => ({ ...prev, avatar: files[0] }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Edit My Profile</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form>
                {/* Inputs */}
                {[
                  { label: "Username", name: "username" },
                  { label: "First Name", name: "first_name" },
                  { label: "Last Name", name: "last_name" },
                  { label: "Email", name: "email", disabled: true },
                  { label: "Gender", name: "gender" },
                  { label: "Bio", name: "bio" },
                  { label: "Location", name: "location" },
                  { label: "Points", name: "points", type: "number" },
                ].map(({ label, name, disabled, type = "text" }) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">{label}:</label>
                    <input
                      type={type}
                      name={name}
                      id={name}
                      value={profile[name] || ""}
                      onChange={handleChange}
                      className="form-control"
                      disabled={disabled || !isEditing}
                    />
                  </div>
                ))}

                {/* Avatar Upload */}
                <div className="mb-3">
                  <label htmlFor="avatar" className="form-label">Avatar:</label>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="form-control"
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/profile')}
                  >
                    Back to Profile
                  </button>

                  {isEditing ? (
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
