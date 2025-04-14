import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Modal, Button, Form} from "react-bootstrap";
import "../assets/css/registerStyles.css";

const AuthModals = ({show, handleClose}) => {
  const [signupData, setSignupData] = useState({
    name: "",
    address: "",
    phone: "",
    age: "",
    email: "",
    password: "",
  });

  const handleSignupChange = (e) => {
    setSignupData({...signupData, [e.target.name]: e.target.value});
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up Data:", signupData);
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
          <Modal.Title>Sign Up for Go Green X</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ggx-modal-body">
          <p className="text-muted">
            Create your account to start your wellness journey 🌱
          </p>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
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
            <Button type="submit" className="ggx-btn w-100">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthModals;
