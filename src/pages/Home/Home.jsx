import { useNavigate } from 'react-router-dom';
import ModeButton from '../../components/ModeButton/ModeButton';
import { faUniversity, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>GeoQuiz</h1>
      </header>
      <div className={styles.buttonContainer}>
        <ModeButton
          icon={faUniversity}
          mainText="CAPITAL CITIES"
          subText="PLAY"
          onClick={() => navigate('/region-selection?mode=capitals')}
        />
        <ModeButton
          icon={faPencilAlt}
          mainText="COUNTRIES"
          subText="PLAY"
          onClick={() => navigate('/region-selection?mode=countries')}
        />
      </div>
    </div>
  );
};

export default Home;