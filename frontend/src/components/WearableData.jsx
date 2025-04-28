import React, { useState, useEffect } from 'react';
  import { Container, Card, Button, ListGroup, Alert } from 'react-bootstrap';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
const API_HOST = import.meta.env.VITE_API_HOST;
  const WearableData = () => {
    const [healthData, setHealthData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_HOST}/api/wearables/data/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setHealthData(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch health data');
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const handleSync = async (provider) => {
      try {
        await axios.post(
          `${API_HOST}/api/wearables/sync/`,
          { provider },
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        await fetchData();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to sync health data');
      }
    };

    return (
      <Container className="mt-5" style={{ maxWidth: '600px' }}>
        <h2>Wearable Health Data</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card>
          <Card.Body>
            <div className="mb-3">
              <Button
                variant="info"
                onClick={() => handleSync('google')}
                className="me-2"
              >
                Sync Google Fit (Amazfit, Garmin, etc.)
              </Button>
              <Button
                variant="info"
                onClick={() => handleSync('apple')}
              >
                Sync Apple Health
              </Button>
            </div>
            {healthData.length > 0 ? (
              <ListGroup>
                {healthData.map((data) => (
                  <ListGroup.Item key={data.id}>
                    <strong>Date:</strong> {data.date}<br />
                    <strong>Steps:</strong> {data.steps}<br />
                    <strong>Heart Rate:</strong> {data.heart_rate || 'N/A'} bpm<br />
                    <strong>Calories:</strong> {data.calories} kcal<br />
                    <strong>Sleep:</strong> {data.sleep_hours || 'N/A'} hours
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No health data available. Connect a wearable to start tracking.</p>
            )}
          </Card.Body>
        </Card>
        <Button
          variant="link"
          onClick={() => navigate('/wearable/connect')}
          className="mt-3"
        >
          Connect Another Wearable
        </Button>
      </Container>
    );
  };

  export default WearableData;