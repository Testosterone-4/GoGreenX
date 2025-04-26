import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Actions from "./pages/Actions.jsx";
import FitnessPlan from "./pages/FitnessPlan.jsx";
import Training from "./pages/Training.jsx";
import Nutrition from './pages/Nutrition.jsx';

import React, { useState, useEffect } from 'react';
//import './App.css';
import MyNavbar from './components/MyNavbar/MyNavbar';
import HomePage from './pages/HomePage';
import {Groups} from './pages/Groups';
//import NotificationsPage from './pages/Notifications'
import ProfilePage from './pages/ProfilePage';
import { GroupCreate, GroupDetail, GroupEdit } from './components/GroupManagement';
//import { NotificationProvider } from './contexts/NotificationContext';



function App() {

    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState(null);


  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage user={user} setUser={setUser}/>;
      case 'groups': return <Groups user={user} />;
      //case 'notifications': return < user={user} />;
      //case 'profile': return <ProfilePage user={user} setUser={setUser} />;
      default: return <HomePage user={user} />;
    }
  };

  return (
    <Router>
      <Navbar />
      <div>
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

          {/* Community routes with tab navigation */}

          <Route path="/community/*" element={
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
          } />

        </Routes>
      </div>
       {!window.location.pathname.startsWith('/community') && <Footer />}

    </Router>
  );
}

export default App;
