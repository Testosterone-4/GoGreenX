import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  return (
    <nav className="navbar px-4 py-2 navbar-custom">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Left: (mobile only) + Logo */}
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
          <Link className="navbar-brand fw-bold text-white" to="/">
            FREELETICS
          </Link>
        </div>

        {/* Center: Tabs (only visible on large screens) */}
        <ul className="navbar-nav flex-row d-none d-lg-flex">
          <li className="nav-item mx-2">
            <Link className="sidebar-link" to="/training">Training</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="sidebar-link" to="/nutrition">Nutrition</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="sidebar-link" to="/forum">Forum</Link>
          </li>
        </ul>

        {/* Right: Language + Start now button */}
        <div className="d-flex align-items-center">
          <span className="text-white me-3">EN</span>
          <button className="btn btn-light">Start now →</button>
        </div>
      </div>

      {/* Offcanvas Sidebar (mobile only) */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarMenuLabel">FREELETICS</h5>
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
              <Link to="/training" className="sidebar-link">Training</Link>
            </li>
            <li className="nav-item">
              <Link to="/nutrition" className="sidebar-link">Nutrition</Link>
            </li>
            <li className="nav-item">
              <Link to="/forum" className="sidebar-link">Forum</Link>
            </li>
            <hr className="bg-secondary my-3" />
            <li className="nav-item">
              <Link to="/login" className="sidebar-link">Log In</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
