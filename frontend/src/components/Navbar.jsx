import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginModal from "../pages/Login";
import AuthModals from "../pages/Register";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/images/gogreenx_logo.png";
import "../assets/css/navbarStyles.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const Motion = motion.div;

  const closeSidebar = () => {
    const offcanvasEl = document.getElementById("sidebarMenu");

    if (offcanvasEl) {
      const offcanvasInstance =
        window.bootstrap?.Offcanvas.getInstance(offcanvasEl) ||
        new window.bootstrap.Offcanvas(offcanvasEl);
      offcanvasInstance.hide();
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const res = await axios.get("http://localhost:8000/auth/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/");
  };

  const isLoggedIn = !!user;

  useEffect(() => {
    const sidebar = document.getElementById("sidebarMenu");
    const toggleBtn = document.querySelector(".sidebar-toggle-btn");

    const handleShow = () => toggleBtn.classList.add("d-none");
    const handleHide = () => toggleBtn.classList.remove("d-none");

    if (sidebar) {
      sidebar.addEventListener("shown.bs.offcanvas", handleShow);
      sidebar.addEventListener("hidden.bs.offcanvas", handleHide);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("shown.bs.offcanvas", handleShow);
        sidebar.removeEventListener("hidden.bs.offcanvas", handleHide);
      }
    };
  }, []);

  return (
    <>
      <nav className="navbar px-4 py-2 navbar-custom fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="d-lg-none me-2 btn btn-light shadow-sm rounded-circle p-2 sidebar-toggle-btn custom-toggle"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
            >
              <Menu size={22} color="#4CAF50" />
            </button>

            <NavLink className="navbar-brand fw-bold px-3 py-2 rounded" to="/">
              <img
                src={logo}
                alt="logo"
                style={{ width: "70px", height: "70px" }}
              />
            </NavLink>
          </div>

          {/* Desktop nav items */}
          <div className="d-none d-lg-flex align-items-center gap-3 me-4">
            {isLoggedIn ? (
              <>
                <ul className="navbar-nav flex-row me-3">
                  {["training", "nutrition", "community"].map((route) => (
                    <li className="nav-item mx-2" key={route}>
                      <NavLink
                        to={`/${route}`}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active" : ""}`
                        }
                      >
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="d-flex align-items-center">
                  {["dashboard", "actions", "fitness-plan", "profile"].map(
                    (route) => (
                      <NavLink
                        key={route}
                        to={`/${route}`}
                        className={({ isActive }) =>
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

                <motion.div
                  className="navbar-user-greeting flex"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.09,
                      },
                    },
                  }}
                >
                  {`Hi, ${user.username}`.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: -5 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                <button className="navbar-logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <ul className="navbar-nav flex-row me-3">
                  {["training", "nutrition"].map((route) => (
                    <li className="nav-item mx-2" key={route}>
                      <NavLink
                        to={`/${route}`}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active" : ""}`
                        }
                      >
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <button
                  className="navbar-auth-btn"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-info navbar-register-btn"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="sidebarMenu"
          aria-labelledby="sidebarMenuLabel"
          style={{ height: "100vh" }}
        >
          <div className="offcanvas-header">
            <NavLink className="navbar-brand fw-bold px-3 py-2 rounded" to="/">
              <img
                src={logo}
                alt="logo"
                style={{ width: "70px", height: "70px" }}
              />
            </NavLink>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            {isLoggedIn && (
              <motion.span
                className="navbar-user-greeting mb-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Hi, {user.username}
              </motion.span>
            )}
            <ul className="nav flex-column pt-3">
              {isLoggedIn
                ? [
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
                        className={({ isActive }) =>
                          `sidebar-link nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={closeSidebar}
                      >
                        {route
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </NavLink>
                    </li>
                  ))
                : ["training", "nutrition"].map((route) => (
                    <li className="nav-item" key={route}>
                      <NavLink
                        to={`/${route}`}
                        className={({ isActive }) =>
                          `sidebar-link nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={closeSidebar}
                      >
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </NavLink>
                    </li>
                  ))}

              <hr className="bg-secondary my-3" />

              {isLoggedIn ? (
                <li className="nav-item">
                  <button
                    className="sidebar-link nav-link btn btn-link"
                    style={{ color: "red" }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="sidebar-link nav-link btn btn-link"
                      onClick={() => {
                        setShowLogin(true);
                        setTimeout(() => closeSidebar(), 100);
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
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        onAuthSuccess={() => {
          getUserInfo();
          setShowLogin(false);
        }}
      />
      <AuthModals
        show={showRegister}
        handleClose={() => setShowRegister(false)}
        onAuthSuccess={() => {
          getUserInfo();
          setShowRegister(false);
        }}
      />
    </>
  );
};

export default Navbar;
