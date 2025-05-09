import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';  // <-- Added import for BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="354038241485-rueb7dvachumoq31vj6s6hq9l50b2u5a.apps.googleusercontent.com">
      <Router>  {/* <-- Wrap your App with BrowserRouter */}
        <App />
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
