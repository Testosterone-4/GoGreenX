import { useState } from 'react';

const Dashboard = () => {
  const [healthData] = useState({
    steps: 12000,
    heartRate: 75,
    sleep: 7.5,
  });

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-4 text-center" style={{ paddingTop: '50px'}}>Your Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <h2 className="card-title h5">Health Stats</h2>
            <p>Steps: {healthData.steps}</p>
            <p>Heart Rate: {healthData.heartRate} bpm</p>
            <p>Sleep: {healthData.sleep} hrs</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <h2 className="card-title h5">Sustainability</h2>
            <p>CO2 Saved: 2.5 kg</p>
            <p>Water Conserved: 100 L</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <h2 className="card-title h5">Rewards</h2>
            <p>Points: 150</p>
            <p>Badges: Eco Warrior</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;