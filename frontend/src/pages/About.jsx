import SocialMediaLinks from '../components/SocialMediaLinks';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  return (
    <>
      <SEO 
        title="About Us - Mistiq Perfumeries | Luxury Fragrance Brand"
        description="Learn about Mistiq Perfumeries - our story, mission, and commitment to creating luxury fragrances and designer perfume dupes. Discover affordable impressions of Gucci, Dior, Azzaro and more."
        url="/about"
      />
      <div className="about-page">
      <div className="about-hero">
        <h1>Our Story</h1>
      </div>
      <div className="about-content">
        <div className="about-section">
          <p className="about-intro">
            Mistiq Perfumeries was created with a simple vision—to make luxury fragrances more personal. 
            We believe a scent is more than a fragrance; it's an identity.
          </p>
          <p>
            Our artisans blend premium natural extracts with modern perfumery techniques to deliver scents 
            that elevate your everyday moments. Each fragrance is carefully crafted to tell a story, to 
            capture a mood, and to become a part of who you are.
          </p>
        </div>
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To empower individuals to express themselves through fragrance. We believe everyone deserves 
            to find their signature scent—one that resonates with their personality and enhances their presence.
          </p>
        </div>
        <div className="tagline-section">
          <h2>Unveil your essence.</h2>
        </div>
        <div className="about-social-section">
          <h3>Connect With Us</h3>
          <SocialMediaLinks showQR={true} compact={false} />
        </div>
      </div>
    </div>
    </>
  );
};

export default About;

