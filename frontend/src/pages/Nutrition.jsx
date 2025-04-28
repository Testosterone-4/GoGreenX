import { useState, useEffect } from "react";
import {
  Modal,
  Spinner,
  Badge,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";
import "../assets/css/nutritionStyles.css";

const Nutrition = () => {
  const Motion = motion.div;

  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    filterMeals();
  }, [meals, searchQuery, selectedCategory]); // eslint-disable-line

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedCategory]);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      const fetchedMeals = response.data.meals || [];
      setMeals(fetchedMeals);
      const uniqueCategories = [
        ...new Set(fetchedMeals.map((meal) => meal.strCategory)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to load meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterMeals = () => {
    let filtered = meals;

    if (searchQuery) {
      filtered = filtered.filter((meal) =>
        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (meal) => meal.strCategory === selectedCategory
      );
    }

    setFilteredMeals(filtered);
  };

  const handleMealClick = async (meal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const mealDetails = response.data.meals ? response.data.meals[0] : null;
      setSelectedMeal(mealDetails);
    } catch (err) {
      console.error("Error fetching meal details:", err);
      setError("Failed to load meal details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  const getIngredients = (meal) => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure || ""} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // Pagination logic
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  return (
    <div className="nutrition-page bg-gray-50">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge bg-success bg-opacity-10 text-success mb-3">
            NUTRITION LIBRARY
          </span>
          <h2 className="display-5 fw-bold mb-3">
            Discover Healthy <span className="text-success">Meals</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Explore nutritious recipes and their detailed ingredients
          </p>
        </div>

        {/* Loader */}
        {loading && !selectedMeal && (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted">Loading meals...</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && !error && (
          <>
            {/* Filters */}
            <div className="row mb-4 g-3 align-items-end" data-aos="fade-up">
              <div className="col-md-6">
                <InputGroup className="shadow-sm rounded-pill">
                  <InputGroup.Text className="bg-white border-end-0 ps-4">
                    <FiSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search meals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-start-0 py-3"
                  />
                  {searchQuery && (
                    <Button
                      variant="light"
                      onClick={() => setSearchQuery("")}
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="py-3"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </div>

              {(searchQuery || selectedCategory !== "All") && (
                <div className="col-12">
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">
                      Showing {filteredMeals.length} results
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

            {/* No Results */}
            {filteredMeals.length === 0 ? (
              <div className="text-center py-5 my-5" data-aos="fade-up">
                <img
                  src="/sample/no-results.svg"
                  alt="No results"
                  style={{ width: "150px", opacity: 0.7 }}
                />
                <h5 className="mt-3 text-muted">No meals found</h5>
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
                {/* Meals Grid */}
                <div className="row g-4">
                  {currentMeals.map((meal, index) => (
                    <Motion
                      key={meal.idMeal}
                      className="col-6 col-md-4 col-lg-3"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden meal-card">
                        <div className="meal-image-container">
                          <img
                            src={meal.strMealThumb}
                            className="card-img-top meal-image"
                            alt={meal.strMeal}
                            loading="lazy"
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="text-capitalize fw-bold mb-2">
                            {meal.strMeal}
                          </Card.Title>
                          <div className="mb-3">
                            <Badge
                              bg="success"
                              className="me-1 mb-1 bg-opacity-10 text-success"
                            >
                              {meal.strCategory}
                            </Badge>
                            {meal.strArea && (
                              <Badge
                                bg="success"
                                className="me-1 mb-1 bg-opacity-10 text-success"
                              >
                                {meal.strArea}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline-success"
                            className="mt-auto align-self-start rounded-pill px-3 d-flex align-items-center hover-effect"
                            onClick={() => handleMealClick(meal)}
                          >
                            View <FiChevronRight className="ms-1" />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Motion>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 && "disabled"
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            ←
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === totalPages && "disabled"
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            →
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Modal */}
        <Modal
          show={!!selectedMeal}
          onHide={handleCloseModal}
          backdrop="static"
          centered
          size="lg"
          className="meal-modal"
        >
          {selectedMeal && (
            <>
              <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold text-capitalize">
                  {selectedMeal.strMeal}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" variant="success" />
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={selectedMeal.strMealThumb}
                        alt={selectedMeal.strMeal}
                        className="img-fluid rounded-3 shadow-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h6 className="fw-bold d-flex align-items-center text-success mb-3">
                          <FiInfo className="me-2" />
                          Meal Details
                        </h6>
                        <ul className="list-unstyled small">
                          <li className="mb-2">
                            <strong>Category:</strong>{" "}
                            <span className="text-muted">
                              {selectedMeal.strCategory || "N/A"}
                            </span>
                          </li>
                          <li className="mb-2">
                            <strong>Cuisine:</strong>{" "}
                            <span className="text-muted">
                              {selectedMeal.strArea || "N/A"}
                            </span>
                          </li>
                          {selectedMeal.strTags && (
                            <li className="mb-2">
                              <strong>Tags:</strong>{" "}
                              <span className="text-muted">
                                {selectedMeal.strTags.split(",").join(", ")}
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h6 className="fw-bold d-flex align-items-center text-success mb-3">
                          Ingredients
                        </h6>
                        <ul className="ps-3 small">
                          {getIngredients(selectedMeal).map(
                            (ingredient, index) => (
                              <li key={index} className="mb-2">
                                {ingredient}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold d-flex align-items-center text-success mb-3">
                        Instructions
                      </h6>
                      <p className="small">
                        {selectedMeal.strInstructions.split(". ").map(
                          (step, index) =>
                            step.trim() && (
                              <span key={index} className="d-block mb-2">
                                {step.trim()}.
                              </span>
                            )
                        )}
                      </p>

                      {selectedMeal.strYoutube && (
                        <div className="mt-4 text-center">
                          <a
                            href={selectedMeal.strYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success rounded-pill px-4"
                          >
                            Watch Recipe Video
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="border-0">
                <Button
                  variant="success"
                  onClick={handleCloseModal}
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

export default Nutrition;