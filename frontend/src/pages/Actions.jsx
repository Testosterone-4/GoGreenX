import { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Actions = () => {
  const [actions] = useState([
    { id: 1, title: 'Use reusable bags', category: 'sustainability', description: 'Reduce plastic waste by using cloth bags.' },
    { id: 2, title: 'Cycle to work', category: 'sustainability', description: 'Lower your carbon footprint.' },
    { id: 3, title: 'Eat plant-based meal', category: 'nutrition', description: 'Try a vegan dish today.' },
    { id: 4, title: 'Walk 10,000 steps', category: 'exercise', description: 'Boost your daily activity.' },
  ]);

  const [loading, setLoading] = useState({});
  const [tasks, setTasks] = useState([]);
  const [taskError, setTaskError] = useState(null);
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
      console.log('Fetched Tasks:', response.data);
      setTasks(response.data);
      setTaskError(null);
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
            setTaskError(null);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setTaskError(retryError.response?.data?.error || 'Failed to fetch tasks');
            navigate('/login');
          }
        }
      } else {
        setTaskError(error.response?.data?.error || 'Failed to fetch tasks');
      }
    }
  };

  const handleAddTask = async (action) => {
    setLoading((prev) => ({ ...prev, [action.id]: true }));
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      await axios.post(
        'http://localhost:8000/api/tasks/list/',
        {
          title: action.title,
          category: action.category,
          due_date: new Date().toISOString().split('T')[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${action.title} added to your tasks!`);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            await axios.post(
              'http://localhost:8000/api/tasks/list/',
              {
                title: action.title,
                category: action.category,
                due_date: new Date().toISOString().split('T')[0],
              },
              {
                headers: { Authorization: `Bearer ${newToken}` },
              }
            );
            alert(`${action.title} added to your tasks!`);
            fetchTasks();
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            alert('Failed to add task.');
            navigate('/login');
          }
        }
      } else {
        alert('Failed to add task.');
      }
    } finally {
      setLoading((prev) => ({ ...prev, [action.id]: false }));
    }
  };

  const handleCustomTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      await axios.post(
        'http://localhost:8000/api/tasks/list/',
        {
          ...customTask,
          due_date: new Date(customTask.due_date).toISOString().split('T')[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Task added!');
      setCustomTask({ title: '', category: 'exercise', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding custom task:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            await axios.post(
              'http://localhost:8000/api/tasks/list/',
              {
                ...customTask,
                due_date: new Date(customTask.due_date).toISOString().split('T')[0],
              },
              {
                headers: { Authorization: `Bearer ${newToken}` },
              }
            );
            alert('Task added!');
            setCustomTask({ title: '', category: 'exercise', due_date: '' });
            fetchTasks();
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            alert('Failed to add task.');
            navigate('/login');
          }
        }
      } else {
        alert('Failed to add task.');
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
      setTaskError(null);
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
            setTaskError(null);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setTaskError(retryError.response?.data?.error || 'Failed to update task');
            navigate('/login');
          }
        }
      } else {
        setTaskError(error.response?.data?.error || 'Failed to update task');
      }
    }
  };

  const [customTask, setCustomTask] = useState({
    title: '',
    category: 'exercise',
    due_date: '',
  });

  const handleCustomTaskChange = (e) => {
    const { name, value } = e.target;
    setCustomTask((prev) => ({ ...prev, [name]: value }));
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
    fetchTasks();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="display-5 mb-4 text-center">Actions</h1>
      <div className="card p-4 mb-4">
        <h3>Add a Custom Task</h3>
        <form onSubmit={handleCustomTaskSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Task title"
              value={customTask.title}
              onChange={handleCustomTaskChange}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              name="category"
              value={customTask.category}
              onChange={handleCustomTaskChange}
            >
              <option value="exercise">Exercise</option>
              <option value="nutrition">Nutrition</option>
              <option value="sustainability">Sustainability</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              name="due_date"
              value={customTask.due_date}
              onChange={handleCustomTaskChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Add Custom Task</button>
        </form>
      </div>
      <div className="mb-5">
        <h3>Your Tasks</h3>
        {taskError && <div className="alert alert-danger">{taskError}</div>}
        {tasks.length === 0 ? (
          <p>No tasks available. Add tasks below or accept a fitness plan!</p>
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
      <div>
        <h3>Suggested Actions</h3>
        <div className="row">
          {actions.map((action) => (
            <div key={action.id} className="col-md-6 mb-4">
              <div className="card p-3">
                <h2 className="card-title h5">{action.title}</h2>
                <p className="card-text">{action.description}</p>
                <p className="card-text"><small>Category: {action.category}</small></p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddTask(action)}
                  disabled={loading[action.id]}
                >
                  {loading[action.id] ? 'Adding...' : 'Add to Tasks'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Actions;