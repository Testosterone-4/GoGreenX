import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useGoogleLogin } from '@react-oauth/google';


const LoginModal = ({ show, handleClose }) => {
  // Define the green color as a constant to ensure consistency
  const greenColor = '#28a745';

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!show && !isClosing) {
      resetForm();
    }
  }, [show, isClosing]);

  const resetForm = () => {
    setSigninData({ email: "", password: "" });
    setErrors({});
    setIsSuccess(false);
    setShowForgotPassword(false);
    setResetEmail("");
    setResetStatus(null);
  };

  const handleModalClose = () => {
    setIsClosing(true);
    handleClose();
  };

  const handleSuccessContinue = () => {
    setIsClosing(true);
    handleClose();
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/auth/google/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        if (!response.ok) {
          throw new Error('Google authentication failed');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setIsSuccess(true);
      } catch (error) {
        console.error('Google login error:', error);
        setErrors({ general: 'Google login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setErrors({ general: 'Google login failed. Please try again.' });
    },
  });

  const requestPasswordReset = async (email) => {
    try {
      setIsLoading(true);
      setResetStatus(null);
      const response = await fetch('http://127.0.0.1:8000/auth/users/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.email?.[0] || 'Password reset request failed');
      }

      setResetStatus('success');
      setResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      setResetStatus('error');
      setErrors({ resetError: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signinData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(signinData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!signinData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/jwt/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signinData.email,
          password: signinData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
          errorData.non_field_errors?.join(' ') ||
          'Login failed. Please check your credentials.'
        );
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setIsSuccess(true);
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForgotPassword = () => (
    <>
      <h5 className="text-center mb-4">Reset Your Password</h5>
      {resetStatus === 'success' ? (
        <Alert variant="success" className="text-center">
          <Alert.Heading>Password Reset Email Sent!</Alert.Heading>
          <p>We've sent instructions to <strong>{resetEmail}</strong>. Please check your inbox.</p>
          <Button
            variant="outline-success"
            onClick={() => {
              setShowForgotPassword(false);
              setResetStatus(null);
            }}
            style={{ borderColor: greenColor, color: greenColor }}
          >
            Back to Login
          </Button>
        </Alert>
      ) : (
        <>
          <p className="text-muted mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          {errors.resetError && (
            <Alert variant="danger" className="mb-3">
              {errors.resetError}
            </Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => setShowForgotPassword(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => requestPasswordReset(resetEmail)}
              disabled={isLoading || !resetEmail}
              style={{ backgroundColor: greenColor, borderColor: greenColor }}
            >
              {isLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );

  // Custom styles for the forgot password link to make it look like it's always in hover state
  const forgotPasswordStyle = {
    color: greenColor,
    fontWeight: '600',
    fontSize: '0.95rem',
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 0 0 transparent',
    background: 'transparent',
    border: 'none',
    padding: '0',
    transition: 'color 0.15s ease-in-out',
    // Adding brightness to make the color more vivid like in hover state
    filter: 'brightness(1.1)',
    // Adding text shadow for better visibility
    textShadow: '0 0 1px rgba(40, 167, 69, 0.2)'
  };

  const renderLoginForm = () => (
    <>
      <h5 className="text-center mb-4">Sign In to Go Green X</h5>
      {isSuccess ? (
        <Alert variant="success" className="text-center">
          <Alert.Heading>Login Successful!</Alert.Heading>
          <p>Welcome back to your wellness journey 🌿</p>
          <div className="d-grid gap-2 mt-3">
            <Button
              variant="success"
              onClick={handleSuccessContinue}
              style={{ backgroundColor: greenColor, borderColor: greenColor }}
            >
              Continue
            </Button>
          </div>
        </Alert>
      ) : (
        <>
          <p className="text-muted">Your wellness journey starts here 🌿</p>

          {errors.general && (
            <Alert variant="danger" className="mb-3">
              {errors.general}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={signinData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={signinData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end mb-3">
              {/* Using a button with custom styling to look like a link with permanent hover effect */}
              <button
                type="button"
                onClick={() => {
                  setResetEmail(signinData.email);
                  setShowForgotPassword(true);
                }}
                style={forgotPasswordStyle}
                className="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-100 mb-3"
              style={{
                backgroundColor: greenColor,
                borderColor: greenColor,
                fontWeight: '500'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <div className="divider-with-text my-3">
            <span className="divider-text">or</span>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-100"
            variant="outline-primary"
            disabled={isLoading}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width="20"
              height="20"
              className="me-2"
            />
            Sign in with Google
          </Button>
        </>
      )}
    </>
  );

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
      centered
      onExited={() => {
        resetForm();
        setIsClosing(false);
      }}
    >
      <Modal.Header closeButton className="ggx-modal-header">
        <Modal.Title>
          {showForgotPassword ? 'Reset Password' : 'Sign In'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="ggx-modal-body">
        {showForgotPassword ? renderForgotPassword() : renderLoginForm()}
      </Modal.Body>
      <style>
        {`
          /* Additional CSS to enhance the "Forgot password?" link */
          .forgot-password-link:hover {
            color: ${greenColor} !important;
            filter: brightness(1.2) !important;
          }
          .forgot-password-link:focus {
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
          }
        `}
      </style>
    </Modal>
  );
};

export default LoginModal;