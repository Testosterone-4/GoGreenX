import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from '../pages/Login';
import AuthModals from '../pages/Register';
import '../assets/css/main.css';


const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
<>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Green Living Hub</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" exact="true">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/actions">Actions</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/fitness-plan">Fitness Plan</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">Profile</NavLink>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <AuthModals show={showRegister} handleClose={() => setShowRegister(false)} />
    </>
  );
};

export default Navbar;