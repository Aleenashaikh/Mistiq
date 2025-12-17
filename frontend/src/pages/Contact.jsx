import { useState } from 'react';
import axios from '../config/axios';
import { useToast } from '../context/ToastContext';
import SocialMediaLinks from '../components/SocialMediaLinks';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post('/api/contact', formData);
      showToast('Thank you for your message! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showToast(
        error.response?.data?.message || 'Error sending message. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Mistiq Perfumeries | Perfume Inquiries"
        description="Get in touch with Mistiq Perfumeries. Have questions about our designer perfume dupes, impressions, or want personalized fragrance recommendations? We're here to help."
        url="/contact"
      />
      <div className="contact-page">
        <div className="contact-hero">
        <h1>Let's Connect</h1>
        <p>
          Have questions or want personalized fragrance recommendations? We're here to help.
        </p>
      </div>
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-item">
            <h3>Email</h3>
            <p>mistiqperfumeries@gmail.com</p>
          </div>
          
          <div className="info-item">
            <h3>Follow Us</h3>
            <SocialMediaLinks showQR={true} compact={false} />
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="6"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;

