import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BsTrophyFill,
  BsStarFill,
  BsBellFill,
  BsArrowUpRight,
  BsLightningFill,
  BsCheckCircle,
  BsFire,
  BsAward,
  BsPeopleFill,
} from "react-icons/bs";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ProgressBar,
  ListGroup,
  Button,
  Spinner,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    points: 0,
    badges: [],
    leaderboard: [],
    transactions: [],
    notifications: [],
  });
  const [activeTab, setActiveTab] = useState("activity");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const endpoints = [
        "/api/points/",
        "/api/badges/",
        "/api/leaderboard/",
        "/api/transactions/",
        "/api/notifications/",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          axios.get(`http://localhost:8000${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setDashboardData({
        points: responses[0].data.total_points,
        badges: responses[1].data,
        leaderboard: responses[2].data,
        transactions: responses[3].data,
        notifications: responses[4].data.filter((n) => !n.is_read),
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:8000/api/notifications/${notificationId}/mark-as-read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/api/notifications/mark-all-read/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your achievements...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold text-gradient">
            <BsTrophyFill className="me-2" />
            Your Achievements
          </h1>
          <p className="text-muted">
            Track your progress and celebrate your wins!
          </p>
        </Col>
      </Row>

      {/* Points Summary */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <BsStarFill className="text-primary fs-3" />
                </div>
                <div>
                  <h3 className="mb-0">{dashboardData.points}</h3>
                  <p className="text-muted mb-0">Total Points</p>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Next Milestone</h6>
                  <small className="text-muted">
                    {Math.max(0, 1000 - dashboardData.points)} points to next
                    level
                  </small>
                </div>
                <Badge bg="primary" pill>
                  Level {Math.floor(dashboardData.points / 1000) + 1}
                </Badge>
              </div>
              <ProgressBar
                now={(dashboardData.points % 1000) / 10}
                variant="primary"
                className="mt-3"
                animated
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                  <BsFire className="text-warning fs-3" />
                </div>
                <div>
                  <h3 className="mb-0">7</h3>
                  <p className="text-muted mb-0">Day Streak</p>
                </div>
              </div>
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => setActiveTab("leaderboard")}
              >
                View Leaderboard <BsArrowUpRight />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="activity" title="Recent Activity">
          <Row>
            <Col md={6}>
              <Card className="shadow border-0 mb-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <BsLightningFill className="text-primary me-2" />
                    <h4 className="mb-0">Point Transactions</h4>
                  </div>
                  <ListGroup variant="flush">
                    {dashboardData.transactions
                      .slice(0, 5)
                      .map((transaction) => (
                        <ListGroup.Item
                          key={transaction.id}
                          className="border-0"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">
                                {transaction.source === "task"
                                  ? "Task Completed"
                                  : transaction.source === "sustainability"
                                  ? "Eco Action"
                                  : "Bonus"}
                              </h6>
                              <small className="text-muted">
                                {formatDistanceToNow(
                                  new Date(transaction.timestamp)
                                )}{" "}
                                ago
                              </small>
                            </div>
                            <Badge bg="success" pill>
                              +{transaction.amount} pts
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <BsBellFill className="text-info me-2" />
                      <h4 className="mb-0">Notifications</h4>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <ListGroup variant="flush">
                    {dashboardData.notifications.length > 0 ? (
                      dashboardData.notifications.map((notification) => (
                        <ListGroup.Item
                          key={notification.id}
                          className={`border-0 ${
                            notification.is_read ? "" : "bg-light"
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{notification.message}</h6>
                              <small className="text-muted">
                                {formatDistanceToNow(
                                  new Date(notification.created_at)
                                )}{" "}
                                ago
                              </small>
                            </div>
                            {!notification.is_read && (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() =>
                                  markNotificationAsRead(notification.id)
                                }
                              >
                                <BsCheckCircle />
                              </Button>
                            )}
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-center py-4 text-muted">
                        No new notifications
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="badges" title="Your Badges">
          <Card className="shadow border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">
                  <BsAward className="me-2 text-warning" />
                  Badge Collection
                </h4>
                <Badge bg="light" text="dark">
                  {dashboardData.badges.length} earned
                </Badge>
              </div>
              {dashboardData.badges.length === 0 ? (
                <div className="text-center py-4">
                  <div className="display-4 text-muted mb-3">🏆</div>
                  <h5>No badges yet</h5>
                  <p className="text-muted">
                    Complete tasks to earn your first badge!
                  </p>
                </div>
              ) : (
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                  {dashboardData.badges.map((badge) => (
                    <Col key={badge.id}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center">
                          <img
                            src={badge.icon}
                            alt={badge.name}
                            className="img-fluid mb-2"
                            style={{ height: "80px" }}
                          />
                          <h6 className="mb-1">{badge.name}</h6>
                          <small className="text-muted d-block">
                            {badge.description}
                          </small>
                          {/* <small className="text-muted">
                            Earned{" "}
                            {formatDistanceToNow(new Date(badge.awarded_at))}{" "}
                            ago
                          </small> */}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="leaderboard" title="Leaderboard">
          <Card className="shadow border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">
                  <BsPeopleFill className="me-2 text-primary" />
                  Top Performers
                </h4>
                <Badge bg="light" text="dark">
                  Updated {formatDistanceToNow(new Date())} ago
                </Badge>
              </div>
              <ListGroup variant="flush">
                {dashboardData.leaderboard.map((user, index) => (
                  <ListGroup.Item
                    key={user.user?.id || index}
                    className="border-0"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="me-3" style={{ width: "30px" }}>
                          {index === 0 ? (
                            <BsTrophyFill className="text-warning fs-4" />
                          ) : (
                            <span className="text-muted">#{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h6 className="mb-0">
                            {user.user?.username || "Anonymous"}
                            {index < 3 && (
                              <Badge bg="primary" className="ms-2">
                                Top {index + 1}
                              </Badge>
                            )}
                          </h6>
                          <small className="text-muted">
                            Level {Math.floor(user.total_points / 1000) + 1}
                          </small>
                        </div>
                      </div>
                      <Badge bg="light" text="dark" pill>
                        {user.total_points} pts
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;
