import { useState } from 'react';
import LoginModal from '../pages/Login';
import AuthModals from '../pages/Register';
import { Link } from 'react-router-dom';

import '../assets/css/main.css';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>

        <button className="nav-btn" onClick={() => setShowLogin(true)}>
          Login
        </button>
        <button className="nav-btn" onClick={() => setShowRegister(true)}>
          Register
        </button>

        <Link to="/profile">Profile</Link>
      </nav>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <AuthModals show={showRegister} handleClose={() => setShowRegister(false)} />
    </>
  );
};

export default Navbar;
