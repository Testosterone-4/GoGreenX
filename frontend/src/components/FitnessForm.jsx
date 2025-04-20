import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FitnessForm = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    sex: 'male',
    age: '',
    goal: 'bulking',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.persist();
    setIsLoading(true);
    setError(null);
    setWarning(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post('http://localhost:8000/api/tasks/plan/', formData, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('API Response:', response.data);
      if (onPlanGenerated) {
        onPlanGenerated({
          tasks: response.data.tasks,
          fitness_input_id: response.data.fitness_input_id
        });
      }
      if (response.data.tasks.some(task => task.title.includes('Task'))) {
        setWarning('Fitness plan generation service is unavailable. Using default tasks.');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const serverError = error.response?.data?.error || 'Failed to generate fitness plan. Please try again.';
        setError(
          serverError.includes('Gemini API failed') 
            ? 'Fitness plan generation service is temporarily unavailable. Using default tasks.'
            : serverError.includes('parse JSON') 
            ? 'Unable to generate tasks due to API response. Using default tasks.'
            : serverError.includes('value too long') 
            ? 'Generated tasks are too long. Please try again or contact support.' 
            : serverError
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">Generate Fitness Plan</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {warning && <div className="alert alert-warning">{warning}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="height" className="form-label">Height (cm)</label>
          <input
            type="number"
            className="form-control"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sex" className="form-label">Sex</label>
          <select
            className="form-select"
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="goal" className="form-label">Goal</label>
          <select
            className="form-select"
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="bulking">Bulking</option>
            <option value="dieting">Dieting</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </form>
    </div>
  );
};

export default FitnessForm;