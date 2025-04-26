import React, { useState, useEffect } from 'react';
import { fetchCurrentUser } from '../../services/api';
import { useLocation } from 'react-router-dom';
import { Nav, Button, Image, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyNavbar.css';

const MyNavbar = ({ activeTab, setActiveTab }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
      setLoading(false);
    };
    loadUser();
  }, []);

  if (!location.pathname.startsWith('/community')) return null;

  if (loading) return (
    <div className="sidebar-loading">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <>
      {/* Full-width Hero Section */}
      <header className="full-width-hero">
        <div className="hero-content">
          <h1 className="hero-title">NEVER SETTLE</h1>
          <p className="hero-subtitle">Join the conversation and share your thoughts with our community</p>
        </div>
      </header>

      {/* Sidebar Toggle Button */}
      <Button
        variant="outline-primary"
        className="sidebar-toggle d-lg-none"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`}></i>
      </Button>

      {/* Sidebar Container */}
      <div className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar placeholder">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="user-info">
            <h5>{user?.username}</h5>
            <small>{user?.email}</small>
          </div>
        </div>

        <Nav className="sidebar-nav">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'home'}
              onClick={() => {
                setActiveTab('home');
                setMobileOpen(false);
              }}
              className="nav-item"
            >
              <i className="fas fa-home"></i>
              <span>Topics</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'groups'}
              onClick={() => {
                setActiveTab('groups');
                setMobileOpen(false);
              }}
              className="nav-item"
            >
              <i className="fas fa-users"></i>
              <span>Groups</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'notifications'}
              onClick={() => {
                setActiveTab('notifications');
                setMobileOpen(false);
              }}
              className="nav-item"
            >
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default MyNavbar;