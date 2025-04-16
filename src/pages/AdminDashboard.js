import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

// Simple Modal Component
const Modal = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>×</button>
      {children}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState({
    retailer_id: '',
    category_id: '',
    name: '',
    description: '',
    original_price: '',
    current_price: '',
    discount_percentage: '',
    quantity_available: '',
    minimum_order_quantity: '',
    expiration_date: '',
    condition: '',
    image_url: ''
  });
  const [newDealFile, setNewDealFile] = useState(null);

  const [editingDeal, setEditingDeal] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal visibility states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch deals from backend
  const fetchDeals = async () => {
    try {
      const res = await axios.get('http://localhost:7001/deals');
      setDeals(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching deals');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Handle new deal form changes
  const handleNewDealChange = (e) => {
    const { name, value } = e.target;
    setNewDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleNewDealFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewDealFile(e.target.files[0]);
    }
  };

  // Create a new deal with image upload
  const handleCreateDeal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let imageUrl = '';
      if (newDealFile) {
        const formData = new FormData();
        formData.append("file", newDealFile);
        const uploadRes = await axios.post('http://localhost:7001/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.file ? `uploads/${uploadRes.data.file.filename}` : '';
      }
      const dealToCreate = { ...newDeal, image_url: imageUrl };
      const res = await axios.post('http://localhost:7001/deals', dealToCreate);
      if (res.data.status === 201) {
        setSuccess('Deal created successfully');
        fetchDeals();
        // Reset form
        setNewDeal({
          retailer_id: '',
          category_id: '',
          name: '',
          description: '',
          original_price: '',
          current_price: '',
          discount_percentage: '',
          quantity_available: '',
          minimum_order_quantity: '',
          expiration_date: '',
          condition: '',
          image_url: ''
        });
        setNewDealFile(null);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error(err);
      setError('Error creating deal');
    }
  };

  // Delete a deal with confirmation
  const handleDeleteDeal = async (dealId) => {
    setError('');
    setSuccess('');
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      const res = await axios.delete(`http://localhost:7001/deals/${dealId}`);
      if (res.data.status === 200) {
        setSuccess('Deal deleted successfully');
        fetchDeals();
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting deal');
    }
  };

  // Start editing a deal: Open modal and populate editingDeal state
  const handleEditClick = (deal) => {
    setEditingDeal(deal);
    setShowEditModal(true);
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditingFile(e.target.files[0]);
    }
  };

  // Update the deal with image upload support
  const handleUpdateDeal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let imageUrl = editingDeal.image_url;
      if (editingFile) {
        const formData = new FormData();
        formData.append("file", editingFile);
        const uploadRes = await axios.post('http://localhost:7001/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.file ? `uploads/${uploadRes.data.file.filename}` : editingDeal.image_url;
      }
      const dealToUpdate = { ...editingDeal, image_url: imageUrl };
      const res = await axios.put(`http://localhost:7001/deals/${editingDeal.food_id}`, dealToUpdate);
      if (res.data.status === 200) {
        setSuccess('Deal updated successfully');
        setEditingDeal(null);
        setEditingFile(null);
        setShowEditModal(false);
        fetchDeals();
      }
    } catch (err) {
      console.error(err);
      setError('Error updating deal');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p className="admin-error-message">{error}</p>}
      {success && <p className="admin-success-message">{success}</p>}

      <button className="admin-create-btn" onClick={() => setShowCreateModal(true)}>
        Create New Deal
      </button>

      {/* Deals List Section */}
      <section className="admin-deals-list">
        <h2>Existing Deals</h2>
        <table className="admin-deals-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Expiration</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.food_id}>
                <td>{deal.food_id}</td>
                <td>{deal.name}</td>
                <td>{deal.current_price}</td>
                <td>{deal.quantity_available}</td>
                <td>{new Date(deal.expiration_date).toLocaleString()}</td>
                <td>
                  {deal.image_url ? (
                    <img 
                      src={deal.image_url} 
                      alt={deal.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <div className="admin-action-buttons">
                    <button className="admin-edit-btn" onClick={() => handleEditClick(deal)}>Edit</button>
                    <button className="admin-delete-btn" onClick={() => handleDeleteDeal(deal.food_id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <h2>Create New Deal</h2>
          <form onSubmit={handleCreateDeal}>
            <input type="text" name="retailer_id" placeholder="Retailer ID" value={newDeal.retailer_id} onChange={handleNewDealChange} required />
            <input type="text" name="category_id" placeholder="Category ID" value={newDeal.category_id} onChange={handleNewDealChange} required />
            <input type="text" name="name" placeholder="Deal Name" value={newDeal.name} onChange={handleNewDealChange} required />
            <textarea name="description" placeholder="Description" value={newDeal.description} onChange={handleNewDealChange} required />
            <input type="number" name="original_price" placeholder="Original Price" value={newDeal.original_price} onChange={handleNewDealChange} required />
            <input type="number" name="current_price" placeholder="Current Price" value={newDeal.current_price} onChange={handleNewDealChange} required />
            <input type="number" name="discount_percentage" placeholder="Discount (%)" value={newDeal.discount_percentage} onChange={handleNewDealChange} />
            <input type="number" name="quantity_available" placeholder="Quantity Available" value={newDeal.quantity_available} onChange={handleNewDealChange} required />
            <input type="number" name="minimum_order_quantity" placeholder="Minimum Order Quantity" value={newDeal.minimum_order_quantity} onChange={handleNewDealChange} />
            <input type="datetime-local" name="expiration_date" placeholder="Expiration Date" value={newDeal.expiration_date} onChange={handleNewDealChange} required />
            <input type="text" name="condition" placeholder="Condition (e.g., fresh)" value={newDeal.condition} onChange={handleNewDealChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleNewDealFileChange} />
            <button type="submit">Create Deal</button>
          </form>
        </Modal>
      )}

      {/* Edit Deal Modal */}
      {showEditModal && editingDeal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2>Edit Deal</h2>
          <form onSubmit={handleUpdateDeal}>
            <input type="text" name="retailer_id" placeholder="Retailer ID" value={editingDeal.retailer_id} onChange={handleEditingChange} required />
            <input type="text" name="category_id" placeholder="Category ID" value={editingDeal.category_id} onChange={handleEditingChange} required />
            <input type="text" name="name" placeholder="Deal Name" value={editingDeal.name} onChange={handleEditingChange} required />
            <textarea name="description" placeholder="Description" value={editingDeal.description} onChange={handleEditingChange} required />
            <input type="number" name="original_price" placeholder="Original Price" value={editingDeal.original_price} onChange={handleEditingChange} required />
            <input type="number" name="current_price" placeholder="Current Price" value={editingDeal.current_price} onChange={handleEditingChange} required />
            <input type="number" name="discount_percentage" placeholder="Discount (%)" value={editingDeal.discount_percentage} onChange={handleEditingChange} />
            <input type="number" name="quantity_available" placeholder="Quantity Available" value={editingDeal.quantity_available} onChange={handleEditingChange} required />
            <input type="number" name="minimum_order_quantity" placeholder="Minimum Order Quantity" value={editingDeal.minimum_order_quantity} onChange={handleEditingChange} />
            <input type="datetime-local" name="expiration_date" placeholder="Expiration Date" value={editingDeal.expiration_date} onChange={handleEditingChange} required />
            <input type="text" name="condition" placeholder="Condition" value={editingDeal.condition} onChange={handleEditingChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleEditingFileChange} />
            <button type="submit">Update Deal</button>
            <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
