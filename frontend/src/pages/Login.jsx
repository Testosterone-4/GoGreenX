import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Modal, Button, Form} from "react-bootstrap";
import "../assets/css/loginStyles.css"; // Add this file for custom styles

const LoginModal = ({ show, handleClose }) => {
  const [signinData, setSigninData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleSigninChange = (e) => {
    setSigninData({...signinData, [e.target.name]: e.target.value});
  };

  const handleSigninSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In Data:", signinData);
    handleClose();
  };

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
          <Form onSubmit={handleSigninSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="emailOrPhone"
                placeholder="Email or Phone"
                value={signinData.emailOrPhone}
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;
