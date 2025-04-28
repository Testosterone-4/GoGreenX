import React, { useState } from 'react';
  import { Form, Button, Container, Alert } from 'react-bootstrap';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
const API_HOST = import.meta.env.VITE_API_HOST;
  const WearableConnect = () => {
    const [provider, setProvider] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleConnect = async () => {
      if (!provider) {
        setError('Please select a wearable provider');
        return;
      }
      try {
        const response = await axios.post(
          `${API_HOST}/api/wearables/auth/`,
          { provider },
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        window.location.href = response.data.auth_url; // Redirect to Google OAuth
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to connect wearable');
      }
    };

    return (
      <Container className="mt-5" style={{ maxWidth: '500px' }}>
        <h2>Connect Your Wearable</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="provider" className="mb-3">
          <Form.Label>Select Wearable Provider</Form.Label>
          <Form.Control
            as="select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="">Select</option>
            <option value="google">Google Fit (Amazfit, Garmin, etc.)</option>
            <option value="apple">Apple Health</option>
          </Form.Control>
        </Form.Group>
        <Button
          variant="success"
          onClick={handleConnect}
          disabled={!provider}
          className="w-100"
        >
          Connect Wearable
        </Button>
        <Button
          variant="link"
          onClick={() => navigate('/wearable/data')}
          className="mt-3 w-100"
        >
          View Wearable Data
        </Button>
      </Container>
    );
  };

  export default WearableConnect;