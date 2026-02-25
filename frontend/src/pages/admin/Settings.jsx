import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const Settings = () => {
  const [settings, setSettings] = useState({ deliveryCharge: 200, qrDiscountEnabled: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingQr, setTogglingQr] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings/full');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/settings/delivery-charge', {
        deliveryCharge: parseFloat(settings.deliveryCharge)
      });
      showToast('Delivery charge updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast(error.response?.data?.message || 'Error updating delivery charge', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleQrDiscount = async () => {
    setTogglingQr(true);
    try {
      const newValue = !settings.qrDiscountEnabled;
      const response = await axios.patch('/api/admin/settings/qr-discount', {
        qrDiscountEnabled: newValue,
      });
      setSettings(prev => ({ ...prev, qrDiscountEnabled: response.data.qrDiscountEnabled }));
      showToast(
        newValue ? '✅ QR discount is now ENABLED' : '🚫 QR discount is now DISABLED',
        newValue ? 'success' : 'error'
      );
    } catch (error) {
      console.error('Error toggling QR discount:', error);
      showToast(error.response?.data?.message || 'Error updating QR discount setting', 'error');
    } finally {
      setTogglingQr(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        {/* Delivery Charge */}
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="deliveryCharge">
              Delivery Charge (Rs)
            </label>
            <input
              type="number"
              id="deliveryCharge"
              value={settings.deliveryCharge}
              onChange={(e) => setSettings({ ...settings, deliveryCharge: e.target.value })}
              min="0"
              step="0.01"
              required
            />
            <small>This charge will be added to all orders at checkout.</small>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* QR Discount Toggle */}
        <div className="settings-form" style={{ marginTop: '2rem', borderTop: '1px solid var(--beige)', paddingTop: '2rem' }}>
          <div className="form-group">
            <label>QR Code Discount</label>
            <div className="qr-toggle-card">
              <div className="qr-toggle-info">
                <div className="qr-toggle-status">
                  <span
                    className="qr-status-dot"
                    style={{ background: settings.qrDiscountEnabled ? '#27ae60' : '#e74c3c' }}
                  />
                  <strong style={{ color: settings.qrDiscountEnabled ? '#1a6b3a' : '#c0392b' }}>
                    {settings.qrDiscountEnabled ? 'ENABLED' : 'DISABLED'}
                  </strong>
                </div>
                <p className="qr-toggle-desc">
                  When enabled, customers who visit via QR code receive a <strong>10% discount</strong> on their order subtotal.
                  Disable this to stop the promotion without changing the QR code itself.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.qrDiscountEnabled}
                    onChange={handleToggleQrDiscount}
                    disabled={togglingQr}
                  />
                  <span className="slider"></span>
                </label>

                <span style={{ minWidth: "100px", fontWeight: 500 }}>
                  {togglingQr
                    ? "Updating..."
                    : settings.qrDiscountEnabled
                      ? "Enabled"
                      : "Disabled"}
                </span>
              </div>
            </div>
            <small>Changes take effect immediately — no restart required.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


