import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import WearableConnect from './components/WearableConnect.jsx';
import WearableData from './components/WearableData.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Actions from './pages/Actions.jsx';
import FitnessPlan from './pages/FitnessPlan.jsx';
import Training from './pages/Training.jsx';
import Nutrition from './pages/Nutrition.jsx';

import HomePage from './pages/HomePage.jsx';
import { Groups } from './pages/Groups.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import MyNavbar from './components/MyNavbar/MyNavbar.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';

function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  const renderCommunityContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage user={user} setUser={setUser} />;
      case 'groups':
        return <Groups user={user} />;
      // case 'notifications':
      //   return <NotificationsPage user={user} />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} />;
      default:
        return <HomePage user={user} />;
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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/fitness-plan" element={<FitnessPlan />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/training" element={<Training />} />
          <Route path="/wearable/connect" element={<WearableConnect />} />
          <Route path="/wearable/data" element={<WearableData />} />

          {/* Community Area */}
          <Route
            path="/community/*"
            element={
              <div className="community-container">
                <MyNavbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
                <div className="community-content">
                  {renderCommunityContent()}
                </div>
              </div>
            }
          />
        </Routes>
        {!location.pathname.startsWith('/community') && <Footer />}
      </main>
    </div>
  );
}

export default App;
