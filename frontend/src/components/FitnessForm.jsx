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
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission
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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return; // Prevent multiple submissions
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setIsSubmitted(true); // Mark as submitted
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post('http://localhost:8000/api/tasks/plan/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Generated Plan:', response.data);
      if (onPlanGenerated) {
        onPlanGenerated({
          tasks: response.data.tasks,
          fitness_input: response.data.fitness_input
        });
      }
      if (response.data.tasks.some(task => task.title.includes('Walk 30 minutes'))) {
        setWarning('Fitness plan generation service is unavailable. Using default tasks.');
      }
      navigate('/actions'); // Redirect to /actions after generation
    } catch (error) {
      console.error('Error generating plan:', error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await axios.post('http://localhost:8000/api/tasks/plan/', formData, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            if (onPlanGenerated) {
              onPlanGenerated({
                tasks: response.data.tasks,
                fitness_input: response.data.fitness_input
              });
            }
            if (response.data.tasks.some(task => task.title.includes('Walk 30 minutes'))) {
              setWarning('Fitness plan generation service is unavailable. Using default tasks.');
            }
            navigate('/actions');
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setError(retryError.response?.data?.error || 'Failed to generate fitness plan');
            navigate('/login');
          }
        }
      } else {
        const serverError = error.response?.data?.error || 'Failed to generate fitness plan.';
        setError(
          serverError.includes('Gemini API failed') 
            ? 'Fitness plan generation service is unavailable. Using default tasks.'
            : serverError.includes('parse JSON') 
            ? 'Unable to generate tasks due to API response. Using default tasks.'
            : serverError.includes('value too long') 
            ? 'Generated tasks are too long. Please try again or contact support.' 
            : serverError
        );
      }
    } finally {
      setIsLoading(false);
      setIsSubmitted(false); // Reset submission state
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
            disabled={isLoading || isSubmitted}
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
            disabled={isLoading || isSubmitted}
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
            disabled={isLoading || isSubmitted}
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
            disabled={isLoading || isSubmitted}
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
            disabled={isLoading || isSubmitted}
          >
            <option value="bulking">Bulking</option>
            <option value="dieting">Dieting</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading || isSubmitted}
        >
          {isLoading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </form>
    </div>
  );
};

export default FitnessForm;