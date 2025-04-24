import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    filterMeals();
  }, [meals, searchQuery, selectedCategory]);// eslint-disable-line react-hooks/exhaustive-deps
  

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const fetchedMeals = response.data.meals || [];
      setMeals(fetchedMeals);
      const uniqueCategories = [...new Set(fetchedMeals.map(meal => meal.strCategory))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterMeals = () => {
    let filtered = meals;

    if (searchQuery) {
      filtered = filtered.filter(meal =>
        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(meal => meal.strCategory === selectedCategory);
    }

    setFilteredMeals(filtered);
  };

  const handleMealClick = async (meal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const mealDetails = response.data.meals ? response.data.meals[0] : null;
      setSelectedMeal(mealDetails);
    } catch (err) {
      console.error('Error fetching meal details:', err);
      setError('Failed to load meal details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  return (
    <div className="container py-4">
      <div className="text-center" style={{ paddingTop: '80px' }}>
        <h1 className="display-5 mb-4">Nutrition Library</h1>

        {/* Filters */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search meals by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && !selectedMeal && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <div key={meal.idMeal} className="col-md-6 mb-4">
              <div className="card h-100 p-3" style={{ cursor: 'pointer' }}>
                {meal.strMealThumb && (
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onClick={() => handleMealClick(meal)}
                  />
                )}
                <div className="card-body">
                  <h2 className="card-title h5">{meal.strMeal}</h2>
                  <p className="card-text">{meal.strCategory || 'Meal'}</p>
                  {meal.strYoutube && (
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-danger mt-2"
                    >
                    Watch how to make it
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted fs-5 py-5">
            Sorry, we don’t have any meals in this category or search term yet.
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal
        show={!!selectedMeal}
        onHide={handleCloseModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary fw-bold">
            {selectedMeal?.strMeal}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {selectedMeal?.strMealThumb && (
                <img
                  src={selectedMeal.strMealThumb}
                  alt={selectedMeal.strMeal}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              )}

              <p><strong>Category:</strong> {selectedMeal?.strCategory || 'N/A'}</p>
              <p><strong>Cuisine:</strong> {selectedMeal?.strArea || 'N/A'}</p>

              <h6 className="mt-3">Ingredients</h6>
              {selectedMeal && (
  <>
    <h6 className="mt-3">Ingredients</h6>
    <ul>
      {getIngredients(selectedMeal).map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>
  </>
)}


              <h6 className="mt-3">Instructions</h6>
              <p>{selectedMeal?.strInstructions || 'N/A'}</p>

              {selectedMeal?.strYoutube && (
                <div className="mt-3 text-center">
                  <a
                    href={selectedMeal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-danger"
                  >
                    Watch how to make it
                  </a>
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Nutrition;
