import { useState, useEffect, useRef } from 'react';
import axios from '../../config/axios';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const defaultHero = {
  title: '',
  subtitle: '',
  backgroundImage: '',
  heroDesktopMediaType: 'image',
  heroDesktopImageUrl: '',
  heroDesktopVideoUrl: '',
  heroMobileMediaType: 'image',
  heroMobileImageUrl: '',
  heroMobileVideoUrl: '',
  primaryButtonText: 'Shop Now',
  secondaryButtonText: 'Explore Collection',
};

function revokePreview(url) {
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

const HeroEditor = () => {
  const [hero, setHero] = useState(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState({ text: 'Opening Sale Live', isActive: false });
  const [savingBanner, setSavingBanner] = useState(false);
  const { showToast } = useToast();

  /** Files chosen locally; uploaded to Cloudinary only when Save is clicked */
  const [pendingFiles, setPendingFiles] = useState({
    heroDesktopImage: null,
    heroMobileImage: null,
    heroDesktopVideo: null,
    heroMobileVideo: null,
  });
  const [previews, setPreviews] = useState({
    heroDesktopImage: '',
    heroMobileImage: '',
    heroDesktopVideo: '',
    heroMobileVideo: '',
  });
  const previewsRef = useRef(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach(revokePreview);
    };
  }, []);

  useEffect(() => {
    fetchHero();
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await axios.get('/api/products/announcement');
      setBanner(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHero = async () => {
    try {
      const { data } = await axios.get('/api/admin/hero');
      setHero({
        ...defaultHero,
        ...data,
        heroDesktopMediaType: data.heroDesktopMediaType === 'video' ? 'video' : 'image',
        heroMobileMediaType: data.heroMobileMediaType === 'video' ? 'video' : 'image',
        heroDesktopImageUrl:
          data.heroDesktopImageUrl || data.backgroundImage || '',
        heroMobileImageUrl: data.heroMobileImageUrl || '',
      });
      setPendingFiles({
        heroDesktopImage: null,
        heroMobileImage: null,
        heroDesktopVideo: null,
        heroMobileVideo: null,
      });
      setPreviews((p) => {
        Object.values(p).forEach(revokePreview);
        return {
          heroDesktopImage: '',
          heroMobileImage: '',
          heroDesktopVideo: '',
          heroMobileVideo: '',
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const setPendingFile = (key, file) => {
    setPreviews((prev) => {
      revokePreview(prev[key]);
      return {
        ...prev,
        [key]: file ? URL.createObjectURL(file) : '',
      };
    });
    setPendingFiles((p) => ({ ...p, [key]: file }));
  };

  const onPickImage = (pendingKey) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!ok.includes(file.type)) {
      showToast('Use JPG, PNG, GIF, or WEBP.', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('Max 15MB.', 'error');
      return;
    }
    setPendingFile(pendingKey, file);
    showToast('File selected. Click Save changes to upload to Cloudinary and publish.', 'success');
  };

  const onPickVideo = (pendingKey) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      showToast('Max 100MB for video.', 'error');
      return;
    }
    setPendingFile(pendingKey, file);
    showToast('File selected. Click Save changes to upload to Cloudinary and publish.', 'success');
  };

  const clearPendingSlot = (pendingKey, urlField) => {
    setPendingFile(pendingKey, null);
    setHero((h) => ({ ...h, [urlField]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = { ...hero };

      const uploadIfNeeded = async (pendingKey, urlField, kind, endpoint) => {
        const file = pendingFiles[pendingKey];
        if (!file) return;
        const isImage = kind === 'image';
        const typeOk =
          (pendingKey.includes('Desktop') &&
            ((isImage && hero.heroDesktopMediaType === 'image') ||
              (!isImage && hero.heroDesktopMediaType === 'video'))) ||
          (pendingKey.includes('Mobile') &&
            ((isImage && hero.heroMobileMediaType === 'image') ||
              (!isImage && hero.heroMobileMediaType === 'video')));
        if (!typeOk) return;

        const fd = new FormData();
        fd.append(isImage ? 'image' : 'video', file);
        const { data } = await axios.post(`/api/upload/${endpoint}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const url = isImage ? data.imagePath : data.videoPath;
        if (!url) throw new Error('Upload response missing URL');
        payload[urlField] = url;
      };

      await uploadIfNeeded('heroDesktopImage', 'heroDesktopImageUrl', 'image', 'hero-image-desktop');
      await uploadIfNeeded('heroMobileImage', 'heroMobileImageUrl', 'image', 'hero-image-mobile');
      await uploadIfNeeded('heroDesktopVideo', 'heroDesktopVideoUrl', 'video', 'hero-video-desktop');
      await uploadIfNeeded('heroMobileVideo', 'heroMobileVideoUrl', 'video', 'hero-video-mobile');

      payload.backgroundImage = payload.heroDesktopImageUrl || payload.backgroundImage;

      const { data: saved } = await axios.put('/api/admin/hero', payload);
      setHero({
        ...defaultHero,
        ...saved,
        heroDesktopMediaType: saved.heroDesktopMediaType === 'video' ? 'video' : 'image',
        heroMobileMediaType: saved.heroMobileMediaType === 'video' ? 'video' : 'image',
        heroDesktopImageUrl: saved.heroDesktopImageUrl || saved.backgroundImage || '',
        heroMobileImageUrl: saved.heroMobileImageUrl || '',
      });
      setPendingFiles({
        heroDesktopImage: null,
        heroMobileImage: null,
        heroDesktopVideo: null,
        heroMobileVideo: null,
      });
      setPreviews((p) => {
        Object.values(p).forEach(revokePreview);
        return {
          heroDesktopImage: '',
          heroMobileImage: '',
          heroDesktopVideo: '',
          heroMobileVideo: '',
        };
      });
      showToast('Uploaded to Cloudinary and hero saved.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const MediaBlock = ({
    label,
    aspectNote,
    mediaTypeName,
    imageUrlName,
    videoUrlName,
    imagePendingKey,
    videoPendingKey,
  }) => {
    const imgPreview = previews[imagePendingKey] || hero[imageUrlName];
    const vidPreview = previews[videoPendingKey] || hero[videoUrlName];

    return (
      <div
        style={{
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 12,
          padding: '1.25rem',
          marginBottom: '1.5rem',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 1rem', color: 'var(--gold, #d4af37)', fontSize: '1.1rem' }}>
          {label}
        </h3>
        <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{aspectNote}</p>
        <p style={{ color: '#c9a227', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Choose a file, then click <strong>Save changes</strong> to upload it to Cloudinary and store the link.
        </p>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Media type</label>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name={mediaTypeName}
                checked={hero[mediaTypeName] === 'image'}
                onChange={() => setHero({ ...hero, [mediaTypeName]: 'image' })}
              />
              Image
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name={`${mediaTypeName}v`}
                checked={hero[mediaTypeName] === 'video'}
                onChange={() => setHero({ ...hero, [mediaTypeName]: 'video' })}
              />
              Video
            </label>
          </div>
        </div>

        {hero[mediaTypeName] === 'image' ? (
          <>
            <div className="form-group">
              <label>Select image file</label>
              <input type="file" accept="image/*" onChange={onPickImage(imagePendingKey)} />
              {pendingFiles[imagePendingKey] && (
                <p style={{ color: '#8f8', fontSize: '0.85rem', marginTop: 6 }}>
                  Ready to upload on Save: {pendingFiles[imagePendingKey].name}
                </p>
              )}
            </div>
            {imgPreview && (
              <div style={{ margin: '10px 0' }}>
                <img
                  src={imgPreview}
                  alt=""
                  style={{
                    maxWidth: '100%',
                    maxHeight: 160,
                    objectFit: 'contain',
                    border: '2px solid #d4af37',
                    borderRadius: 8,
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: 8, fontSize: '0.85rem' }}
                  onClick={() => clearPendingSlot(imagePendingKey, imageUrlName)}
                >
                  Remove image
                </button>
              </div>
            )}
            <div className="form-group">
              <label>Or paste image URL (saved on Save without re-upload)</label>
              <input
                type="text"
                name={imageUrlName}
                value={hero[imageUrlName] || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Select video file</label>
              <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={onPickVideo(videoPendingKey)} />
              {pendingFiles[videoPendingKey] && (
                <p style={{ color: '#8f8', fontSize: '0.85rem', marginTop: 6 }}>
                  Ready to upload on Save: {pendingFiles[videoPendingKey].name}
                </p>
              )}
            </div>
            {vidPreview && (
              <div style={{ marginTop: 8 }}>
                <video src={vidPreview} controls muted style={{ maxWidth: '100%', maxHeight: 200 }} />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: 8, fontSize: '0.85rem' }}
                  onClick={() => clearPendingSlot(videoPendingKey, videoUrlName)}
                >
                  Remove video
                </button>
              </div>
            )}
            <div className="form-group">
              <label>Or paste video URL</label>
              <input
                type="text"
                name={videoUrlName}
                value={hero[videoUrlName] || ''}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/...mp4"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading hero section…</div>;

  return (
    <div className="admin-page">
      <h1>Edit Hero Section</h1>

      <form onSubmit={handleSubmit} className="hero-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={hero.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Subtitle</label>
          <textarea name="subtitle" value={hero.subtitle} onChange={handleChange} rows={3} required />
        </div>

        <MediaBlock
          label="Desktop (wide screens)"
          aspectNote="Designed for 1920×900 px. Cloudinary folder: hero/desktop."
          mediaTypeName="heroDesktopMediaType"
          imageUrlName="heroDesktopImageUrl"
          videoUrlName="heroDesktopVideoUrl"
          imagePendingKey="heroDesktopImage"
          videoPendingKey="heroDesktopVideo"
        />

        <MediaBlock
          label="Mobile (phones & small tablets)"
          aspectNote="Designed for 800×900 px. Leave empty to reuse desktop media."
          mediaTypeName="heroMobileMediaType"
          imageUrlName="heroMobileImageUrl"
          videoUrlName="heroMobileVideoUrl"
          imagePendingKey="heroMobileImage"
          videoPendingKey="heroMobileVideo"
        />

        <div className="form-group">
          <label>Primary button</label>
          <input type="text" name="primaryButtonText" value={hero.primaryButtonText} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Secondary button (label only)</label>
          <input
            type="text"
            name="secondaryButtonText"
            value={hero.secondaryButtonText}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Uploading & saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: '3rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--off-white)' }}>Announcement banner</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSavingBanner(true);
            try {
              await axios.put('/api/admin/announcement', banner);
              showToast('Banner saved.', 'success');
            } catch (err) {
              showToast(err.response?.data?.message || err.message, 'error');
            } finally {
              setSavingBanner(false);
            }
          }}
          className="hero-form"
        >
          <div className="form-group">
            <label>Banner text</label>
            <input
              type="text"
              value={banner.text}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                style={{ width: 'auto' }}
              />
              Show banner
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={savingBanner}>
              {savingBanner ? 'Saving…' : 'Save banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroEditor;
