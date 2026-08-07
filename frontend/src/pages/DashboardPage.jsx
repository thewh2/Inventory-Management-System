import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getUploadUrl } from '../api/axios';
import Navbar from '../components/Navbar';
import CachedImage from '../components/CachedImage';
import './DashboardPage.css';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, suppRes] = await Promise.all([
          api.get('/products'),
          api.get('/suppliers')
        ]);
        setProducts(prodRes.data);
        setSuppliers(suppRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ── Summary Statistics ──
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalUnits = products.reduce((sum, p) => sum + parseInt(p.quantity, 10), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity, 10)), 0);
  const outOfStockItems = products.filter(p => parseInt(p.quantity, 10) === 0);
  const lowStockItems = products.filter(p => parseInt(p.quantity, 10) > 0 && parseInt(p.quantity, 10) < 5);
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  // ── Category Breakdown ──
  const categoryStats = uniqueCategories.map(cat => {
    const items = products.filter(p => p.category === cat);
    const totalQty = items.reduce((s, p) => s + parseInt(p.quantity, 10), 0);
    const totalVal = items.reduce((s, p) => s + (parseFloat(p.price) * parseInt(p.quantity, 10)), 0);
    return { category: cat, count: items.length, totalQty, totalVal };
  }).sort((a, b) => b.totalVal - a.totalVal);

  // ── Top 5 Most Valuable Products (by price * qty) ──
  const topValueProducts = [...products]
    .map(p => ({ ...p, totalValue: parseFloat(p.price) * parseInt(p.quantity, 10) }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // ── Recently Added Products (last 5 by id DESC) ──
  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard Overview</h2>
            <p className="dashboard-subtitle">Real-time summary of your inventory system</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>
              {/* ── Row 1: Summary Cards ── */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <div className="card-title">Total Products</div>
                  <div className="card-value">{totalProducts}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon icon-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  </div>
                  <div className="card-title">Total Units in Stock</div>
                  <div className="card-value">{totalUnits.toLocaleString()}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon icon-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="card-title">Inventory Value</div>
                  <div className="card-value">Rs. {totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon icon-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="card-title">Total Suppliers</div>
                  <div className="card-value">{totalSuppliers}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon icon-orange">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  </div>
                  <div className="card-title">Categories</div>
                  <div className="card-value">{uniqueCategories.length}</div>
                </div>

                <div className="summary-card alert-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div className="card-title">Out of Stock</div>
                  <div className="card-value">{outOfStockItems.length}</div>
                </div>
              </div>

              {/* ── Row 2: Two-Column Grid ── */}
              <div className="dashboard-grid">

                {/* ── Category Breakdown ── */}
                <div className="dashboard-section">
                  <h3>Category Breakdown</h3>
                  <div className="table-wrapper">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Products</th>
                          <th>Units</th>
                          <th>Value (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryStats.map((cat, i) => (
                          <tr key={i}>
                            <td><span className="category-badge">{cat.category}</span></td>
                            <td>{cat.count}</td>
                            <td>{cat.totalQty.toLocaleString()}</td>
                            <td>Rs. {cat.totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Top 5 Most Valuable Products ── */}
                <div className="dashboard-section">
                  <h3>Top 5 Most Valuable Products</h3>
                  <div className="top-products-list">
                    {topValueProducts.map((p, i) => (
                      <div className="top-product-item" key={p.id}>
                        <div className="top-rank">#{i + 1}</div>
                        <div className="top-product-img">
                          <CachedImage
                            src={p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:5000/uploads/${p.image}`) : null}
                            alt={p.name}
                            fallbackClassName="no-img-sm"
                          />
                        </div>
                        <div className="top-product-info">
                          <span className="top-product-name">{p.name}</span>
                          <span className="top-product-meta">{p.quantity} units × Rs. {parseFloat(p.price).toFixed(2)}</span>
                        </div>
                        <div className="top-product-value">Rs. {p.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Row 3: Two-Column Grid ── */}
              <div className="dashboard-grid">

                {/* ── Recently Added Products ── */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h3>Recently Added Products</h3>
                    <Link to="/products" className="view-all-link">View All →</Link>
                  </div>
                  <div className="recent-products-list">
                    {recentProducts.map(p => (
                      <div className="recent-product-item" key={p.id}>
                        <div className="recent-product-img">
                          <CachedImage
                            src={p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:5000/uploads/${p.image}`) : null}
                            alt={p.name}
                            fallbackClassName="no-img-sm"
                          />
                        </div>
                        <div className="recent-product-info">
                          <Link to={`/products/view/${p.id}`} className="recent-product-name">{p.name}</Link>
                          <span className="recent-product-meta">{p.category} · Rs. {parseFloat(p.price).toFixed(2)} · Qty: {p.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Inventory Alerts ── */}
                <div className="dashboard-section">
                  <h3>Inventory Alerts ({outOfStockItems.length + lowStockItems.length})</h3>
                  {(outOfStockItems.length > 0 || lowStockItems.length > 0) ? (
                    <div className="out-of-stock-list">
                      {outOfStockItems.map(item => (
                        <div key={item.id} className="out-of-stock-item">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-supplier">
                              <span className="stock-badge badge-danger">Out of Stock</span>
                              &nbsp;· Supplier: {item.Supplier ? item.Supplier.name : 'Unknown'}
                            </span>
                          </div>
                          <Link to={`/products/edit/${item.id}`} className="item-action">Update Stock</Link>
                        </div>
                      ))}
                      {lowStockItems.map(item => (
                        <div key={item.id} className="out-of-stock-item low-stock-item">
                          <div className="item-info">
                            <span className="item-name low">{item.name}</span>
                            <span className="item-supplier low">
                              <span className="stock-badge badge-warning">Low: {item.quantity} left</span>
                              &nbsp;· Supplier: {item.Supplier ? item.Supplier.name : 'Unknown'}
                            </span>
                          </div>
                          <Link to={`/products/edit/${item.id}`} className="item-action warning-action">Restock</Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-alerts">✅ All products are well stocked. No alerts!</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
