import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const HeroEditor = () => {
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    backgroundImage: '',
    backgroundVideo: '',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Vote Your Favorite',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [banner, setBanner] = useState({
    text: 'Opening Sale Live',
    isActive: false,
  });
  const [savingBanner, setSavingBanner] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHero();
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await axios.get('/api/products/announcement');
      setBanner(response.data);
    } catch (error) {
      console.error('Error fetching announcement banner:', error);
    }
  };

  const fetchHero = async () => {
    try {
      const response = await axios.get('/api/admin/hero');
      setHero(response.data);
    } catch (error) {
      console.error('Error fetching hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/mkv'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload MP4, MOV, AVI, WEBM, or MKV videos.', 'error');
      e.target.value = '';
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      showToast('File size too large. Maximum size is 100MB.', 'error');
      e.target.value = '';
      return;
    }

    setUploadingVideo(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('video', file);

      const response = await axios.post('/api/upload/product-video', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data || !response.data.videoPath) {
        throw new Error('Invalid response from server');
      }

      setHero(prevHero => ({
        ...prevHero,
        backgroundVideo: response.data.videoPath
      }));

      showToast('Video uploaded successfully!', 'success');
      e.target.value = '';
    } catch (error) {
      console.error('Video upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload video';
      showToast('Error uploading video: ' + errorMessage, 'error');
      e.target.value = '';
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e) => {
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

    setUploadingImage(true);
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

      setHero(prevHero => ({
        ...prevHero,
        backgroundImage: response.data.imagePath
      }));

      showToast('Image uploaded successfully!', 'success');
      e.target.value = '';
    } catch (error) {
      console.error('Image upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      showToast('Error uploading image: ' + errorMessage, 'error');
      e.target.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/hero', hero);
      showToast('Hero section updated successfully!', 'success');
    } catch (error) {
      showToast('Error updating hero section: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading hero section...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Edit Hero Section</h1>
      
      <form onSubmit={handleSubmit} className="hero-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={hero.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Subtitle</label>
          <textarea
            name="subtitle"
            value={hero.subtitle}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            style={{ marginBottom: '10px' }}
          />
          {uploadingImage && <p style={{ color: '#d4af37', marginBottom: '10px' }}>Uploading to Cloudinary...</p>}
          {hero.backgroundImage && (
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <img
                src={hero.backgroundImage}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '120px',
                  objectFit: 'cover',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  display: 'block'
                }}
                onError={(e) => {
                  const img = e.target;
                  if (!img.dataset.errorHandled) {
                    img.dataset.errorHandled = 'true';
                    img.src = '/images/perfumes/placeholder.jpg';
                  }
                }}
              />
            </div>
          )}
          <input
            type="text"
            name="backgroundImage"
            value={hero.backgroundImage}
            onChange={handleChange}
            placeholder="Or enter image URL manually"
            style={{ marginTop: '10px', width: '100%' }}
          />
        </div>
        
        <div className="form-group">
          <label>Background Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={uploadingVideo}
            style={{ marginBottom: '10px' }}
          />
          {uploadingVideo && <p style={{ color: '#d4af37', marginBottom: '10px' }}>Uploading to Cloudinary...</p>}
          {hero.backgroundVideo && (
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <video
                src={hero.backgroundVideo}
                controls
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  maxHeight: '225px',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  display: 'block'
                }}
              >
                Your browser does not support the video tag.
              </video>
              <p style={{ fontSize: '0.85rem', color: '#999', wordBreak: 'break-all', marginTop: '5px' }}>
                {hero.backgroundVideo.length > 60
                  ? hero.backgroundVideo.substring(0, 60) + '...'
                  : hero.backgroundVideo}
              </p>
            </div>
          )}
          <input
            type="text"
            name="backgroundVideo"
            value={hero.backgroundVideo}
            onChange={handleChange}
            placeholder="Or enter video URL manually"
            style={{ marginTop: '10px', width: '100%' }}
          />
          <small style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
            Supported formats: MP4, MOV, AVI, WEBM, MKV (Max 100MB)
          </small>
        </div>
        
        <div className="form-group">
          <label>Primary Button Text</label>
          <input
            type="text"
            name="primaryButtonText"
            value={hero.primaryButtonText}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Secondary Button Text</label>
          <input
            type="text"
            name="secondaryButtonText"
            value={hero.secondaryButtonText}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Announcement Banner</h2>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          setSavingBanner(true);
          try {
            await axios.put('/api/admin/announcement', banner);
            showToast('Announcement banner updated successfully!', 'success');
          } catch (error) {
            showToast('Error updating announcement banner: ' + (error.response?.data?.message || error.message), 'error');
          } finally {
            setSavingBanner(false);
          }
        }} className="hero-form">
          <div className="form-group">
            <label>Banner Text</label>
            <input
              type="text"
              value={banner.text}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
              placeholder="Opening Sale Live"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <span>Show Announcement Banner</span>
            </label>
            <small style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              When enabled, the banner will appear below the hero section on the homepage.
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={savingBanner}>
              {savingBanner ? 'Saving...' : 'Save Banner Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroEditor;

