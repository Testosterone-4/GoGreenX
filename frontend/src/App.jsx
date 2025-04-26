import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Actions from './pages/Actions.jsx';
import FitnessPlan from './pages/FitnessPlan.jsx';
import Training from './pages/Training.jsx';
import Nutrition from './pages/Nutrition.jsx';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Example class toggle if needed for special homepage styling
    if (location.pathname === '/') {
      document.body.classList.add('no-navbar-padding');
    } else {
      document.body.classList.remove('no-navbar-padding');
    }
  }, [location]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/fitness-plan" element={<FitnessPlan />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
