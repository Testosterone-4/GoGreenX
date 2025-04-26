import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ tasks: initialTasks, onUpdateTask }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
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

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      const response = await axios.patch(`http://localhost:8000/api/tasks/list/${taskId}/`, {
        is_completed: !isCompleted,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      if (onUpdateTask) onUpdateTask(response.data);
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await axios.patch(`http://localhost:8000/api/tasks/list/${taskId}/`, {
              is_completed: !isCompleted,
            }, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            setTasks(tasks.map(task => task.id === taskId ? response.data : task));
            if (onUpdateTask) onUpdateTask(response.data);
            setError(null);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setError(retryError.response?.data?.error || 'Failed to update task');
            navigate('/login');
          }
        }
      } else {
        setError(error.response?.data?.error || 'Failed to update task');
      }
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.due_date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const key = `${dayName}|${task.due_date}`;
    if (!acc[key]) {
      acc[key] = { dayName, tasks: [] };
    }
    acc[key].tasks.push(task);
    return acc;
  }, {});

  Object.keys(groupedTasks).forEach(key => {
    groupedTasks[key].tasks.sort((a, b) => {
      if (a.category === 'exercise' && b.category !== 'exercise') return -1;
      if (b.category === 'exercise' && a.category !== 'exercise') return 1;
      if (a.category === 'nutrition' && b.category === 'sustainability') return -1;
      if (b.category === 'nutrition' && a.category === 'sustainability') return 1;
      return 0;
    });
  });

  const sortedDays = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a.split('|')[1]);
    const dateB = new Date(b.split('|')[1]);
    return dateA - dateB;
  });

  useEffect(() => {
    if (!initialTasks || initialTasks.length === 0) {
      fetchTasks();
    } else {
      setTasks(initialTasks);
    }
  }, [initialTasks, navigate]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Your Fitness Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks available. Generate a fitness plan to get started!</p>
      ) : (
        sortedDays.map(key => (
          <div key={key} className="mb-4">
            <h4 className="mb-3" style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '5px' }}>
              {groupedTasks[key].dayName}
            </h4>
            <ListGroup>
              {groupedTasks[key].tasks.map(task => (
                <ListGroup.Item
                  key={task.id}
                  className="d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: task.is_completed ? '#e9ecef' : 'white' }}
                >
                  <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                    {task.title} ({task.category})
                  </span>
                  <Button
                    variant={task.is_completed ? 'outline-success' : 'success'}
                    onClick={() => handleToggleComplete(task.id, task.is_completed)}
                  >
                    {task.is_completed ? 'Undo' : 'Complete'}
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;