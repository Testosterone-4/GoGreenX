import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile/UserProfile';
import { Container, Spinner, Alert } from 'react-bootstrap';

const API_HOST = import.meta.env.VITE_API_HOST;
const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            
            const response = await axios.post(
                `${API_HOST}/auth/jwt/refresh/`,
                { refresh: refreshToken }
            );
            
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return null;
        }
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No access token');
            
            const response = await axios.get(
                `${API_HOST}/api/users/users/me/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('Profile data:', response.data);
            
            setUserData(response.data);
            setError(null);
        } catch (error) {
            if (error.response?.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        const retryResponse = await axios.get(
                            `${API_HOST}/api/users/users/me/`,
                            {
                                headers: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            }
                        );
                        setUserData(retryResponse.data);
                    } catch (retryError) {
                        setError('Failed to fetch profile after refresh');
                    }
                }
            } else {
                setError(error.response?.data?.detail || 'Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.patch(
                `${API_HOST}/api/users/users/update_profile/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setUserData(prev => ({ ...prev, ...response.data }));
            setError(null);
            return true;
        } catch (error) {
            console.error('Update failed:', error);
            setError(error.response?.data?.detail || 'Failed to update profile');
            return false;
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
      return (
          <Container className="d-flex justify-content-center mt-5">
              <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading profile...</span>
              </Spinner>
          </Container>
      );
  }

  if (error) {
      return (
          <Container className="mt-5">
              <Alert variant="danger" className="text-center">
                  {error}
              </Alert>
          </Container>
      );
  }

  return (
      <Container className="my-5">
          {userData && (
              <UserProfile 
                  user={userData}
                  onUpdate={handleUpdateProfile}
              />
          )}
      </Container>
  );
};

export default ProfilePage;