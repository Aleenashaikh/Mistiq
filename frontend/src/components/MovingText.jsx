import './MovingText.css';

const MovingText = () => {
  const renderTextWithGradientWords = (text) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="marquee-text" data-text={word + (index < text.split(' ').length - 1 ? ' ' : '')}>
        {word}
        {index < text.split(' ').length - 1 && ' '}
      </span>
    ));
  };

  return (
    <section className="moving-text-section">
      <div className="marquee-container">
        <div className="marquee marquee-left">
          <div className="marquee-content">
            {renderTextWithGradientWords('A SCENT OF CONVICTION AND DUST')}
            {renderTextWithGradientWords('A SCENT OF CONVICTION AND DUST')}
            {renderTextWithGradientWords('A SCENT OF CONVICTION AND DUST')}
            {renderTextWithGradientWords('A SCENT OF CONVICTION AND DUST')}
          </div>
        </div>
        <div className="marquee marquee-right">
          <div className="marquee-content">
            {renderTextWithGradientWords('MISTIQ PERFUMERIES')}
            {renderTextWithGradientWords('MISTIQ PERFUMERIES')}
            {renderTextWithGradientWords('MISTIQ PERFUMERIES')}
            {renderTextWithGradientWords('MISTIQ PERFUMERIES')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovingText;

