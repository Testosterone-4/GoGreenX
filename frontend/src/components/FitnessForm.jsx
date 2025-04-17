import { useState } from 'react';
import axios from 'axios';

const FitnessForm = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    sex: 'male',
    age: '',
    goal: 'bulking',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/plan/', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      onPlanGenerated(response.data);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">Generate Fitness Plan</h2>
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