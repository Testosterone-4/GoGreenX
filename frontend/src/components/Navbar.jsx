import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import LoginModal from "../pages/Login";
import AuthModals from "../pages/Register";
import { Menu } from "lucide-react";
import logo from '../assets/images/gogreenx_logo.png';
import "../assets/css/navbarStyles.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const closeSidebar = () => {
    const offcanvasEl = document.getElementById("sidebarMenu");
    const offcanvasInstance =
      window.bootstrap?.Offcanvas.getInstance(offcanvasEl);
    offcanvasInstance?.hide();
  };

  return (
    <>
      <nav className="navbar px-4 py-2 navbar-custom fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left: Logo + Main Navigation */}
          <div className="d-flex align-items-center">
          <button
  className="d-lg-none me-2 sidebar-toggle-btn"
  type="button"
  data-bs-toggle="offcanvas"
  data-bs-target="#sidebarMenu"
  aria-controls="sidebarMenu"
>
  <Menu size={28} color="#4CAF50" />
</button>
            <NavLink
              className="navbar-brand fw-bold px-3 py-2 rounded"
              to="/"
            >
              <img src={logo} alt="logo" style={{ width: '70px', height: '70px' }} />

            </NavLink>

            {/* Desktop Main Navigation */}
            <ul className="navbar-nav flex-row d-none d-lg-flex ms-4">
              {["training", "nutrition", "forum"].map((route) => (
                <li className="nav-item mx-2" key={route}>
                  <NavLink
                    to={`/${route}`}
                    className={({isActive}) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {route.charAt(0).toUpperCase() + route.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: User Navigation + Auth */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-flex align-items-center me-4">
              {["dashboard", "actions", "fitness-plan", "profile"].map(
                (route) => (
                  <NavLink
                    key={route}
                    to={`/${route}`}
                    className={({isActive}) =>
                      `nav-link mx-2 ${isActive ? "active" : ""}`
                    }
                  >
                    {route
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </NavLink>
                )
              )}
            </div>

            <span className="text-white">EN</span>
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
            <button className="btn btn-light">Start now →</button>
          </div>
        </div>

        {/* Mobile Offcanvas Sidebar */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="sidebarMenu"
          aria-labelledby="sidebarMenuLabel"
          style={{height: "100vh"}}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="sidebarMenuLabel">
              GoGreenX
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav flex-column">
              {[
                "training",
                "nutrition",
                "forum",
                "dashboard",
                "actions",
                "fitness-plan",
                "profile",
              ].map((route) => (
                <li className="nav-item" key={route}>
                  <NavLink
                    to={`/${route}`}
                    className={({isActive}) =>
                      `sidebar-link nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={closeSidebar}
                  >
                    {route
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </NavLink>
                </li>
              ))}
              <hr className="bg-secondary my-3" />
              <li className="nav-item">
                <button
                  className="sidebar-link nav-link btn btn-link"
                  onClick={() => {
                    setShowLogin(true);
                    closeSidebar();
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
                    closeSidebar();
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
      <AuthModals
        show={showRegister}
        handleClose={() => setShowRegister(false)}
      />
    </>
  );
};

export default Navbar;
