import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const API = 'http://localhost:7001';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user_id'));

  useEffect(() => {
    axios.get(`${API}/cart/${userId}`)
      .then(res => setItems(res.data.data))
      .catch(err => {
        console.error(err);
        setError('Could not load cart');
      });
  }, [userId]);

  const subtotal = items.reduce((sum, i) => sum + i.current_price * i.quantity, 0);

  if (error) return <p className="cart-error">{error}</p>;
  if (!items.length) return <p className="cart-empty">Your cart is empty.</p>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul className="cart-list">
        {items.map(item => (
          <li key={item.cart_item_id} className="cart-item">
            <img 
              src={`${API}/${item.image_url}`} 
              alt={item.name} 
              className="cart-item__img"
            />
            <div className="cart-item__info">
              <h2>{item.name}</h2>
              <p>Price: ${item.current_price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: ${(item.current_price * item.quantity).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
        <button 
          className="cart-checkout-btn" 
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
