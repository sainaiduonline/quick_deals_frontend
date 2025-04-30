import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DealDetails.css';

const API_BASE = 'http://localhost:7001';

const DealDetails = () => {
  const { id } = useParams();            // route: /deal/:id
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user_id'));

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // cart button state
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/deals/${id}`)
      .then(res => {
        if (res.data.status === 200) {
          setDeal(res.data.data);
        } else {
          setError(res.data.message || 'Deal not found');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error loading deal');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!deal || deal.quantity_available < 1) return;
    setCartError('');
    setCartSuccess('');
    setCartLoading(true);

    try {
      // your backend should expose e.g. POST /cart/add
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

  if (loading) return <div className="deal-details__loading">Loading…</div>;
  if (error)   return <div className="deal-details__error">{error}</div>;
  if (!deal)   return <div className="deal-details__error">Deal not found</div>;

  return (
    <div className="deal-details">
      <button className="deal-details__back" onClick={() => navigate(-1)}>
        ← Back to Deals
      </button>

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

          <ul className="deal-details__meta">
            <li><strong>Available:</strong> {deal.quantity_available}</li>
            <li>
              <strong>Expires:</strong> {new Date(deal.expiration_date)
                .toLocaleDateString()} at{' '}
              {new Date(deal.expiration_date)
                .toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
            </li>
            <li><strong>Condition:</strong> {deal.condition.replace('_',' ')}</li>
          </ul>

          {cartError   && <p className="deal-details__cart-error">{cartError}</p>}
          {cartSuccess && <p className="deal-details__cart-success">{cartSuccess}</p>}

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
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
