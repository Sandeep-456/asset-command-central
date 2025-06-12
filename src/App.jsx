
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Assets from './pages/Assets';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/purchases" element={
            <ProtectedRoute>
              <Layout>
                <Purchases />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/transfers" element={
            <ProtectedRoute>
              <Layout>
                <Transfers />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assignments" element={
            <ProtectedRoute roles={['Admin', 'Base Commander']}>
              <Layout>
                <Assignments />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assets" element={
            <ProtectedRoute roles={['Admin', 'Base Commander']}>
              <Layout>
                <Assets />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute roles={['Admin']}>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
