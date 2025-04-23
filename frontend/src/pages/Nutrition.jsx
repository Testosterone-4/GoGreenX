import { useState, useEffect } from 'react';
import axios from 'axios';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch meals on mount
  useEffect(() => {
    fetchMeals();
  }, []);

  // Fetch meals from TheMealDB
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      setMeals(response.data.meals || []);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch details for selected meal
  const fetchMealDetails = async (mealId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      setSelectedMeal(response.data.meals ? response.data.meals[0] : null);
    } catch (err) {
      console.error('Error fetching meal details:', err);
      setError('Failed to load meal details.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal with meal details
  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
    fetchMealDetails(meal.idMeal);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  // Extract ingredients and measures
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
      {/* <h1 className="display-5 mb-4 text-center" style={{ paddingTop: '80px'}}>Nutrition Library</h1> */}

      {loading && <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row" style={{ paddingTop: '80px'}}>
        {meals.map((meal) => (
          <div key={meal.idMeal} className="col-md-6 mb-4">
            <div className="card h-100 p-3" onClick={() => handleMealClick(meal)} style={{ cursor: 'pointer' }}>
              {meal.strMealThumb && (
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h2 className="card-title h5">{meal.strMeal}</h2>
                <p className="card-text">
                  {meal.strCategory || 'Meal'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedMeal.strMeal}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {loading && <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {selectedMeal && (
                  <>
                    {selectedMeal.strMealThumb && (
                      <img
                        src={selectedMeal.strMealThumb}
                        alt={selectedMeal.strMeal}
                        className="img-fluid mb-3"
                        style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <h6>Category</h6>
                    <p>{selectedMeal.strCategory || 'N/A'}</p>
                    <h6>Cuisine</h6>
                    <p>{selectedMeal.strArea || 'N/A'}</p>
                    <h6>Ingredients</h6>
                    <ul>
                      {getIngredients(selectedMeal).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <h6>Instructions</h6>
                    <p>{selectedMeal.strInstructions || 'N/A'}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;