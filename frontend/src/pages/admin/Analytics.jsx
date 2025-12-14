import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Admin.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Generate year options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedYear]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Use year if no date range is set
      if (!dateRange.startDate && !dateRange.endDate) {
        params.append('year', selectedYear);
      } else {
        if (dateRange.startDate) params.append('startDate', dateRange.startDate);
        if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      }

      const response = await axios.get(`/api/admin/analytics?${params.toString()}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (!dateRange.startDate && !dateRange.endDate) {
        params.append('year', selectedYear);
      }

      const response = await axios.get(`/api/admin/orders/export?${params.toString()}`, {
        responseType: 'blob',
      });

      // Check if response is actually a blob
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-${Date.now()}.xlsx`);
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
            alert(errorData.message || 'Error exporting data');
          } catch {
            alert('Error exporting data. Please try again.');
          }
        };
        reader.readAsText(response.data);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(error.response?.data?.message || 'Error exporting data. Please try again.');
    }
  };

  // Format month labels (YYYY-MM to Month Name)
  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Generate colors for products
  const generateColors = (count) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
      '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8884d8',
      '#8dd1e1', '#d084d0', '#83a6ed', '#a4de6c', '#ffc658'
    ];
    return colors.slice(0, count);
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  const chartColors = analytics.monthlyProductChart?.products 
    ? generateColors(analytics.monthlyProductChart.products.length)
    : [];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <button className="btn-primary" onClick={handleExport}>
          Export to Excel
        </button>
      </div>

      <div className="date-filters">
        <div className="filter-group">
          <label>Year</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setDateRange({ startDate: '', endDate: '' });
            }}
          >
            {yearOptions.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => {
              setDateRange({ ...dateRange, startDate: e.target.value });
              setSelectedYear('');
            }}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => {
              setDateRange({ ...dateRange, endDate: e.target.value });
              setSelectedYear('');
            }}
          />
        </div>
        <button className="btn-secondary" onClick={() => {
          setDateRange({ startDate: '', endDate: '' });
          setSelectedYear(new Date().getFullYear().toString());
        }}>
          Clear
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="analytics-value">{analytics.totalOrders}</p>
        </div>
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="analytics-value">Rs {analytics.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {analytics.monthlyProductChart && analytics.monthlyProductChart.data.length > 0 && (
        <>
          <div className="analytics-section">
            <h2>Monthly Product Sales & Revenue</h2>
            <div className="chart-container" style={{ width: '100%', height: '500px', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={analytics.monthlyProductChart.data.map(item => ({
                    ...item,
                    month: formatMonthLabel(item.month)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue (Rs)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalRevenue') {
                        return [`Rs ${value.toFixed(2)}`, 'Total Revenue'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  {analytics.monthlyProductChart.products.map((product, index) => (
                    <Bar
                      key={product}
                      yAxisId="left"
                      dataKey={product}
                      fill={chartColors[index % chartColors.length]}
                      name={`${product} (Qty)`}
                    />
                  ))}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#ff7300"
                    strokeWidth={3}
                    name="Total Revenue"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-section">
            <h2>Monthly Product Sales & Revenue Breakdown</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    {analytics.monthlyProductChart.months.map(month => (
                      <th key={month} style={{ textAlign: 'center', minWidth: '120px' }}>
                        {formatMonthLabel(month)}
                      </th>
                    ))}
                    <th style={{ textAlign: 'center' }}>Total Qty</th>
                    <th style={{ textAlign: 'center' }}>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyProductChart.products.map(product => {
                    const totalQty = analytics.monthlyProductChart.data.reduce(
                      (sum, month) => sum + (month[product] || 0), 
                      0
                    );
                    const totalRevenue = analytics.monthlyProductChart.data.reduce(
                      (sum, month) => sum + (month[`${product}_revenue`] || 0), 
                      0
                    );
                    return (
                      <tr key={product}>
                        <td><strong>{product}</strong></td>
                        {analytics.monthlyProductChart.months.map(month => {
                          const monthData = analytics.monthlyProductChart.data.find(m => m.month === month);
                          const qty = monthData?.[product] || 0;
                          const revenue = monthData?.[`${product}_revenue`] || 0;
                          return (
                            <td key={month} style={{ textAlign: 'center' }}>
                              <div style={{ fontWeight: '500' }}>Qty: {qty}</div>
                              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                Rs {revenue.toFixed(2)}
                              </div>
                            </td>
                          );
                        })}
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{totalQty}</td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>Rs {totalRevenue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ backgroundColor: '#e8e8e8', fontWeight: '600', color: '#000' }}>
                    <td style={{ color: '#000' }}><strong>Monthly Totals</strong></td>
                    {analytics.monthlyProductChart.months.map(month => {
                      const monthData = analytics.monthlyProductChart.data.find(m => m.month === month);
                      const monthQty = analytics.monthlyProductChart.products.reduce(
                        (sum, product) => sum + (monthData?.[product] || 0),
                        0
                      );
                      const monthRevenue = monthData?.totalRevenue || 0;
                      return (
                        <td key={month} style={{ textAlign: 'center', color: '#000' }}>
                          <div style={{ color: '#000' }}>Qty: {monthQty}</div>
                          <div style={{ fontSize: '0.85em', color: '#333', marginTop: '4px' }}>
                            Rs {monthRevenue.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'center', color: '#000' }}>
                      {analytics.monthlyProductChart.data.reduce(
                        (sum, month) => sum + analytics.monthlyProductChart.products.reduce(
                          (pSum, product) => pSum + (month[product] || 0),
                          0
                        ),
                        0
                      )}
                    </td>
                    <td style={{ textAlign: 'center', color: '#000' }}>
                      Rs {analytics.monthlyProductChart.data.reduce(
                        (sum, month) => sum + (month.totalRevenue || 0),
                        0
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="analytics-section">
        <h2>Orders by Status</h2>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {analytics.ordersByStatus?.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="analytics-section">
        <h2>Top Products</h2>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topProducts?.map((product, idx) => (
              <tr key={idx}>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>Rs {product.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="analytics-section">
        <h2>Orders by Date</h2>
        <div className="chart-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.ordersByDate?.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.count}</td>
                  <td>Rs {item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
