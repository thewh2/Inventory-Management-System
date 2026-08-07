import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import SupplierListPage from './pages/SupplierListPage';
import AddSupplierPage from './pages/AddSupplierPage';
import EditSupplierPage from './pages/EditSupplierPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/edit/:id" element={<EditProductPage />} />
            <Route path="/products/view/:id" element={<ProductDetailPage />} />

            <Route path="/suppliers" element={<SupplierListPage />} />
            <Route path="/suppliers/add" element={<AddSupplierPage />} />
            <Route path="/suppliers/edit/:id" element={<EditSupplierPage />} />
          </Route>

          {/* Default Redirection */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
