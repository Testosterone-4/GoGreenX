import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/css/registerStyles.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

const AuthModals = ({ show, handleClose }) => {
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    address: "",
    phone: "",
    age: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [error, setError] = useState(null);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/auth/users/', {
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
        re_password: signupData.re_password,
        first_name: signupData.first_name,
        last_name: signupData.last_name,
        address: signupData.address,
      });
      // Auto-login after signup
      const loginResponse = await axios.post('http://localhost:8000/auth/token/login/', {
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem('token', loginResponse.data.auth_token);
      handleClose();
    } catch (error) {
      console.error('Signup failed:', error);
      if (error.response?.data) {
        const errors = error.response.data;
        const errorMessages = Object.keys(errors)
          .map(key => `${key}: ${errors[key].join(', ')}`)
          .join('; ');
        setError(errorMessages || 'Failed to sign up');
      } else {
        setError('Failed to sign up');
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post('http://localhost:8000/social/complete/google-oauth2/', {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem('token', response.data.auth_token);
        handleClose();
      } catch (error) {
        console.error('Google Sign Up Failed:', error);
        setError('Google Sign Up Failed');
      }
    },
    onError: () => {
      console.log("Google Sign Up Failed");
      setError('Google Sign Up Failed');
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
          <Modal.Title>Sign Up for Go Green X</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ggx-modal-body">
          <p className="text-muted">
            Create your account to start your wellness journey 🌱
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="first_name"
                placeholder="First Name"
                value={signupData.first_name}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={signupData.last_name}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={signupData.username}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="address"
                placeholder="Address"
                value={signupData.address}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                name="age"
                placeholder="Age"
                value={signupData.age}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="re_password"
                placeholder="Confirm Password"
                value={signupData.re_password}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="ggx-btn w-100">
              Sign Up
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
            Sign up with Google
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthModals;