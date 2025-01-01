import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ModeButton.module.css';

const ModeButton = ({ icon, mainText, subText, onClick }) => (
  <button className={styles.button} onClick={onClick}>
    <FontAwesomeIcon icon={icon} className={styles.iconLeft} />
    <div className={styles.textContainer}>
      <span className={styles.mainText}>{mainText}</span>
      <span className={styles.subText}>{subText}</span>
    </div>
    <div className={styles.iconRight}></div>
  </button>
);

ModeButton.propTypes = {
  icon: PropTypes.string.isRequired,
  mainText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ModeButton;
