import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deals.css';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    distance: '',
    condition: ''
  });
  const navigate = useNavigate();

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        
        // Convert filters to query parameters
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
        if (filters.distance) queryParams.append('distance', filters.distance);
        if (filters.condition) queryParams.append('condition', filters.condition);
        
        const response = await fetch(`http://localhost:7001/deals?${queryParams.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          // Access the 'data' key for deals
          setDeals(data.data);
        } else {
          console.error('Failed to fetch deals:', data.message);
          // Optionally show error to user
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeals();
  }, [filters]); // Re-run when filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDealClick = (foodId) => {
    navigate(`/deal/${foodId}`);
  };

  const filteredDeals = Array.isArray(deals) ? deals.filter(deal => {
    return (
      (filters.category === '' || deal.category_id === parseInt(filters.category)) &&
      (filters.condition === '' || deal.condition === filters.condition) &&
      (filters.priceRange === '' || (
        filters.priceRange === 'under5' && deal.current_price < 5 ||
        filters.priceRange === '5to10' && deal.current_price >= 5 && deal.current_price <= 10 ||
        filters.priceRange === 'over10' && deal.current_price > 10
      ))
    );
  }) : [];

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString([], options);
  };

  return (
    <div className="deals-page">
      <div className="deals-header">
        <h1>Today's Best Deals</h1>
        <p>Save money and reduce food waste with these amazing offers</p>
      </div>

      <div className="deals-container">
        <div className="filters-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="1">Bakery</option>
              <option value="2">Produce</option>
              <option value="3">Dairy</option>
              <option value="4">Meat</option>
              <option value="5">Prepared Foods</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
              <option value="">Any Price</option>
              <option value="under5">Under $5</option>
              <option value="5to10">$5 - $10</option>
              <option value="over10">Over $10</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <select name="condition" value={filters.condition} onChange={handleFilterChange}>
              <option value="">Any Condition</option>
              <option value="fresh">Fresh</option>
              <option value="near_expiry">Near Expiry</option>
              <option value="day_old">Day Old</option>
            </select>
          </div>

          <button 
            className="clear-filters" 
            onClick={() => setFilters({
              category: '',
              priceRange: '',
              distance: '',
              condition: ''
            })}
          >
            Clear All Filters
          </button>
        </div>

        <div className="deals-list">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading delicious deals...</p>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="no-results">
              <h3>No deals match your filters</h3>
              <p>Try adjusting your filters or check back later for new deals</p>
            </div>
          ) : (
            filteredDeals.map(deal => (
              <div key={deal.food_id} className="deal-card" onClick={() => handleDealClick(deal.food_id)}>
                <div className="deal-image" style={{ backgroundImage: `url(${deal.image_url})` }}>
                  <span className={`condition-tag ${deal.condition}`}>
                    {deal.condition.replace('_', ' ')}
                  </span>
                  <span className="discount-tag">-{deal.discount_percentage}%</span>
                </div>
                <div className="deal-info">
                  <h3>{deal.name}</h3>
                  <p className="retailer">{deal.retailer_id} • {/* Add retailer name logic if needed */}</p>
                  <div className="price-section">
                    <span className="current-price">${deal.current_price.toFixed(2)}</span>
                    <span className="original-price">${deal.original_price.toFixed(2)}</span>
                  </div>
                  <div className="deal-meta">
                    <div className="meta-item">
                      <i className="fas fa-box"></i>
                      <span>{deal.quantity_available} left</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-clock"></i>
                      <span>Expires on {formatDate(deal.expiration_date)}</span>
                    </div>
                  </div>
                  <button className="view-deal-btn">View Deal</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Deals;
