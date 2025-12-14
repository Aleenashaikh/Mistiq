import './SocialMediaLinks.css';

const SocialMediaLinks = ({ showQR = true, compact = false }) => {
  const facebookUrl = 'https://www.facebook.com/share/1AXy4umRQy/?mibextid=wwXIfr';
  const instagramUrl = 'https://www.instagram.com/mistiqperfumeries?igsh=MWkyb2lyZmdlNm5pbQ%3D%3D&utm_source=qr';
  const whatsappNumber = '923341406111';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className={`social-media-links ${compact ? 'compact' : ''}`}>
      <div className="social-icons">
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link facebook"
          aria-label="Visit our Facebook page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </a>
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link instagram"
          aria-label="Visit our Instagram page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>Instagram</span>
        </a>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link whatsapp"
          aria-label="Contact us on WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.089c0 1.847.485 3.58 1.335 5.081L0 24l8.801-2.335a11.882 11.882 0 003.25.447h.001c6.554 0 11.89-5.335 11.89-11.889 0-3.176-1.24-6.165-3.495-8.411"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
      {showQR && (
        <div className="whatsapp-qr-section">
          <div className="qr-container">
            <img 
              src="/images/whatsapp-qr.jpg" 
              alt="WhatsApp QR Code - Scan to start a chat with Mistiq Perfumeries"
              className="whatsapp-qr-image"
              onError={(e) => {
                // Fallback if QR code image doesn't exist
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="qr-fallback" style={{ display: 'none' }}>
              <p>Scan to chat on WhatsApp</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                wa.me/{whatsappNumber}
              </a>
            </div>
          </div>
          <p className="qr-text">Scan this code to start a WhatsApp chat with Mistiq.</p>
        </div>
      )}
    </div>
  );
};

export default SocialMediaLinks;

