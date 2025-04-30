// src/pages/DealDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DealDetails.css';

const API_BASE = 'http://localhost:7001';

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user_id'));

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // cart button state
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');

  // reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [revLoading, setRevLoading] = useState(false);
  const [revError, setRevError] = useState('');
  const [revSuccess, setRevSuccess] = useState('');

  useEffect(() => {
    // fetch deal and reviews in parallel
    const fetchDeal = axios.get(`${API_BASE}/deals/${id}`);
    const fetchRevs = axios.get(`${API_BASE}/deals/${id}/reviews`);

    Promise.all([fetchDeal, fetchRevs])
      .then(([dealRes, revRes]) => {
        if (dealRes.data.status === 200) {
          setDeal(dealRes.data.data);
        } else {
          setError(dealRes.data.message);
        }
        if (revRes.data.status === 200) {
          setReviews(revRes.data.data);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error loading data');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!deal || deal.quantity_available < 1) return;
    setCartError(''); setCartSuccess(''); setCartLoading(true);
    try {
      await axios.post(`${API_BASE}/cart/add`, {
        user_id: userId,
        food_id: deal.food_id,
        quantity: 1
      });
      setCartSuccess('Item added to cart!');
    } catch (err) {
      console.error(err);
      setCartError(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!userId) {
      setRevError('Please log in to leave a review');
      return;
    }
    setRevError(''); setRevSuccess(''); setRevLoading(true);
    try {
      await axios.post(`${API_BASE}/deals/${id}/reviews`, {
        user_id: userId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setRevSuccess('Review submitted!');
      // reload reviews
      const res = await axios.get(`${API_BASE}/deals/${id}/reviews`);
      setReviews(res.data.data);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error(err);
      setRevError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setRevLoading(false);
    }
  };

  if (loading) return <div className="deal-details__loading">Loading…</div>;
  if (error)   return <div className="deal-details__error">{error}</div>;
  if (!deal)   return <div className="deal-details__error">Deal not found</div>;

  return (
    <div className="deal-details">
      <Link className="deal-details__back" to="/deals">← Back to Deals</Link>

      <div className="deal-details__container">
        <div
          className="deal-details__image"
          style={{ backgroundImage: `url(${API_BASE}/${deal.image_url})` }}
        />

        <div className="deal-details__info">
          <h1 className="deal-details__title">{deal.name}</h1>

          <div className="deal-details__tags">
            <span className={`deal-details__tag condition-${deal.condition}`}>
              {deal.condition.replace('_',' ')}
            </span>
            <span className="deal-details__tag discount">
              -{deal.discount_percentage}%
            </span>
          </div>

          <p className="deal-details__description">{deal.description}</p>

          <div className="deal-details__pricing">
            <span className="deal-details__current">
              ${deal.current_price.toFixed(2)}
            </span>
            <span className="deal-details__original">
              ${deal.original_price.toFixed(2)}
            </span>
          </div>

          <button
            className="deal-details__action"
            onClick={handleAddToCart}
            disabled={cartLoading || deal.quantity_available < 1}
          >
            {cartLoading
              ? 'Adding…'
              : deal.quantity_available > 0
                ? 'Add to Cart'
                : 'Sold Out'}
          </button>
          {cartError   && <p className="deal-details__cart-error">{cartError}</p>}
          {cartSuccess && <p className="deal-details__cart-success">{cartSuccess}</p>}
        </div>
      </div>

      {/* ——— Reviews Section ——— */}
      <section className="reviews-section">
        <h2>Reviews & Ratings</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first!</p>
        ) : (
          reviews.map(r => (
            <div key={r.review_id} className="review">
              <strong>{r.user_name}</strong> &nbsp;
              <span className="stars">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </span>
              <p>{r.comment}</p>
              <small>{new Date(r.created_at).toLocaleString()}</small>
            </div>
          ))
        )}

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Leave a Review</h3>
          {revError   && <p className="review-form__error">{revError}</p>}
          {revSuccess && <p className="review-form__success">{revSuccess}</p>}

          <label>
            Rating:
            <select
              value={newReview.rating}
              onChange={e => setNewReview(r => ({ ...r, rating: +e.target.value }))}
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} star{n>1 && 's'}</option>
              ))}
            </select>
          </label>

          <label>
            Comment:
            <textarea
              value={newReview.comment}
              onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
              required
            />
          </label>

          <button type="submit" disabled={revLoading}>
            {revLoading ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default DealDetails;
