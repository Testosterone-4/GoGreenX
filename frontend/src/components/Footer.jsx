import React from "react";
import logo from "../assets/images/gogreenx_logo.png";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto py-3 shadow-lg">
      <div className="container">
        {/* Top Section - Logo and Social */}
        <div className="row align-items-center">
          <div className="col-8 col-sm-4 mb-3 mb-sm-0">
            <div className="d-flex align-items-center">
              <img
                src={logo}
                alt="GoGreenX Logo"
                className="img-fluid"
                style={{ maxHeight: "40px", width: "auto", marginRight: "10px" }}
              />
              <h5 className="m-0 fw-bold text-white">GoGreenX</h5>
            </div>
          </div>
          
          <div className="col-4 col-sm-8 text-end">
            <div className="d-flex justify-content-end gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-5 social-icon"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-5 social-icon"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-5 social-icon"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section - Tagline and Contact */}
        <div className="row mt-2">
          <div className="col-12 col-sm-6 mb-3 mb-sm-0">
            <p className="small text-muted mb-1">
              Empowering sustainable and healthy lifestyles.
            </p>
            <div className="d-sm-none">
              <h6 className="fw-semibold mb-0">Train Smarter. <span className="fw-light text-muted">Go Greener.</span></h6>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 text-sm-end">
            <p className="small mb-1">
              Email:{" "}
              <a
                href="mailto:support@gogreenx.com"
                className="text-light text-decoration-underline"
              >
                support@gogreenx.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary my-2" />

        {/* Bottom Section - Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} GoGreenX. All rights reserved. Made with 💚 by GoGreenX Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;