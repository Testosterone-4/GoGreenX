import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/css/loginStyles.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

const LoginModal = ({ show, handleClose }) => {
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/auth/token/login/', {
        email: signinData.email,
        password: signinData.password,
      });
      localStorage.setItem('token', response.data.auth_token);
      handleClose();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.non_field_errors?.[0] || 'Invalid credentials');
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post('http://localhost:8000/social/login/google-oauth2/', {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem('token', response.data.auth_token);
        handleClose();
      } catch (error) {
        console.error('Google Sign In Failed:', error);
        setError('Google Sign In Failed');
      }
    },
    onError: () => {
      console.log("Google Sign In Failed");
      setError('Google Sign In Failed');
    },
  });

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="ggx-modal-header">
          <Modal.Title>Sign In to Go Green X</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ggx-modal-body">
          <p className="text-muted">Your wellness journey starts here 🌿</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSigninSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={signinData.email}
                onChange={handleSigninChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={signinData.password}
                onChange={handleSigninChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="ggx-btn w-100">
              Sign In
            </Button>
          </Form>

          <div className="text-center my-3">or</div>

          <Button onClick={login} className="ggx-google-btn w-100 mt-2">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width="20"
              height="20"
              className="me-2"
            />
            Sign in with Google
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;