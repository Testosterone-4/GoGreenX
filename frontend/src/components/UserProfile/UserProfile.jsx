import React, { useState } from 'react';
import { 
    Card, 
    Button, 
    Form, 
    Row, 
    Col, 
    Image,
    Badge,
    ListGroup
} from 'react-bootstrap';


const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      bio: user.bio || '',
      location: user.location || '',
      avatar: user.avatar || ''
  });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setFormData({
                bio: user.bio || '',
                location: user.location || '',
                avatar: user.avatar || ''
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(formData);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
      <Card className="shadow-lg">
          <Card.Body>
              <Row className="align-items-center mb-4">
                  <Col md={3} className="text-center mb-3 mb-md-0">
                      {user.avatar ? (
                          <Image 
                              src={user.avatar} 
                              roundedCircle 
                              fluid 
                              className="w-75"
                          />
                      ) : (
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
                              {user.username?.charAt(0).toUpperCase()}
                          </div>
                      )}
                  </Col>
                  
                  <Col md={9}>
                      <div className="d-flex justify-content-between align-items-start">
                          <div>
                              <h1 className="mb-1">{user.username}</h1>
                              <p className="text-muted mb-2">{user.email}</p>
                              <Badge bg="success" className="fs-6">
                                  {user.points} Points
                              </Badge>
                          </div>
                          <Button 
                              variant={isEditing ? "outline-danger" : "outline-primary"}
                              onClick={handleEditToggle}
                          >
                              {isEditing ? 'Cancel' : 'Edit Profile'}
                          </Button>
                      </div>
                  </Col>
              </Row>

              {isEditing ? (
                  <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                              as="textarea"
                              name="bio"
                              value={formData.bio}
                              onChange={handleChange}
                              rows={3}
                              placeholder="Tell us about yourself..."
                          />
                      </Form.Group>

                      <Row>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label>Location</Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="location"
                                      value={formData.location}
                                      onChange={handleChange}
                                      placeholder="Enter your location"
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label>Avatar URL</Form.Label>
                                  <Form.Control
                                      type="url"
                                      name="avatar"
                                      value={formData.avatar}
                                      onChange={handleChange}
                                      placeholder="Paste image URL"
                                  />
                              </Form.Group>
                          </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2">
                          <Button variant="success" type="submit">
                              Save Changes
                          </Button>
                      </div>
                  </Form>
              ) : (
                  <>
                      <Card className="mb-4">
                          <Card.Body>
                              <Card.Title>About Me</Card.Title>
                              <Card.Text>
                                  {user.bio || 'No bio provided'}
                              </Card.Text>
                              {user.location && (
                                  <div className="text-muted">
                                      <i className="bi bi-geo-alt me-2"></i>
                                      {user.location}
                                  </div>
                              )}
                          </Card.Body>
                      </Card>

                      <Card>
                          <Card.Body>
                              <Card.Title>Fitness Stats</Card.Title>
                              <Row className="g-4">
                                  {user.weight && (
                                      <Col xs={6} md={3}>
                                          <div className="text-center p-3 border rounded">
                                              <div className="text-muted small">Weight</div>
                                              <div className="h4 mb-0">{user.weight} kg</div>
                                          </div>
                                      </Col>
                                  )}
                                  {user.height && (
                                      <Col xs={6} md={3}>
                                          <div className="text-center p-3 border rounded">
                                              <div className="text-muted small">Height</div>
                                              <div className="h4 mb-0">{user.height} cm</div>
                                          </div>
                                      </Col>
                                  )}
                                  {user.age && (
                                      <Col xs={6} md={3}>
                                          <div className="text-center p-3 border rounded">
                                              <div className="text-muted small">Age</div>
                                              <div className="h4 mb-0">{user.age}</div>
                                          </div>
                                      </Col>
                                  )}
                                  {user.goal && (
                                      <Col xs={6} md={3}>
                                          <div className="text-center p-3 border rounded">
                                              <div className="text-muted small">Goal</div>
                                              <div className="h4 mb-0 text-capitalize">{user.goal}</div>
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
