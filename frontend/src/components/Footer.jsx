import React from "react";
import logo from "../assets/images/gogreenx_logo.png";
import "../App.css"; // Your global styles
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto py-5 shadow-sm">
      <div className="container">
        <div className="row justify-content-between align-items-start">
          {/* Brand & Logo */}
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <img
                src={logo}
                alt="Go Green X Logo"
                style={{ height: "50px", marginRight: "10px" }}
              />
              <h4 className="text-white m-0 fw-semibold">GoGreenX</h4>
            </div>
            <p className="small text-muted">
              Empowering sustainable and healthy lifestyles.
            </p>
            <div className="d-flex mx-5 gap-3 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-opacity"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-opacity"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-opacity"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Legal Links
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="text-white mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/training" className="footer-link">
                  training
                </a>
              </li>
              <li>
                <a href="/nutrition" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/forum" className="footer-link">
                  Cookie Settings
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="col-md-3">
            <h6 className="text-white mb-3">Contact</h6>
            <p className="small text-muted mb-1">
              Email:{" "}
              <a
                href="mailto:support@greenhub.com"
                className="text-decoration-none text-light"
              >
                support@greenhub.com
              </a>
            </p>
            <p className="small text-muted mb-0">
              © {new Date().getFullYear()} GoGreenX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
