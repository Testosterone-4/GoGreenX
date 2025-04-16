import FitnessForm from '../components/FitnessForm.jsx';
import TaskList from '../components/TaskList.jsx';

const FitnessPlan = () => {
  const handlePlanGenerated = () => {
    window.location.reload(); // Simple for MVP
  };

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-4 text-center">Your Fitness Plan</h1>
      <div className="row">
        <div className="col-12">
          <FitnessForm onPlanGenerated={handlePlanGenerated} />
        </div>
        <div className="col-12">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default FitnessPlan;