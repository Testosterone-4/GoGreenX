import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleToggle = async (taskId, isCompleted) => {
    try {
      await axios.patch(`http://localhost:8000/api/tasks/${taskId}/`, { is_completed: !isCompleted }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, is_completed: !isCompleted } : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Tasks</h2>
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex align-items-center">
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={() => handleToggle(task.id, task.is_completed)}
              className="form-check-input me-2"
            />
            <span className={task.is_completed ? 'text-decoration-line-through' : ''}>
              {task.title} ({task.category}, Due: {new Date(task.due_date).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;