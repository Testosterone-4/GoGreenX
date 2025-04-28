import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert, ProgressBar } from "react-bootstrap";
import "../assets/css/registerStyles.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API_HOST = import.meta.env.VITE_API_HOST;
const AuthModals = ({ show, handleClose }) => {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);


  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    setPasswordStrength(strength * 25);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signupData.username.trim()) newErrors.username = 'Username is required';
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(signupData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (signupData.password !== signupData.re_password) {
      newErrors.re_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_HOST}/auth/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          re_password: signupData.re_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.username) setErrors(prev => ({...prev, username: errorData.username.join(' ')}));
        if (errorData.email) setErrors(prev => ({...prev, email: errorData.email.join(' ')}));
        if (errorData.password) setErrors(prev => ({...prev, password: errorData.password.join(' ')}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setIsSuccess(true);
      setSignupData({
        username: '',
        email: '',
        password: '',
        re_password: ''
      });
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Registration error:', error);
      if (!errors.general) {
        setErrors(prev => ({...prev, general: error.message || 'Registration failed. Please try again.'}));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthVariant = () => {
    if (passwordStrength >= 75) return 'success';
    if (passwordStrength >= 50) return 'info';
    if (passwordStrength >= 25) return 'warning';
    return 'danger';
  };

  const handleGoogleSignUp = async (tokenResponse) => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${API_HOST}/api/auth/google/`,
        {
          access_token: tokenResponse.access_token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Google sign up successful:', response.data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Google sign up error:', error);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || 'Google sign up failed. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSignUp,
    onError: () => {
      console.log("Google Sign Up Failed");
      setErrors(prev => ({...prev, general: 'Google sign up failed. Please try again.'}));

    },
    flow: 'implicit' // or 'auth-code' depending on your backend requirements
  });

  return (
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
        {isSuccess ? (
          <Alert variant="success" className="text-center" onClose={() => setIsSuccess(false)} dismissible>
            <Alert.Heading>Registration Successful!</Alert.Heading>
            <p>Your account has been created successfully.</p>
            <Button
              variant="success"
              onClick={handleClose}
              className="mt-2"
            >
              Continue
            </Button>
          </Alert>
        ) : (
          <>
            <p className="text-muted">
              Create your account to start your wellness journey 🌱
            </p>

            {errors.general && (
              <Alert variant="danger" className="mb-3">
                {errors.general}
              </Alert>
            )}

            <Form onSubmit={registerUser}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>

                {signupData.password && (
                  <>
                    <ProgressBar
                      now={passwordStrength}
                      variant={getPasswordStrengthVariant()}
                      className="mt-2"
                      label={`${passwordStrength}%`}
                    />
                    <Form.Text className="text-muted">
                      Password strength: {passwordStrength >= 75 ? 'Strong' :
                                        passwordStrength >= 50 ? 'Medium' :
                                        passwordStrength >= 25 ? 'Weak' : 'Very Weak'}
                    </Form.Text>
                  </>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="re_password"
                  placeholder="Confirm password"
                  value={signupData.re_password}
                  onChange={handleSignupChange}
                  isInvalid={!!errors.re_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.re_password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="ggx-btn w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </Form>


          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModals;