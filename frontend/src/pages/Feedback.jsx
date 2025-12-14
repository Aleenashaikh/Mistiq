import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import SocialMediaLinks from '../components/SocialMediaLinks';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stars: 5,
    comments: '',
    product: '',
  });
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'stars' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/feedback', formData);
      showToast('Thank you for your feedback!', 'success');
      setFormData({
        name: '',
        email: '',
        stars: 5,
        comments: '',
        product: '',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast(
        error.response?.data?.message || 'Error submitting feedback. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-hero">
        <h1>Share Your Experience</h1>
        <p>
          Your feedback helps us improve and helps others discover the perfect fragrance.
          We'd love to hear about your experience with Mistiq Perfumeries.
        </p>
      </div>

      <div className="feedback-container">
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product">Product (Optional)</label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
            >
              <option value="">Select a product (optional)</option>
              {products.map((product) => (
                <option key={product._id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stars">Rating *</label>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= formData.stars ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, stars: star })}
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              <input
                type="hidden"
                name="stars"
                value={formData.stars}
                required
              />
            </div>
            <small>Click on a star to rate (1-5 stars)</small>
          </div>

          <div className="form-group">
            <label htmlFor="comments">Your Feedback *</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Tell us about your experience..."
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="feedback-social-section">
          <h3>Connect With Us</h3>
          <SocialMediaLinks showQR={true} compact={false} />
        </div>
      </div>
    </div>
  );
};

export default Feedback;

