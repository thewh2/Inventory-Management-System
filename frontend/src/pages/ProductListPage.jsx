import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSupplier, selectedCategory]);

  const openDeleteModal = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setMessage('Product deleted successfully.');
      setProducts(products.filter((p) => p.id !== deleteTarget.id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product.');
      setTimeout(() => setError(''), 3000);
    }
    setDeleteTarget(null);
  };

  // Filter products by search name and supplier dropdown
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier === '' || String(product.supplierId) === String(selectedSupplier);
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesSupplier && matchesCategory;
  });

  // Calculate unique categories for dropdown
  const uniqueCategories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  // Calculate pagination slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
            <label htmlFor="categoryFilter">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
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
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price (Rs.)</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Supplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>No products found.</td>
                    </tr>
                  ) : (
                    currentProducts.map((product) => {
                      const isLowStock = product.quantity < 5;
                      const isOutOfStock = product.quantity === 0;
                      return (
                        <tr key={product.id} className={isLowStock ? 'low-stock' : ''}>
                          <td>
                            {product.image ? (
                              <img
                                src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`}
                                alt={product.name}
                                className="thumbnail"
                              />
                            ) : (
                              <span className="no-img">No Image</span>
                            )}
                          </td>
                          <td>
                            <strong>{product.name}</strong>
                          </td>
                          <td>{product.category}</td>
                          <td>Rs. {parseFloat(product.price).toFixed(2)}</td>
                          <td>{product.quantity}</td>
                          <td>
                            {isOutOfStock ? (
                              <span className="status-badge out-of-stock">Out of Stock</span>
                            ) : isLowStock ? (
                              <span className="status-badge low-stock-status">Low Stock</span>
                            ) : (
                              <span className="status-badge in-stock">In Stock</span>
                            )}
                          </td>
                          <td>{product.Supplier ? product.Supplier.name : 'N/A'}</td>
                          <td className="actions-cell">
                            <Link to={`/products/view/${product.id}`} className="action-icon-btn view-btn" title="View">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Link>
                            <Link to={`/products/edit/${product.id}`} className="action-icon-btn edit-btn" title="Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </Link>
                            <button
                              onClick={() => openDeleteModal(product.id, product.name)}
                              className="action-icon-btn delete-btn"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component - Only render when products count > 10 */}
            {filteredProducts.length > itemsPerPage && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
                </div>
                <div className="pagination-buttons">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ProductListPage;
