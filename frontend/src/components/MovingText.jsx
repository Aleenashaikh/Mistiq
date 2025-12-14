import './MovingText.css';

const MovingText = () => {
  return (
    <section className="moving-text-section">
      <div className="marquee-container">
        <div className="marquee marquee-left">
          <div className="marquee-content">
            <span className="marquee-text">A SCENT OF CONVICTION AND DUST</span>
            <span className="marquee-text">A SCENT OF CONVICTION AND DUST</span>
            <span className="marquee-text">A SCENT OF CONVICTION AND DUST</span>
            <span className="marquee-text">A SCENT OF CONVICTION AND DUST</span>
          </div>
        </div>
        <div className="marquee marquee-right">
          <div className="marquee-content">
            <span className="marquee-text">MISTIQ PERFUMERIES</span>
            <span className="marquee-text">MISTIQ PERFUMERIES</span>
            <span className="marquee-text">MISTIQ PERFUMERIES</span>
            <span className="marquee-text">MISTIQ PERFUMERIES</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovingText;

