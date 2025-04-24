import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FitnessForm from '../components/FitnessForm';
import TaskList from '../components/TaskList';

const FitnessPlan = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');
      const response = await axios.post('http://localhost:8000/auth/jwt/refresh/', {
        refresh: refreshToken
      });
      localStorage.setItem('accessToken', response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return null;
    }
  };

  const fetchTasks = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      const response = await axios.get('http://localhost:8000/api/tasks/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Tasks:', response.data); // Log once here
      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await axios.get('http://localhost:8000/api/tasks/list/', {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            console.log('Fetched Tasks (Retry):', response.data);
            setTasks(response.data);
            setError(null);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setError(retryError.response?.data?.error || 'Failed to fetch tasks');
            navigate('/login');
          }
        }
      } else {
        setError(error.response?.data?.error || 'Failed to fetch tasks');
      }
    }
  };

  const handlePlanGenerated = (data) => {
    setTasks(data.tasks); // Update tasks from FitnessForm
  };

  useEffect(() => {
    fetchTasks();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="display-5 mb-4 text-center">Fitness Plan</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <FitnessForm onPlanGenerated={handlePlanGenerated} />
      <TaskList tasks={tasks} onUpdateTask={(updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      }} />
    </div>
  );
};

export default FitnessPlan;