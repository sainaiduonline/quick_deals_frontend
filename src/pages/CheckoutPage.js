import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const API = 'http://localhost:7001';

export default function CheckoutPage() {
  const [options, setOptions] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user_id'));

  useEffect(() => {
    axios.get(`${API}/delivery-options`)
      .then(res => setOptions(res.data.data))
      .catch(err => {
        console.error(err);
        setError('Could not load delivery options');
      });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/checkout`, {
        user_id: userId,
        delivery_option: deliveryOption,
        delivery_address: address
      });
      navigate(`/confirmation/${res.data.order_id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {error && <p className="checkout-error">{error}</p>}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Delivery Option
          <select 
            required 
            value={deliveryOption} 
            onChange={e => setDeliveryOption(e.target.value)}
          >
            <option value="">— select —</option>
            {options.map(o => (
              <option key={o.option_id} value={o.option_id}>
                {o.name} (+${o.cost.toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <label>
          Delivery Address
          <textarea
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Street, city, postcode…"
          />
        </label>

        <button type="submit" className="checkout-submit-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}
