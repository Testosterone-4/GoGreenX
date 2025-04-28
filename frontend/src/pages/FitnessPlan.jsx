
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FitnessForm from '../components/FitnessForm';
import TaskList from '../components/TaskList';
import "../assets/css/fitnessPlan.css";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Badge,
  Button,
  Pagination,
} from "react-bootstrap";
import { BsLightningFill, BsCheckCircle, BsArrowRepeat } from "react-icons/bs";

const API_HOST = import.meta.env.VITE_API_HOST;



const FitnessPlan = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("plan");
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);

  const refreshToken = async () => {
    try {

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');
      const response = await axios.post(`${API_HOST}/auth/jwt/refresh/`, {
        refresh: refreshToken
      });
      localStorage.setItem('accessToken', response.data.access);

      return response.data.access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
      return null;
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {

      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      const response = await axios.get(`${API_HOST}/api/tasks/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Tasks:', response.data); // Log once here

      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {

            const response = await axios.get(`${API_HOST}/api/tasks/list/`, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            console.log('Fetched Tasks (Retry):', response.data);


            setTasks(response.data);
            setError(null);
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            setError(
              retryError.response?.data?.error || "Failed to fetch tasks"
            );
            navigate("/login");
          }
        }
      } else {
        setError(error.response?.data?.error || "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlanGenerated = (data) => {
    setTasks(data.tasks);
    setCurrentPage(1); // Reset to first page when new plan is generated
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Get current tasks for pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />
    );

    // First page
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    }

    // Pages around current page
    for (
      let number = Math.max(2, currentPage - 1);
      number <= Math.min(totalPages - 1, currentPage + 1);
      number++
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
    }

    // Last page if there are more than 1 page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );

    return items;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Loading your fitness plan...</p>
      </Container>
    );
  }

  return (
    <div className="fitness-plan-page bg-gray-50">
      <Container className="py-5">
        {/* Header Section */}
        <Row className="mb-4" data-aos="fade-up">
          <Col>
            <span className="badge bg-success bg-opacity-10 text-success mb-3">
              FITNESS TRACKER
            </span>
            <h2 className="display-5 fw-bold mb-3">
              <BsLightningFill className="me-2 text-warning" />
              Your <span className="text-success">Fitness Plan</span>
            </h2>
            <p className="text-muted">
              Create and track your personalized fitness journey
            </p>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="g-4">
          <Col lg={5}>
            <Card className="shadow border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <BsCheckCircle className="text-primary fs-4" />
                  </div>
                  <h4 className="mb-0">Create New Plan</h4>
                </div>
                <FitnessForm onPlanGenerated={handlePlanGenerated} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="shadow border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                      <BsArrowRepeat className="text-warning fs-4" />
                    </div>
                    <h4 className="mb-0">Your Tasks</h4>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={fetchTasks}
                    className="rounded-pill"
                  >
                    Refresh
                  </Button>
                </div>

                {error && (
                  <Alert variant="danger" className="border-0 mb-4">
                    {error}
                  </Alert>
                )}

                {tasks.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-4 text-muted mb-3">🏋️‍♂️</div>
                    <h5>No fitness tasks yet</h5>
                    <p className="text-muted">
                      Create your first fitness plan to get started!
                    </p>
                  </div>
                ) : (
                  <>
                    <TaskList
                      tasks={currentTasks}
                      onUpdateTask={(updatedTask) => {
                        setTasks(
                          tasks.map((task) =>
                            task.id === updatedTask.id ? updatedTask : task
                          )
                        );
                      }}
                    />

                    {/* Pagination */}
                    {tasks.length > tasksPerPage && (
                      <div className="d-flex justify-content-center mt-4">
                        <Pagination className="mb-0">
                          {renderPaginationItems()}
                        </Pagination>
                      </div>
                    )}

                    {/* Task count information */}
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        Showing {indexOfFirstTask + 1}-
                        {Math.min(indexOfLastTask, tasks.length)} of{" "}
                        {tasks.length} tasks
                      </small>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FitnessPlan;
