import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginModal from '../pages/Login';
import AuthModals from '../pages/Register';
import '../App.css';
import '../assets/css/main.css';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulated login state

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 170) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={scrolled ? "scrolled px-4 py-2 fixed-top" : "test px-4 py-2 fixed-top"}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Left: Logo + Main Navigation */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-dark d-lg-none me-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <NavLink className="navbar-brand fw-bold text-white" to="/">
              GoGreenX
            </NavLink>
            
            {/* Desktop Main Navigation */}
            <ul className="navbar-nav flex-row d-none d-lg-flex ms-4">
              <li className="nav-item mx-2">
                <NavLink 
                  to="/training" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  Training
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink 
                  to="/nutrition" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  Nutrition
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink 
                  to="/forum" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  Forum
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Right: User Navigation + Auth */}
          <div className="d-flex align-items-center gap-3">
            {/* Show Login/Register for logged-in users */}
            {isLoggedIn ? (
              <>
                <button
                  className="btn btn-link text-white text-decoration-none"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button
                  className="btn btn-link text-white text-decoration-none"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                className="btn btn-link text-white text-decoration-none"
                onClick={() => setIsLoggedIn(false)} // Simulate logout
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Offcanvas Sidebar */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="sidebarMenu"
          aria-labelledby="sidebarMenuLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="sidebarMenuLabel">GoGreenX</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink 
                  to="/training" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Training
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/nutrition" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Nutrition
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/forum" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Forum
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/actions" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Actions
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/fitness-plan" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Fitness Plan
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `sidebar-link nav-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  Profile
                </NavLink>
              </li>
              <hr className="bg-secondary my-3" />
              <li className="nav-item">
                <button
                  className="sidebar-link nav-link btn btn-link"
                  onClick={() => {
                    setShowLogin(true);
                    document.querySelector('[data-bs-dismiss="offcanvas"]').click();
                  }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="sidebar-link nav-link btn btn-link"
                  onClick={() => {
                    setShowRegister(true);
                    document.querySelector('[data-bs-dismiss="offcanvas"]').click();
                  }}
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
}

export default Navbar;