import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './ProductFormPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, suppRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/suppliers')
        ]);

        const prod = prodRes.data;
        setName(prod.name);
        setCategory(prod.category || 'Uncategorized');
        setDescription(prod.description);
        setPrice(prod.price);
        setQuantity(prod.quantity);
        setSupplierId(prod.supplierId);
        setCurrentImage(prod.image || '');
        setSuppliers(suppRes.data);
      } catch (err) {
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(''); // Clear URL if file is selected
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImageFile(null); // Clear file if URL is entered
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const removeNewImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCurrentImage = () => {
    setCurrentImage('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!category.trim()) {
      setError('Product category is required.');
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

    setSubmitting(true);

    try {
      let imageToSave = currentImage;

      // If user selected a new file, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageToSave = uploadRes.data.filename;
      } else if (imageUrl.trim()) {
        imageToSave = imageUrl.trim();
      }

      await api.put(`/products/${id}`, {
        name,
        category,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        supplierId: parseInt(supplierId, 10),
        image: imageToSave
      });

      navigate('/products');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update product.');
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
          <h2>Edit Product</h2>
          {loading ? (
            <p>Loading product...</p>
          ) : (
            <>
              {error && <div className="error-banner">{error}</div>}

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <input
                      type="text"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                  <label>Current Image</label>
                  {currentImage ? (
                    <div className="image-preview-box">
                      <img
                        src={currentImage.startsWith('http') ? currentImage : `http://localhost:5000/uploads/${currentImage}`}
                        alt="Current Product"
                      />
                      <button type="button" className="remove-image-btn" onClick={removeCurrentImage} title="Remove image">
                        ×
                      </button>
                    </div>
                  ) : (
                    <p className="no-img">No current image</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Replace Image (Upload OR Enter URL)</label>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="image" style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Local File Upload:</label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="imageUrl" style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Online Image URL:</label>
                      <input
                        type="url"
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                      />
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="image-preview-box">
                      <img src={imagePreview} alt="New Preview" />
                      <button type="button" className="remove-image-btn" onClick={removeNewImage} title="Remove image">
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link to="/products" className="cancel-btn">Cancel</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
