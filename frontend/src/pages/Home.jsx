import Hero from '../components/Hero';
import AnnouncementBanner from '../components/AnnouncementBanner';
import SplitSection from '../components/SplitSection';
import CircularSlider from '../components/CircularSlider';
import MovingText from '../components/MovingText';
import Feedbacks from '../components/Feedbacks';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <AnnouncementBanner />
      <SplitSection />
      <CircularSlider />
      <MovingText />
      <Feedbacks />
    </div>
  );
};

export default Home;

