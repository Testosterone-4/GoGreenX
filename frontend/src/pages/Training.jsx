import React, { useState, useEffect } from "react";
import exercisesData from "../data/exercises.json";
import "../assets/css/trainingStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import { Modal, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

const Training = () => {
  const Motion = motion.div
  const [validExercises, setValidExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const exercisesPerPage = 8;

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
      const filtered = [];

      for (const exercise of exercisesData) {
        const imagePath = `/sample/${exercise.gifUrl}`;
        const exists = await checkImageExists(imagePath);
        if (exists) filtered.push(exercise);
      }

      setValidExercises(filtered);
      setLoading(false);
    };

    filterValidExercises();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const totalPages = Math.ceil(validExercises.length / exercisesPerPage);
  const startIndex = currentPage * exercisesPerPage;
  const endIndex = startIndex + exercisesPerPage;
  const currentExercises = validExercises.slice(startIndex, endIndex);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-success fw-bold">Training Exercises</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <>
          <div className="row g-4">
            {currentExercises.map((exercise) => (
              <motion.div
                key={exercise.exerciseId}
                className="col-6 col-md-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                  <img
                    src={`/sample/${exercise.gifUrl}`}
                    className="card-img-top"
                    alt={exercise.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/sample/placeholder.gif";
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-capitalize fw-semibold text-success">
                      {exercise.name}
                    </h6>
                    <p className="card-text small mb-1">
                      <strong>Body:</strong> {exercise.bodyParts.join(", ")}
                    </p>
                    <p className="card-text small mb-2">
                      <strong>Muscle:</strong> {exercise.targetMuscles.join(", ")}
                    </p>
                    <Button
                      variant="outline-success"
                      className="mt-auto"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      More Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center mt-4 flex-wrap"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link text-success border-success"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link text-success"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link text-success"}
            activeClassName={"active bg-success text-white rounded-2"}
          />
        </>
      )}

      {selectedExercise && (
        <Modal
          show={true}
          onHide={() => setSelectedExercise(null)}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="text-success fw-bold">
              {selectedExercise.name.charAt(0).toUpperCase() +
                selectedExercise.name.slice(1)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={`/sample/${selectedExercise.gifUrl}`}
              alt={selectedExercise.name}
              style={{ width: "100%", borderRadius: "12px", marginBottom: "1rem" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/sample/placeholder.gif";
              }}
            />
            <p><strong>Body Part:</strong> {selectedExercise.bodyParts.join(", ")}</p>
            <p><strong>Target Muscles:</strong> {selectedExercise.targetMuscles.join(", ")}</p>
            <p><strong>Equipment:</strong> {selectedExercise.equipments.join(", ")}</p>
            <p><strong>Secondary Muscles:</strong> {selectedExercise.secondaryMuscles?.join(", ") || "N/A"}</p>
            <p><strong>Instructions:</strong></p>
            <div>{selectedExercise.instructions?.map((step, i) => <p key={i}>{step}</p>)}</div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Training;
