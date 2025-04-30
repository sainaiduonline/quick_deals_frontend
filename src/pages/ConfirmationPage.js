import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ConfirmationPage.css';

const API = 'http://localhost:7001';

export default function ConfirmationPage() {
  let { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1) fetch order header
    axios.get(`${API}/orders/${orderId}`)
      .then(res => {
        if (res.data.status === 200) {
          setOrder(res.data.data);
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Could not load order');
      });
    // 2) fetch order items
    axios.get(`${API}/orders/${orderId}/items`)
      .then(res => setItems(res.data.data))
      .catch(err => console.error(err));
  }, [orderId]);

  if (error) return <p className="confirm-error">{error}</p>;
  if (!order) return <p>Loading your order…</p>;

  return (
    <div className="confirm-page">
      <h1>Thank you!</h1>
      <p>Your order <strong>#{orderId}</strong> is now <em>{order.status}</em>.</p>
      <h2>Order Summary</h2>
      <ul className="confirm-items">
        {items.map(i => (
          <li key={i.order_item_id}>
            {i.name} × {i.quantity} — ${i.price_at_purchase.toFixed(2)}
          </li>
        ))}
      </ul>
      <p><strong>Total Paid:</strong> ${order.total_amount.toFixed(2)}</p>
      <p><strong>Delivery:</strong> {order.delivery_address}</p>
      <Link to="/deals" className="confirm-back-btn">Back to Deals</Link>
    </div>
  );
}
