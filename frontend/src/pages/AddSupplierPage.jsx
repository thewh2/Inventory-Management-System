import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './SupplierFormPage.css';

const AddSupplierPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Supplier name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Supplier email is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Supplier phone is required.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/suppliers', { name, email, phone });
      navigate('/suppliers');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add supplier.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="form-card">
          <h2>Add New Supplier</h2>
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="supplier-form">
            <div className="form-group">
              <label htmlFor="name">Supplier Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Supplies Ltd."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supplier@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 98XXXXXX"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <Link to="/suppliers" className="cancel-btn">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierPage;
