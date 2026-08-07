import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './ProductFormPage.css';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get('/suppliers');
        setSuppliers(response.data);
      } catch (err) {
        setError('Failed to fetch suppliers list.');
      }
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Product description is required.');
      return;
    }
    if (price === '' || parseFloat(price) < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (quantity === '' || parseInt(quantity, 10) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }
    if (!supplierId) {
      setError('Supplier must be selected.');
      return;
    }
    if (!imageFile) {
      setError('Image upload is required when creating a new product.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload image using multipart/form-data
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFilename = uploadRes.data.filename;

      // 2. Save Product details with uploaded image filename
      await api.post('/products', {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        supplierId: parseInt(supplierId, 10),
        image: uploadedFilename
      });

      navigate('/products');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add product. Image upload or server error.');
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
          <h2>Add New Product</h2>
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Mouse"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  min="0"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="supplierId">Supplier *</label>
              <select
                id="supplierId"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image Upload * (Required for new product)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <Link to="/products" className="cancel-btn">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
