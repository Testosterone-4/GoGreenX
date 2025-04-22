import { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';

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

  const handleAddTask = async (action) => {
    setLoading((prev) => ({ ...prev, [action.id]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/tasks/list/',
        {
          title: action.title,
          category: action.category,
          due_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      alert(`${action.title} added to your tasks!`);
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    } finally {
      setLoading((prev) => ({ ...prev, [action.id]: false }));
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

  const handleCustomTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/tasks/list/',
        {
          ...customTask,
          due_date: new Date(customTask.due_date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      alert('Task added!');
      setCustomTask({ title: '', category: 'exercise', due_date: '' });
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error adding custom task:', error);
      alert('Failed to add task.');
    }
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
      setTaskError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTaskError(error.response?.status === 404 ? 'Tasks endpoint not found. Please contact support.' : 'Failed to fetch tasks');
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
      setTaskError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setTaskError('Failed to update task');
    }
  };

  // Group tasks by due_date and use only weekday name
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.due_date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const key = `${dayName}|${task.due_date}`; // Unique key to avoid date conflicts
    if (!acc[key]) {
      acc[key] = { dayName, tasks: [] };
    }
    acc[key].tasks.push(task);
    return acc;
  }, {});

  // Sort tasks within each day: exercise first, then nutrition, then sustainability
  Object.keys(groupedTasks).forEach(key => {
    groupedTasks[key].tasks.sort((a, b) => {
      const order = { exercise: 1, nutrition: 2, sustainability: 3 };
      return order[a.category] - order[b.category];
    });
  });

  // Sort days chronologically
  const sortedDays = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a.split('|')[1]);
    const dateB = new Date(b.split('|')[1]);
    return dateA - dateB;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="display-5 mb-4 text-center">Actions</h1>

      {/* Add Custom Task Form */}
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

      {/* Your Tasks Section */}
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

      {/* Suggested Actions Section */}
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