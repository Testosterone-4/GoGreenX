import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1E2A30', color: '#adb5bd' }} className="pt-4 pb-3 mt-auto">
      <div className="container px-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Green Living Hub</h5>
            <p className="small">
              Helping you live healthier and more sustainably.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-white">Legal</h6>
            <ul className="list-unstyled">
              <li><a href="/training" className="text-decoration-none text-light footer-link">Terms</a></li>
              <li><a href="/nutrition" className="text-decoration-none text-light footer-link">Privacy & Cookies</a></li>
              <li><a href="/forum" className="text-decoration-none text-light footer-link">Imprint</a></li>

            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-white">Contact</h6>
            <p className="small">Email: support@greenhub.com</p>
            <p className="small">© {new Date().getFullYear()} Green Living Hub</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
