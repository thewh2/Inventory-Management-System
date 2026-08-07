import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
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

  // Calculate Summary Statistics
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity, 10)), 0);
  
  const outOfStockItems = products.filter(p => parseInt(p.quantity, 10) === 0);
  const lowStockItems = products.filter(p => parseInt(p.quantity, 10) > 0 && parseInt(p.quantity, 10) < 5);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard Overview</h2>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <div className="card-title">Total Products</div>
                  <div className="card-value">{totalProducts}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="card-title">Inventory Value</div>
                  <div className="card-value">Rs. {totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="card-title">Total Suppliers</div>
                  <div className="card-value">{totalSuppliers}</div>
                </div>

                <div className="summary-card alert-card">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div className="card-title">Out of Stock</div>
                  <div className="card-value">{outOfStockItems.length}</div>
                </div>
              </div>

              {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
                <div className="recent-section">
                  <h3>Inventory Alerts</h3>
                  <div className="out-of-stock-list">
                    {outOfStockItems.map(item => (
                      <div key={item.id} className="out-of-stock-item">
                        <div className="item-info">
                          <span className="item-name">{item.name} (Out of Stock)</span>
                          <span className="item-supplier">Supplier: {item.Supplier ? item.Supplier.name : 'Unknown'}</span>
                        </div>
                        <Link to={`/products/edit/${item.id}`} className="item-action">Update Stock</Link>
                      </div>
                    ))}
                    {lowStockItems.map(item => (
                      <div key={item.id} className="out-of-stock-item" style={{ backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
                        <div className="item-info">
                          <span className="item-name" style={{ color: '#c2410c' }}>{item.name} (Low Stock: {item.quantity})</span>
                          <span className="item-supplier" style={{ color: '#ea580c' }}>Supplier: {item.Supplier ? item.Supplier.name : 'Unknown'}</span>
                        </div>
                        <Link to={`/products/edit/${item.id}`} className="item-action" style={{ color: '#ea580c', borderColor: '#ffedd5' }}>Restock</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
