import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="detail-card">
          <Link to="/products" className="back-btn">&larr; Back to Products</Link>
          
          {loading ? (
            <p>Loading product details...</p>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : product ? (
            <div className="detail-content">
              <h2>{product.name}</h2>
              {product.image ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="detail-image"
                />
              ) : (
                <div className="no-image-box">No Image Uploaded</div>
              )}

              <div className="detail-info">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Price:</strong> Rs. {parseFloat(product.price).toFixed(2)}</p>
                <p><strong>Quantity:</strong> {product.quantity} {product.quantity < 5 && <span className="low-stock-tag">(Low Stock)</span>}</p>
                <p><strong>Supplier Name:</strong> {product.Supplier ? product.Supplier.name : 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p>Product not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
