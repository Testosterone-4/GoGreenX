import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Image,
  Badge,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { BsPencil, BsGeoAlt, BsX } from "react-icons/bs";

const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user.bio || "",
    location: user.location || "",
    avatar: user.avatar || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        bio: user.bio || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await onUpdate(formData);
    setIsLoading(false);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <Card className="shadow border-0">
      <Card.Body className="p-4">
        <Row className="align-items-center mb-4">
          <Col xs={12} md={3} className="text-center mb-4 mb-md-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                roundedCircle
                fluid
                className="border border-3 border-success"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "150px", height: "150px", fontSize: "3rem" }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </Col>

          <Col xs={12} md={9}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
              <div className="mb-3 mb-md-0">
                <h2 className="fw-bold mb-1">{user.username}</h2>
                <p className="text-muted mb-2">{user.email}</p>
                {!isEditing && user.location && (
                  <div className="d-flex align-items-center text-muted">
                    <BsGeoAlt className="me-2" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
              <Button
                variant={isEditing ? "outline-danger" : "outline-success"}
                onClick={handleEditToggle}
                className="rounded-pill px-4"
              >
                {isEditing ? (
                  <>
                    <BsX className="me-1" /> Cancel
                  </>
                ) : (
                  <>
                    <BsPencil className="me-1" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>

        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about yourself..."
                className="border-0 shadow-sm"
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    className="border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Avatar URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="Paste image URL"
                    className="border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="success"
                type="submit"
                className="rounded-pill px-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">About Me</Card.Title>
                <Card.Text className="text-muted">
                  {user.bio || "No bio provided yet."}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Fitness Stats</Card.Title>
                <Row className="g-3">
                  {user.weight && (
                    <Col xs={6} md={3}>
                      <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                        <div className="text-muted small">Weight</div>
                        <div className="h4 mb-0 fw-bold text-success">
                          {user.weight} kg
                        </div>
                      </div>
                    </Col>
                  )}
                  {user.height && (
                    <Col xs={6} md={3}>
                      <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                        <div className="text-muted small">Height</div>
                        <div className="h4 mb-0 fw-bold text-success">
                          {user.height} cm
                        </div>
                      </div>
                    </Col>
                  )}
                  {user.age && (
                    <Col xs={6} md={3}>
                      <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                        <div className="text-muted small">Age</div>
                        <div className="h4 mb-0 fw-bold text-success">
                          {user.age}
                        </div>
                      </div>
                    </Col>
                  )}
                  {user.goal && (
                    <Col xs={6} md={3}>
                      <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                        <div className="text-muted small">Goal</div>
                        <div className="h4 mb-0 fw-bold text-success text-capitalize">
                          {user.goal}
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfile;