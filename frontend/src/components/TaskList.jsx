import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';

const TaskList = ({ tasks: initialTasks, onUpdateTask }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [error, setError] = useState(null);

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

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:8000/api/tasks/list/${taskId}/`, {
        is_completed: !isCompleted,
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      if (onUpdateTask) onUpdateTask(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  useEffect(() => {
    if (!initialTasks || initialTasks.length === 0) {
      fetchTasks();
    } else {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  return (
    <div className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Your Fitness Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks available. Generate a fitness plan to get started!</p>
      ) : (
        <ListGroup>
          {tasks.map(task => (
            <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
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
      )}
    </div>
  );
};

export default TaskList;