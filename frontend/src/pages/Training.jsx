import React, { useState, useEffect, useMemo } from "react";
import exercisesData from "../data/exercises.json";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import {
  Modal,
  Button,
  Spinner,
  Badge,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";
import "../assets/css/trainingStyles.css";

const Training = () => {
  const Motion = motion.div;

  const [validExercises, setValidExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const exercisesPerPage = 8;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");

  const allTargetMuscles = useMemo(() => {
    const muscles = new Set();
    exercisesData.forEach((ex) => {
      ex.targetMuscles.forEach((muscle) => muscles.add(muscle));
    });
    return ["All", ...Array.from(muscles).sort()];
  }, []);

  const checkImageExists = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });

  useEffect(() => {
    const filterValidExercises = async () => {
      setLoading(true);
      const checks = await Promise.all(
        exercisesData.map(async (exercise) => {
          const imagePath = `/sample/${exercise.gifUrl}`;
          const exists = await checkImageExists(imagePath);
          return exists ? exercise : null;
        })
      );
      setValidExercises(checks.filter(Boolean));
      setLoading(false);
    };

    filterValidExercises();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedMuscle]);

  const filteredExercises = useMemo(() => {
    return validExercises.filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMuscle =
        selectedMuscle === "All" || ex.targetMuscles.includes(selectedMuscle);
      return matchesSearch && matchesMuscle;
    });
  }, [validExercises, searchTerm, selectedMuscle]);

  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const currentExercises = useMemo(() => {
    const start = currentPage * exercisesPerPage;
    return filteredExercises.slice(start, start + exercisesPerPage);
  }, [filteredExercises, currentPage]);

  const handlePageClick = (data) => setCurrentPage(data.selected);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMuscle("All");
  };

  return (
    <div className="training-page bg-gray-50">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge bg-success bg-opacity-10 text-success mb-3">
            EXERCISE LIBRARY
          </span>
          <h2 className="display-5 fw-bold mb-3">
            Find Your Perfect <span className="text-success">Workout</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Browse through our eco-conscious exercise collection
          </p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted">Loading exercises...</p>
          </div>
        ) : (
          <>
            <div className="row mb-4 g-3 align-items-end" data-aos="fade-up">
              <div className="col-md-6">
                <InputGroup className="shadow-sm rounded-pill">
                  <InputGroup.Text className="bg-white border-end-0 ps-4">
                    <FiSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0 py-3"
                  />
                  {searchTerm && (
                    <Button
                      variant="light"
                      onClick={() => setSearchTerm("")}
                      className="border-0 bg-transparent pe-4"
                    >
                      <FiX />
                    </Button>
                  )}
                </InputGroup>
              </div>

              <div className="col-md-6">
                <InputGroup className="shadow-sm rounded-pill">
                  <InputGroup.Text className="bg-white border-end-0 ps-4">
                    <FiFilter className="text-muted" />
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedMuscle}
                    onChange={(e) => setSelectedMuscle(e.target.value)}
                    className="py-3"
                  >
                    {allTargetMuscles.map((muscle, idx) => (
                      <option key={idx} value={muscle}>
                        {muscle === "All" ? "All Muscle Groups" : muscle}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </div>

              {(searchTerm || selectedMuscle !== "All") && (
                <div className="col-12">
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">
                      Showing {filteredExercises.length} results
                    </small>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={clearFilters}
                      className="text-success text-decoration-none p-0"
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {filteredExercises.length === 0 ? (
              <div className="text-center py-5 my-5" data-aos="fade-up">
                <img
                  src="/sample/no-results.svg"
                  alt="No results"
                  style={{ width: "150px", opacity: 0.7 }}
                />
                <h5 className="mt-3 text-muted">No exercises found</h5>
                <p className="text-muted mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline-success"
                  onClick={clearFilters}
                  className="rounded-pill px-4"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {currentExercises.map((exercise, index) => (
                    <Motion
                      key={exercise.exerciseId}
                      className="col-6 col-md-4 col-lg-3"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden exercise-card">
                        <div className="exercise-image-container">
                          <img
                            src={`/sample/${exercise.gifUrl}`}
                            className="card-img-top exercise-image"
                            alt={exercise.name}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/sample/placeholder.gif";
                            }}
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="text-capitalize fw-bold mb-2">
                            {exercise.name}
                          </Card.Title>
                          <div className="mb-3">
                            {exercise.targetMuscles
                              .slice(0, 2)
                              .map((muscle, i) => (
                                <Badge
                                  key={i}
                                  bg="success"
                                  className="me-1 mb-1 bg-opacity-10 text-success"
                                >
                                  {muscle}
                                </Badge>
                              ))}
                            {exercise.targetMuscles.length > 2 && (
                              <Badge
                                bg="success"
                                className="bg-opacity-10 text-success"
                              >
                                +{exercise.targetMuscles.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline-success"
                            className="mt-auto align-self-start rounded-pill px-3 d-flex align-items-center hover-effect"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            View <FiChevronRight className="ms-1" />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Motion>
                  ))}
                </div>

                {totalPages > 1 && (
                  <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName="pagination justify-content-center mt-5"
                    pageClassName="page-item"
                    pageLinkClassName="page-link border-0 rounded-circle mx-1"
                    previousClassName="page-item"
                    previousLinkClassName="page-link border-0 rounded-circle mx-1"
                    nextClassName="page-item"
                    nextLinkClassName="page-link border-0 rounded-circle mx-1"
                    breakClassName="page-item"
                    breakLinkClassName="page-link border-0 rounded-circle mx-1"
                    activeClassName="active"
                    activeLinkClassName="bg-success border-success"
                    disabledClassName="disabled"
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Modal */}
        <Modal
          show={!!selectedExercise}
          onHide={() => setSelectedExercise(null)}
          backdrop="static"
          centered
          size="lg"
          className="exercise-modal"
        >
          {selectedExercise && (
            <>
              <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold text-capitalize">
                  {selectedExercise.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={`/sample/${selectedExercise.gifUrl}`}
                      alt={selectedExercise.name}
                      className="img-fluid rounded-3 shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/sample/placeholder.gif";
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6 className="fw-bold d-flex align-items-center text-success mb-3">
                        <FiInfo className="me-2" />
                        Exercise Details
                      </h6>
                      <ul className="list-unstyled small">
                        <li className="mb-2">
                          <strong>Body Part:</strong>{" "}
                          <span className="text-muted">
                            {selectedExercise.bodyParts.join(", ")}
                          </span>
                        </li>
                        <li className="mb-2">
                          <strong>Target Muscles:</strong>{" "}
                          <span className="text-muted">
                            {selectedExercise.targetMuscles.join(", ")}
                          </span>
                        </li>
                        <li className="mb-2">
                          <strong>Secondary Muscles:</strong>{" "}
                          <span className="text-muted">
                            {selectedExercise.secondaryMuscles?.join(", ") ||
                              "None"}
                          </span>
                        </li>
                        <li className="mb-2">
                          <strong>Equipment:</strong>{" "}
                          <span className="text-muted">
                            {selectedExercise.equipments.join(", ") || "None"}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h6 className="fw-bold d-flex align-items-center text-success mb-3">
                        Instructions
                      </h6>
                      <ol className="ps-3 small">
                        {selectedExercise.instructions?.map((step, i) => (
                          <li key={i} className="mb-2">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-0">
                <Button
                  variant="success"
                  onClick={() => setSelectedExercise(null)}
                  className="rounded-pill px-4"
                >
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Training;
