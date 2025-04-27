import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import WearableConnect from './components/WearableConnect.jsx';
import WearableData from './components/WearableData.jsx';


import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Actions from './pages/Actions.jsx';
import FitnessPlan from './pages/FitnessPlan.jsx';
import Training from './pages/Training.jsx';
import Nutrition from './pages/Nutrition.jsx';


import React, { useState} from 'react';
//import './App.css';
import MyNavbar from './components/MyNavbar/MyNavbar';
import HomePage from './pages/HomePage';
import {Groups} from './pages/Groups';

import MyPosts from './pages/MyPosts'







function App() {
  const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage user={user} setUser={setUser}/>;
      case 'groups': return <Groups user={user} />;
        case 'my-posts': return <MyPosts user={user} setUser={setUser}/>;

      default: return <HomePage user={user} />;
    }
  };

  useEffect(() => {
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
        <Route path="/wearable/connect" element={<WearableConnect />} />
        <Route path="/wearable/data" element={<WearableData />} />

        {/* Community routes with tab navigation */}
        <Route
          path="/community/*"
          element={
            <div className="community-container">
              <MyNavbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
              />
              <div className="community-content">
                {renderContent()}
              </div>
            </div>
          }
        />
      </Routes>
      {!window.location.pathname.startsWith('/community') && <Footer />}
    </main>
  </div>
);
}

export default App;