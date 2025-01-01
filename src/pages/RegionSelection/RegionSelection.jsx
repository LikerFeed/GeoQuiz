import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './RegionSelection.module.css';

const RegionSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode');
  const regions = ['Test', 'Europe', 'Asia', 'Americas', 'Africa', 'Australoceania'];

  const handleRegionSelection = (region) => {
    navigate(`/quiz?mode=${mode}&region=${region}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className={styles.title}>Select a Region</h1>
      </header>
      <div className={styles.buttonContainer}>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionSelection(region)}
            className={styles.regionButton}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelection;
