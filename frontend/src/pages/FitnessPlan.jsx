import React, { useState, useEffect } from 'react';
import FitnessForm from '../components/FitnessForm';
import TaskList from '../components/TaskList';
import axios from 'axios';

const FitnessPlan = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const handlePlanGenerated = ({ tasks, fitness_input_id }) => {
    console.log('Plan Generated:', tasks, fitness_input_id);
    setTasks(tasks);
    fetchTasks();
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:8000/api/tasks/list/', {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('Fetched Tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Fitness Plan</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <FitnessForm onPlanGenerated={handlePlanGenerated} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default FitnessPlan;