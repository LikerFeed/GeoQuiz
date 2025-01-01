import { useState, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faMoneyBill, faHeart, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [lives, setLives] = useState(3);
  const [result, setResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode') || 'capitals';
  const region = new URLSearchParams(location.search).get('region') || 'All';

  useEffect(() => {
    const preparedQuestions = prepareQuestions(data, mode, region);
    setShuffledQuestions(preparedQuestions);
    setQuestion(preparedQuestions[0]);
  }, [mode, region]);

  const prepareQuestions = (data, mode, region) => {
    const regionData = data[region] || [];
    const shuffledData = shuffleArray(regionData);
  
    return shuffledData.map((item) => {
      const isCapitalsMode = mode === 'capitals';
      const correctAnswer = isCapitalsMode ? item.capital : item.country;
      const incorrectOptions = getRandomOptions(correctAnswer, regionData, isCapitalsMode);
      const options = shuffleArray([correctAnswer, ...incorrectOptions]);
  
      return {
        question: isCapitalsMode ? `${item.country}` : `${item.capital}`,
        options,
        correctAnswer: options.indexOf(correctAnswer) + 1,
        hint: { population: item.population, currency: item.currency },
        optionsMap: Object.fromEntries(
          options.map((option) => [
            option,
            isCapitalsMode
              ? regionData.find((entry) => entry.capital === option)?.country || ''
              : regionData.find((entry) => entry.country === option)?.capital || '',
          ])
        ),
      };
    });
  };
  
  const getRandomOptions = (correct, regionData, isCapitalsMode) => {
    const others = regionData
      .filter((item) => (isCapitalsMode ? item.capital !== correct : item.country !== correct))
      .map((item) => (isCapitalsMode ? item.capital : item.country));
    return shuffleArray(others).slice(0, 3);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    if (gameOver || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, result]);

  const handleTimeout = () => {
    setLives((prevLives) => {
      if (prevLives - 1 === 0) {
        setGameOver(true);
      }
      return prevLives - 1;
    });
    setTimeLeft(20);
  };

  const checkAnswer = (e, ans) => {
    if (!lock && question) {
      const selectedOption = question.options[ans - 1];
      if (question.correctAnswer === ans) {
        e.target.classList.add('correct');
        setLock(true);
        setTimeout(() => nextQuestion(), 1000);
      } else {
        e.target.classList.add('wrong');
        const countryElement = e.target.querySelector('.answer-source');
        if (countryElement) {
          countryElement.textContent = question.optionsMap[selectedOption];
        }
        e.target.style.pointerEvents = 'none';
        setLives((prevLives) => {
          if (prevLives - 1 === 0) {
            setGameOver(true);
          }
          return prevLives - 1;
        });
      }
    }
  };

  const nextQuestion = () => {
    if (index === shuffledQuestions.length - 1) {
      setResult(true);
      return;
    }
    setIndex((prevIndex) => prevIndex + 1);
    setQuestion(shuffledQuestions[index + 1]);
    setLock(false);
    setTimeLeft(20);
    document.querySelectorAll('li').forEach((li) => {
      li.classList.remove('correct', 'wrong');
      li.style.pointerEvents = 'auto';
      const countryElement = li.querySelector('.answer-source');
      if (countryElement) {
        countryElement.textContent = '';
      }
    });
  };

  const reset = () => {
    const preparedQuestions = prepareQuestions(data, mode, region);
    setShuffledQuestions(preparedQuestions);
    setIndex(0);
    setQuestion(preparedQuestions[0]);
    setLock(false);
    setLives(3);
    setResult(false);
    setGameOver(false);
    setTimeLeft(20);
  };

  const calculateProgress = (currentIndex, totalQuestions, result) => {
    if (result) return 100;
    if (currentIndex === 0) return 0;
    return (currentIndex / totalQuestions) * 100;
  };

  const progress = calculateProgress(index, shuffledQuestions.length, result);

  return (
    <div className="page-container">
      <header className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>
          Mode: {mode === 'capitals' ? 'Capitals' : 'Countries'} Region: {region}
        </h1>
      </header>
    <div className="quiz-container">
    {gameOver ? (
      <>
        <h2>Game Over!</h2>
        <button onClick={reset} className="retry-button">
          <FontAwesomeIcon icon={faSyncAlt} className="retry-button-icon-left" />
          <span className="button-text">Try Again</span>
          <div className="retry-button-icon-right"></div>
        </button>
    </>
    ) : result ? (
      <>
        <h2>Congratulations! You have completed the quiz!</h2>
        <button onClick={reset} className="retry-button">
          <FontAwesomeIcon icon={faSyncAlt} className="retry-button-icon-left" />
          <span className="button-text">Try Again</span>
          <div className="retry-button-icon-right"></div>
        </button>
      </>
    ) : question ? (
        <>
          <div className="status">
            <p className="lives">
            {Array.from({ length: 3 }, (_, index) => (
              <FontAwesomeIcon 
                key={index} 
                icon={faHeart} 
                className={index < lives ? 'heart-icon' : 'heart-icon lost'} 
              />
            ))}
            </p>
            <p>{timeLeft} s</p>
          </div>
          <div className="status">
            <p>
              <FontAwesomeIcon icon={faUsers} className='faUsers' />
              {question.hint.population}
            </p>
            <p>
              {question.hint.currency}
              <FontAwesomeIcon icon={faMoneyBill} className='faMoneyBill' />
            </p>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <h2>{question.question}</h2>
          <ul>
            {question.options.map((option, i) => (
              <li key={i} onClick={(e) => checkAnswer(e, i + 1)}>
                {option}
                <span className="answer-source"></span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
    </div>
  );
};

export default Quiz;
