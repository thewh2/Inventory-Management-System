import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './SupplierListPage.css';

const SupplierListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      setError('Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete supplier "${name}"? Products belonging to this supplier will also be deleted.`)) {
      try {
        await api.delete(`/suppliers/${id}`);
        setMessage('Supplier deleted successfully.');
        setSuppliers(suppliers.filter((s) => s.id !== id));
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete supplier.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="header-actions">
          <h2>Suppliers Directory</h2>
          <Link to="/suppliers/add" className="add-btn">+ Add Supplier</Link>
        </div>

        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p>Loading suppliers...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No suppliers found.</td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td><strong>{supplier.name}</strong></td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phone}</td>
                    <td className="actions-cell">
                      <Link to={`/suppliers/edit/${supplier.id}`} className="edit-btn">Edit</Link>
                      <button
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupplierListPage;
