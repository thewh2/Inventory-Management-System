import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Failed to load suppliers.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete this product? ("${name}")`)) {
      try {
        await api.delete(`/products/${id}`);
        setMessage('Product deleted successfully.');
        setProducts(products.filter((p) => p.id !== id));
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete product.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Filter products by search name and supplier dropdown
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier === '' || String(product.supplierId) === String(selectedSupplier);
    return matchesSearch && matchesSupplier;
  });

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="header-actions">
          <h2>Product Inventory</h2>
          <Link to="/products/add" className="add-btn">+ Add Product</Link>
        </div>

        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}

        {/* Search and Filter Controls */}
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="search">Search Product:</label>
            <input
              type="text"
              id="search"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="supplierFilter">Filter by Supplier:</label>
            <select
              id="supplierFilter"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.quantity < 5;
                    return (
                      <tr key={product.id} className={isLowStock ? 'low-stock' : ''}>
                        <td>
                          {product.image ? (
                            <img
                              src={`http://localhost:5000/uploads/${product.image}`}
                              alt={product.name}
                              className="thumbnail"
                            />
                          ) : (
                            <span className="no-img">No Image</span>
                          )}
                        </td>
                        <td>
                          <strong>{product.name}</strong>
                          {isLowStock && <span className="low-stock-badge"> (Low Stock)</span>}
                        </td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.quantity}</td>
                        <td>{product.Supplier ? product.Supplier.name : 'N/A'}</td>
                        <td className="actions-cell">
                          <Link to={`/products/view/${product.id}`} className="view-btn">View</Link>
                          <Link to={`/products/edit/${product.id}`} className="edit-btn">Edit</Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
