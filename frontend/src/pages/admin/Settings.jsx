import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const Settings = () => {
  const [settings, setSettings] = useState({ deliveryCharge: 200 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
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
      </div>
    </div>
  );
};

export default Settings;

