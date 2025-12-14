import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [analyticsRes, productsRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/products'),
      ]);

      setStats({
        totalOrders: analyticsRes.data.totalOrders || 0,
        totalRevenue: analyticsRes.data.totalRevenue || 0,
        pendingOrders: analyticsRes.data.ordersByStatus?.find(s => s._id === 'pending')?.count || 0,
        totalProducts: productsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">Rs {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/inventory" className="action-btn">
            Manage Inventory
          </Link>
          <Link to="/admin/orders" className="action-btn">
            View Orders
          </Link>
          <Link to="/admin/analytics" className="action-btn">
            View Analytics
          </Link>
          <Link to="/admin/hero" className="action-btn">
            Edit Hero Section
          </Link>
          <Link to="/admin/settings" className="action-btn">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

