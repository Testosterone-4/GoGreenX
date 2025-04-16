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
        'http://localhost:8000/api/tasks/plan/',
        {
          weight: 70, // Placeholder; ideally fetch from user profile
          height: 170,
          sex: 'male',
          age: 30,
          goal: action.category === 'nutrition' ? 'dieting' : 'bulking',
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

  return (
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
  );
};

export default Actions;