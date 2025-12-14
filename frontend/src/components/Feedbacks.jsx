import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import axios from 'axios';
import './Feedbacks.css';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Fetch 3, 4, or 5 star feedbacks
        console.log('Fetching feedbacks from /api/feedback?minStars=3');
        const response = await axios.get('/api/feedback?minStars=3');
        console.log('Feedbacks API response:', response);
        console.log('Feedbacks data:', response.data);
        console.log('Feedbacks data type:', typeof response.data);
        console.log('Feedbacks data length:', response.data?.length);
        
        if (Array.isArray(response.data)) {
          setFeedbacks(response.data);
        } else {
          console.warn('Response data is not an array:', response.data);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        console.error('Error response:', error.response);
        console.error('Error details:', error.response?.data);
        console.error('Error message:', error.message);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="feedbacks-section">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold)' }}>
          Loading feedbacks...
        </div>
      </section>
    );
  }

  console.log('Feedbacks state:', { loading, count: feedbacks.length, feedbacks });

  // Don't render if no feedbacks
  if (!feedbacks || feedbacks.length === 0) {
    console.log('No feedbacks to display - returning null');
    return null;
  }

  console.log('Rendering feedbacks section with', feedbacks.length, 'feedbacks');

  return (
    <section ref={ref} className="feedbacks-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="feedbacks-header"
      >
        <h2 className="feedbacks-title">What Our Customers Say</h2>
        <p className="feedbacks-subtitle">
          Real experiences from fragrance lovers who trust Mistiq Perfumeries
        </p>
      </motion.div>

      <div className="feedbacks-grid">
        {feedbacks && feedbacks.length > 0 ? feedbacks.map((feedback, index) => {
          // Cycle through names: Sumair Mustafa, Umar Shaikh, Aqsa Shaikh
          const names = ['Sumair Mustafa', 'Umar Shaikh', 'Aqsa Shaikh'];
          const displayName = names[index % names.length];
          
          return (
            <motion.div
              key={feedback._id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="feedback-card"
            >
              <div className="feedback-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < feedback.stars ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="feedback-comments">"{feedback.comments}"</p>
              <div className="feedback-author">
                <span className="feedback-name">{displayName}</span>
                {feedback.product && (
                  <span className="feedback-product">{feedback.product}</span>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--white)' }}>
            No feedbacks available
          </div>
        )}
      </div>
    </section>
  );
};

export default Feedbacks;

