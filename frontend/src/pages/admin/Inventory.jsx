import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '../../config/axios';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    impressionOf: '',
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    bottleImage: '',
    hoverImage: '',
    thirdImage: '',
    themeColor: '#d4af37',
    rating: 0,
    description: '',
    actualPrice: 0,
    discountedPrice: '',
    stock: 0,
    isVisible: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHoverImage, setUploadingHoverImage] = useState(false);
  const [uploadingThirdImage, setUploadingThirdImage] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'topNotes' || name === 'heartNotes' || name === 'baseNotes') {
      setFormData({ ...formData, [name]: value.split(',').map(n => n.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate price (use discounted if available, otherwise actual)
      const submitData = {
        ...formData,
        price: formData.discountedPrice && formData.discountedPrice > 0 
          ? formData.discountedPrice 
          : formData.actualPrice,
        discountedPrice: formData.discountedPrice && formData.discountedPrice > 0 
          ? formData.discountedPrice 
          : null,
      };
      
      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct._id}`, submitData);
        showToast('Product updated successfully!', 'success');
      } else {
        await axios.post('/api/admin/products', submitData);
        showToast('Product added successfully!', 'success');
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error saving product: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      gender: product.gender,
      impressionOf: product.impressionOf,
      topNotes: product.topNotes || [],
      heartNotes: product.heartNotes || [],
      baseNotes: product.baseNotes || [],
      bottleImage: product.bottleImage || '',
      hoverImage: product.hoverImage || '',
      thirdImage: product.thirdImage || '',
      themeColor: product.themeColor,
      rating: product.rating,
      description: product.description,
      actualPrice: product.actualPrice || product.price || 0,
      discountedPrice: product.discountedPrice || '',
      stock: product.stock || 0,
      isVisible: product.isVisible !== undefined ? product.isVisible : true,
    });
    setShowForm(true);
    // Scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e, imageType = 'main') => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.', 'error');
      e.target.value = '';
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size too large. Maximum size is 10MB.', 'error');
      e.target.value = '';
      return;
    }

    // Set appropriate loading state
    if (imageType === 'main') setUploadingImage(true);
    else if (imageType === 'hover') setUploadingHoverImage(true);
    else if (imageType === 'third') setUploadingThirdImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await axios.post('/api/upload/product-image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data || !response.data.imagePath) {
        throw new Error('Invalid response from server');
      }

      // Use functional update to ensure we have the latest state
      setFormData(prevFormData => ({
        ...prevFormData,
        [imageType === 'main' ? 'bottleImage' : imageType === 'hover' ? 'hoverImage' : 'thirdImage']: response.data.imagePath
      }));
      
      showToast(`${imageType === 'main' ? 'Main' : imageType === 'hover' ? 'Hover' : 'Third'} image uploaded successfully!`, 'success');
      
      // Reset the file input
      e.target.value = '';
    } catch (error) {
      console.error('Image upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      showToast('Error uploading image: ' + errorMessage, 'error');
      e.target.value = '';
    } finally {
      if (imageType === 'main') setUploadingImage(false);
      else if (imageType === 'hover') setUploadingHoverImage(false);
      else if (imageType === 'third') setUploadingThirdImage(false);
    }
  };

  const handleToggleVisibility = async (productId, currentVisibility) => {
    try {
      await axios.put(`/api/admin/products/${productId}`, { isVisible: !currentVisibility });
      showToast(`Product ${!currentVisibility ? 'shown' : 'hidden'} successfully!`, 'success');
      fetchProducts();
    } catch (error) {
      showToast('Error updating product visibility', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        showToast('Product deleted successfully!', 'success');
        fetchProducts();
      } catch (error) {
        showToast('Error deleting product', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: 'Male',
      impressionOf: '',
      topNotes: [],
      heartNotes: [],
      baseNotes: [],
      bottleImage: '',
      hoverImage: '',
      thirdImage: '',
      themeColor: '#d4af37',
      rating: 0,
      description: '',
      actualPrice: 0,
      discountedPrice: '',
      stock: 0,
      isVisible: true,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div className="form-group">
                <label>Impression Of</label>
                <input
                  type="text"
                  name="impressionOf"
                  value={formData.impressionOf}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Actual Price (Required)</label>
                <input
                  type="number"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Discounted Price (Optional)</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Leave empty if no discount"
                />
                <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                  If provided, this will be the selling price and actual price will be shown crossed out
                </small>
              </div>
              <div className="form-group">
                <label>Main Image (Required)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'main')}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p style={{ color: '#d4af37', marginTop: '5px' }}>Uploading to Cloudinary...</p>}
                {formData.bottleImage && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      key={`preview-${formData.bottleImage}`}
                      src={formData.bottleImage} 
                      alt="Preview" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        border: '2px solid #d4af37',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        display: 'block'
                      }} 
                      onError={(e) => {
                        const img = e.target;
                        if (!img.dataset.errorHandled && !img.src.includes('placeholder')) {
                          img.dataset.errorHandled = 'true';
                          img.src = '/images/perfumes/placeholder.jpg';
                        }
                      }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#999', wordBreak: 'break-all', marginTop: '5px' }}>
                      {formData.bottleImage.length > 50 
                        ? formData.bottleImage.substring(0, 50) + '...' 
                        : formData.bottleImage}
                    </p>
                  </div>
                )}
                <input
                  type="text"
                  name="bottleImage"
                  value={formData.bottleImage}
                  onChange={handleChange}
                  placeholder="Or enter image URL manually"
                  style={{ marginTop: '10px', width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label>Hover Image (Shown on hover)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'hover')}
                  disabled={uploadingHoverImage}
                />
                {uploadingHoverImage && <p style={{ color: '#d4af37', marginTop: '5px' }}>Uploading to Cloudinary...</p>}
                {formData.hoverImage && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={formData.hoverImage} 
                      alt="Hover Preview" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        border: '2px solid #d4af37',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        display: 'block'
                      }} 
                      onError={(e) => {
                        const img = e.target;
                        if (!img.dataset.errorHandled && !img.src.includes('placeholder')) {
                          img.dataset.errorHandled = 'true';
                          img.src = '/images/perfumes/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="hoverImage"
                  value={formData.hoverImage}
                  onChange={handleChange}
                  placeholder="Or enter hover image URL manually"
                  style={{ marginTop: '10px', width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label>Third Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'third')}
                  disabled={uploadingThirdImage}
                />
                {uploadingThirdImage && <p style={{ color: '#d4af37', marginTop: '5px' }}>Uploading to Cloudinary...</p>}
                {formData.thirdImage && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={formData.thirdImage} 
                      alt="Third Preview" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        border: '2px solid #d4af37',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        display: 'block'
                      }} 
                      onError={(e) => {
                        const img = e.target;
                        if (!img.dataset.errorHandled && !img.src.includes('placeholder')) {
                          img.dataset.errorHandled = 'true';
                          img.src = '/images/perfumes/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="thirdImage"
                  value={formData.thirdImage}
                  onChange={handleChange}
                  placeholder="Or enter third image URL manually"
                  style={{ marginTop: '10px', width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  />
                  <span>Visible to customers</span>
                </label>
                <small style={{ color: '#999', fontSize: '0.85rem' }}>
                  Uncheck to hide this product from customers while keeping it in inventory
                </small>
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Theme Color</label>
                <input
                  type="color"
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Top Notes (comma-separated)</label>
                <input
                  type="text"
                  name="topNotes"
                  value={formData.topNotes.join(', ')}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Heart Notes (comma-separated)</label>
                <input
                  type="text"
                  name="heartNotes"
                  value={formData.heartNotes.join(', ')}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Base Notes (comma-separated)</label>
                <input
                  type="text"
                  name="baseNotes"
                  value={formData.baseNotes.join(', ')}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    key={`img-${product._id}`}
                    src={product.bottleImage || '/images/perfumes/placeholder.jpg'}
                    alt={product.name}
                    className="product-thumb"
                    loading="lazy"
                    onError={(e) => {
                      // Prevent infinite loop - only set once
                      const img = e.target;
                      if (!img.dataset.errorHandled && !img.src.includes('placeholder')) {
                        img.dataset.errorHandled = 'true';
                        img.src = '/images/perfumes/placeholder.jpg';
                      }
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.gender}</td>
                <td>
                  {product.discountedPrice ? (
                    <div>
                      <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '0.5rem' }}>
                        Rs {product.actualPrice || product.price}
                      </span>
                      <span style={{ color: '#d4af37', fontWeight: '600' }}>
                        Rs {product.discountedPrice}
                      </span>
                      <span style={{ color: '#dc3545', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                        ({Math.round(((product.actualPrice || product.price) - product.discountedPrice) / (product.actualPrice || product.price) * 100)}% off)
                      </span>
                    </div>
                  ) : (
                    <span>Rs {product.actualPrice || product.price}</span>
                  )}
                </td>
                <td>
                  <span className={product.stock > 0 ? 'in-stock' : 'sold-out'}>
                    {product.stock > 0 ? product.stock : 'Sold Out'}
                  </span>
                </td>
                <td>
                  <button
                    className={product.isVisible !== false ? 'btn-visible' : 'btn-hidden'}
                    onClick={() => handleToggleVisibility(product._id, product.isVisible !== false)}
                    title={product.isVisible !== false ? 'Click to hide' : 'Click to show'}
                  >
                    {product.isVisible !== false ? '✓ Visible' : '✕ Hidden'}
                  </button>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

