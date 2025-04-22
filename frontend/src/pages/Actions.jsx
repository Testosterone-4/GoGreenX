import { useState } from 'react';
import axios from 'axios';

const Actions = () => {
  const [actions] = useState([
    { id: 1, title: 'Use reusable bags', category: 'sustainability', description: 'Reduce plastic waste by using cloth bags.' },
    { id: 2, title: 'Cycle to work', category: 'sustainability', description: 'Lower your carbon footprint.' },
    { id: 3, title: 'Eat plant-based meal', category: 'nutrition', description: 'Try a vegan dish today.' },
    { id: 4, title: 'Walk 10,000 steps', category: 'exercise', description: 'Boost your daily activity.' },
  ]);

  const [loading, setLoading] = useState({});

  const handleAddTask = async (action) => {
    setLoading((prev) => ({ ...prev, [action.id]: true }));
    try {
      await axios.post(
        'http://localhost:8000/api/tasks/',
        {
          title: action.title,
          category: action.category,
          due_date: new Date().toISOString(), // or customize it
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert(`${action.title} added to your tasks!`);
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
    due_date: ''
  });

  const handleCustomTaskChange = (e) => {
    const { name, value } = e.target;
    setCustomTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/tasks/',
        customTask,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Task added!');
      setCustomTask({ title: '', category: 'exercise', due_date: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to add task.');
    }
  };

  return (
    <>
      <div className="mt-5 container" style={{ paddingTop: '50px'}}>
        <h3>Add a Custom Task</h3>
        <form onSubmit={handleCustomTaskSubmit}>
          <div className="mb-2">
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
          <div className="mb-2">
            <select
              className="form-select"
              name="category"
              value={customTask.category}
              onChange={handleCustomTaskChange}
            >
              <option value="exercise">Exercise</option>
              <option value="nutrition">Nutrition</option>
            </select>
          </div>
          <div className="mb-2">
            <input
              type="datetime-local"
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

      <div className="container py-4">
        <h1 className="display-5 mb-4 text-center">Suggested Actions</h1>
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
    </>
  );
};

export default Actions;
