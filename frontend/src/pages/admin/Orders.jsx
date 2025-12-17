import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import './Admin.css';

// Get the API base URL for constructing full URLs
const API_BASE_URL = import.meta.env.VITE_API_TARGET || 'http://localhost:5000';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    customerId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`/api/admin/orders?${params.toString()}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`/api/admin/orders/export?${params.toString()}`, {
        responseType: 'blob',
      });

      // Check if response is actually a blob
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders-${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else {
        // Handle error response
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(errorData.message || 'Error exporting orders');
          } catch {
            alert('Error exporting orders. Please try again.');
          }
        };
        reader.readAsText(response.data);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(error.response?.data?.message || 'Error exporting orders. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Order Management</h1>
        <button className="btn-primary" onClick={handleExport}>
          Export to Excel
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <button className="btn-secondary" onClick={() => setFilters({ status: '', customerId: '', startDate: '', endDate: '' })}>
          Clear Filters
        </button>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>
                  <div style={{ lineHeight: '1.6' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {order.shippingAddress?.firstName && order.shippingAddress?.lastName
                        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                        : order.user?.firstName && order.user?.lastName
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : order.user?.username || order.shippingAddress?.firstName || 'Guest'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--off-white)', opacity: 0.9 }}>
                      {order.shippingAddress?.email || order.user?.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.product?.name || 'N/A'} x{item.quantity}
                    </div>
                  ))}
                </td>
                <td>Rs {order.totalAmount.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn-view"
                      onClick={() => window.open(`/admin/orders/${order._id}`, '_blank')}
                    >
                      View
                    </button>
                    <button
                      className="btn-download"
                      onClick={() => {
                        const slipUrl = `${API_BASE_URL}/api/admin/orders/${order._id}/delivery-slip`;
                        window.open(slipUrl, '_blank');
                      }}
                      title="Download Delivery Slip"
                    >
                      📄 Slip
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

