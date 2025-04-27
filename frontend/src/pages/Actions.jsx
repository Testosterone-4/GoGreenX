import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  BsCheckCircle,
  BsPlusCircle,
  BsTrash,
  BsCalendar,
  BsLightningFill,
  BsPlus,
  BsStarFill,
} from "react-icons/bs";
import {
  Button,
  Card,
  Form,
  ListGroup,
  Badge,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";
import "../assets/css/actionsStyles.css";

const Actions = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [newTask, setNewTask] = useState({
    title: "",
    category: "exercise",
    due_date: format(new Date(), "yyyy-MM-dd"),
    points_rewarded: 10,
  });

  // Generate points from 10 to 100 in steps of 5
  const pointOptions = Array.from({ length: 19 }, (_, i) => 10 + i * 5);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/tasks/list/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data);
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchTasks();
  }, []);

  const handleApiError = async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        if (newToken) {
          const token = localStorage.getItem("accessToken");
          const response = await axios.request({
            ...error.config,
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
        }
      } catch {
        navigate("/login");
      }
    }
    setError(error.message || "An unexpected error occurred.");
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(
      "http://localhost:8000/auth/jwt/refresh/",
      { refresh: refreshToken }
    );
    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  };

  const handleAddTask = async (taskData) => {
    const exists = tasks.some(
      (task) =>
        task.title === taskData.title &&
        format(parseISO(task.due_date), "yyyy-MM-dd") === taskData.due_date
    );
    if (exists) {
      setError("This task already exists for the selected date.");
      return;
    }

    setLoading((prev) => ({ ...prev, addTask: true }));
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/api/tasks/list/",
        {
          ...taskData,
          points_rewarded: parseInt(taskData.points_rewarded),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTasks = await axios.get(
        "http://localhost:8000/api/tasks/list/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(updatedTasks.data);
      setNewTask({
        title: "",
        category: "exercise",
        due_date: selectedDate,
        points_rewarded: 10,
      });
      setError(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading((prev) => ({ ...prev, addTask: false }));
    }
  };

  const handleTaskComplete = async (taskId, isCompleted) => {
    setLoading((prev) => ({ ...prev, [taskId]: true }));
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:8000/api/tasks/list/${taskId}/`,
        { is_completed: !isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: !isCompleted } : task
        )
      );
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    setLoading((prev) => ({ ...prev, [taskId]: true }));
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8000/api/tasks/delete/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const filteredTasks = tasks.filter(
    (task) => format(parseISO(task.due_date), "yyyy-MM-dd") === selectedDate
  );

  const completedPoints = filteredTasks
    .filter((task) => task.is_completed)
    .reduce((sum, task) => sum + (task.points_rewarded || 0), 0);

  const totalPoints = filteredTasks.reduce(
    (sum, task) => sum + (task.points_rewarded || 0),
    0
  );

  const completionPercentage =
    totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const getCategoryColor = (category) => {
    switch (category) {
      case "exercise":
        return "primary";
      case "nutrition":
        return "success";
      case "sustainability":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="actions-page bg-gray-50">
      <Container className="py-5">
        {/* Header Section */}
        <Row className="mb-4" data-aos="fade-up">
          <Col>
            <span className="badge bg-success bg-opacity-10 text-success mb-3">
              TASK MANAGEMENT
            </span>
            <h2 className="display-5 fw-bold mb-3">
              <BsLightningFill className="me-2 text-warning" />
              Your <span className="text-success">Daily Actions</span>
            </h2>
            <p className="text-muted">
              Track and complete your eco-friendly tasks
            </p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3" data-aos="fade-up">
            <Col>
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
                className="border-0 shadow-sm"
              >
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Main Content */}
        <Row className="mb-4 g-4" data-aos="fade-up">
          <Col lg={4}>
            <Card className="shadow border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded-circle me-2">
                    <BsCalendar className="text-success" />
                  </div>
                  <h5 className="mb-0">Date Selection</h5>
                </div>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setNewTask({ ...newTask, due_date: e.target.value });
                  }}
                  className="mb-4"
                />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="mb-1">Points Progress</h6>
                    <small className="text-muted">
                      {completedPoints} of {totalPoints} points earned
                    </small>
                  </div>
                  <Badge bg="success" pill>
                    {completionPercentage}%
                  </Badge>
                </div>
                <ProgressBar
                  now={completionPercentage}
                  variant="success"
                  className="mb-4"
                  animated
                />
                <div className="d-flex align-items-center">
                  <BsStarFill className="text-warning me-2" />
                  <span className="small">
                    <strong>Daily Goal:</strong> {Math.round(totalPoints * 0.7)}{" "}
                    points
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="shadow border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded-circle me-2">
                    <BsPlusCircle className="text-success" />
                  </div>
                  <h5 className="mb-0">Add New Task</h5>
                </div>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(newTask);
                  }}
                >
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Control
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        required
                        className="border-0 shadow-sm"
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Select
                        value={newTask.category}
                        onChange={(e) =>
                          setNewTask({ ...newTask, category: e.target.value })
                        }
                        className="border-0 shadow-sm"
                      >
                        <option value="exercise">Exercise</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="sustainability">Sustainability</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select
                        value={newTask.points_rewarded}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            points_rewarded: parseInt(e.target.value),
                          })
                        }
                        required
                        className="border-0 shadow-sm"
                      >
                        {pointOptions.map((points) => (
                          <option key={points} value={points}>
                            {points} pts
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) =>
                          setNewTask({ ...newTask, due_date: e.target.value })
                        }
                        required
                        className="border-0 shadow-sm"
                      />
                    </Col>
                    <Col md={1}>
                      <Button
                        type="submit"
                        variant="success"
                        disabled={loading.addTask}
                        className="w-100 rounded-pill hover-effect"
                      >
                        {loading.addTask ? <Spinner size="sm" /> : <BsPlus />}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tasks List */}
        <Row className="mb-4" data-aos="fade-up">
          <Col>
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle me-2">
                      <BsLightningFill className="text-success" />
                    </div>
                    <h5 className="mb-0">
                      Tasks for {format(parseISO(selectedDate), "MMMM d, yyyy")}
                    </h5>
                  </div>
                  <div>
                    <Badge
                      bg="success"
                      className="bg-opacity-10 text-success me-2"
                    >
                      {filteredTasks.length} tasks
                    </Badge>
                    <Badge bg="warning" className="bg-opacity-10 text-warning">
                      <BsStarFill className="me-1" />
                      {totalPoints} pts
                    </Badge>
                  </div>
                </div>

                {filteredTasks.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-4 text-muted mb-3">📭</div>
                    <h5>No tasks for this date</h5>
                    <p className="text-muted mb-4">
                      Add a task above to get started
                    </p>
                    <Button
                      variant="outline-success"
                      className="rounded-pill px-4"
                    >
                      Create First Task
                    </Button>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {filteredTasks.map((task) => (
                      <ListGroup.Item
                        key={task.id}
                        className="d-flex justify-content-between align-items-center py-3 border-0"
                      >
                        <div className="d-flex align-items-center">
                          <Button
                            variant={
                              task.is_completed
                                ? "success"
                                : "outline-secondary"
                            }
                            size="sm"
                            className="me-3 rounded-circle"
                            onClick={() =>
                              handleTaskComplete(task.id, task.is_completed)
                            }
                            disabled={loading[task.id]}
                          >
                            {loading[task.id] ? (
                              <Spinner size="sm" />
                            ) : task.is_completed ? (
                              <BsCheckCircle />
                            ) : null}
                          </Button>
                          <div>
                            <span
                              className={
                                task.is_completed
                                  ? "text-decoration-line-through text-muted"
                                  : "fw-semibold"
                              }
                            >
                              {task.title}
                            </span>
                            <div className="d-flex mt-1">
                              <Badge
                                bg={getCategoryColor(task.category)}
                                className="me-2 bg-opacity-10"
                                text={task.category}
                              >
                                {task.category}
                              </Badge>
                              <Badge
                                bg="warning"
                                className="bg-opacity-10 text-warning"
                              >
                                <BsStarFill className="me-1" />
                                {task.points_rewarded} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={loading[task.id]}
                          className="rounded-circle"
                        >
                          <BsTrash />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Actions;
