import { useEffect, useState, useContext } from 'react';
import Answers from './answers';
import styles from './quiz.module.css';
import QuizContext from '../../store/quiz-context';
import Top from './top';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import quizData from '../../data/quiz-questions.json';
import ConfettiExplosion from 'react-confetti-explosion';
import analytics from '../../lib/analytics';

const Quiz = ({ title, id, name, translation, contained }) => {
  const { t } = useTranslation('index');
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isExploding, setIsExploding] = useState(false);

  // Filter questions based on locale and test type
  const filteredQuestions = quizData.filter(question => {
    // Skip Tanker, Hazmat, and Double/Triple tests for locales with additional tests
    if (['ru', 'uk', 'en'].includes(router.locale)) {
      const questionText = question.question[router.locale] || question.question.en;
      const isTanker =
        questionText.toLowerCase().includes('tanker') ||
        questionText.toLowerCase().includes('цистерн') ||
        questionText.toLowerCase().includes('цистерни');
      const isHazmat =
        questionText.toLowerCase().includes('hazmat') ||
        questionText.toLowerCase().includes('опасн') ||
        questionText.toLowerCase().includes('небезпечн');
      const isDoubleTriple =
        questionText.toLowerCase().includes('double') ||
        questionText.toLowerCase().includes('triple') ||
        questionText.toLowerCase().includes('двойн') ||
        questionText.toLowerCase().includes('тройн');

      return !(isTanker || isHazmat || isDoubleTriple);
    }
    return true;
  });

  useEffect(() => {
    setSelected(false);
    setWrong([]);
    setDisabled(true);
  }, []);

  const quizCtx = useContext(QuizContext);
  const { translate, selected, setSelected, wrong, setWrong, setDisabled } = quizCtx;

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const correct = currentQuestion.answer;

  const handleSelect = i => {
    if (selected === i && selected === correct) return false;
    else if (selected === i && selected !== correct) return 'red';
    else if (selected !== i && i !== correct) return 'grey';
    else if (i === correct) return false;
  };

  const handleCheck = i => {
    setSelected(i);

    const questionResult = {
      questionIndex: currentQuestionIndex,
      userAnswer: i,
      isCorrect: i === correct,
    };

    setAnsweredQuestions([...answeredQuestions, questionResult]);

    if (i === correct) {
      setUserScore(userScore + 1);
    } else {
      setWrong([...wrong]);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(false);
    } else {
      if (userScore === filteredQuestions.length) {
        setIsExploding(true);
      }
      setShowResults(true);

      // Track quiz completion
      analytics.trackQuizCompletion(userScore, filteredQuestions.length, router.locale);
    }
  };

  const renderResults = () => {
    return (
      <div className={styles.results}>
        <h2>{t('quizResults')}</h2>
        <p>
          {t('yourScore')}: {userScore} / {filteredQuestions.length}
        </p>
        {isExploding && (
          <ConfettiExplosion particleCount={100} duration={3000} force={0.6} width={1000} />
        )}
        <div
          className={styles.nav}
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginTop: '20px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href={`https://test.cdlhelp.com/${router.locale == 'en' ? '' : router.locale}`}
            className="translation-btn"
            style={{
              background: 'transparent',
              padding: '12px 25px',
              border: '2px solid #5a5886',
              borderRadius: '10px',
              color: '#5a5886',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = '#5a5886';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#5a5886';
            }}
          >
            {t('tryTestsOnline')}
          </a>
          <a
            href={`/${router.locale == 'en' ? '' : router.locale + '/'}download`}
            className="translation-btn"
            style={{
              background: 'linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)',
              padding: '12px 25px',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0px 12px 35px rgba(90, 88, 134, 0.25)',
              color: 'white',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="ri-smartphone-line" style={{ fontSize: '18px' }}></i>
            {t('downloadAppButton')}
          </a>
        </div>
      </div>
    );
  };

  if (showResults) {
    return <div className={contained ? styles.quiz : ''}>{renderResults()}</div>;
  }

  return (
    <div className={contained ? styles.quiz : ''}>
      {['ru', 'uk', 'en'].includes(router.locale) ? (
        <div style={{ gap: 0, textAlign: 'center', color: '#d45058' }}></div>
      ) : null}

      <div className={styles.question}>
        {
          <>
            <div
              dir={translate && ['ar', 'fa', 'he', 'ur'].includes(router.locale) ? 'rtl' : 'ltr'}
            >
              <div className={styles.head}>
                <span>
                  <h4 style={{ textAlign: 'center', margin: '20px auto' }}>
                    {translate
                      ? currentQuestion.question[router.locale]
                      : currentQuestion.question.en}
                  </h4>
                </span>
              </div>
              <Top translation={translation} />
              <Answers
                data={currentQuestion}
                handleSelect={handleSelect}
                handleCheck={handleCheck}
              />
              {selected && (
                <div className={styles.explanation}>
                  <h4>{t('explanation')}</h4>
                  <p>
                    {translate
                      ? currentQuestion.explanation[router.locale]
                      : currentQuestion.explanation.en}
                  </p>
                </div>
              )}
            </div>
            <div
              className={styles.nav}
              style={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {selected && (
                <button
                  onClick={goToNextQuestion}
                  className="translation-btn"
                  style={{
                    background: 'linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)',
                    padding: '12px 25px',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0px 12px 35px rgba(90, 88, 134, 0.25)',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {currentQuestionIndex < filteredQuestions.length - 1
                    ? t('nextQuestion')
                    : t('seeResults')}
                </button>
              )}
              <a
                className="translation-btn"
                href={`https://test.cdlhelp.com/${router.locale == 'en' ? '' : router.locale}`}
                style={{
                  background: 'transparent',
                  padding: '12px 25px',
                  border: '2px solid #5a5886',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#5a5886',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#5a5886';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#5a5886';
                }}
              >
                {t('tryTestsOnline')}
              </a>
              <a
                className="translation-btn"
                href={`/${router.locale == 'en' ? '' : router.locale + '/'}download`}
                style={{
                  background: 'linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)',
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '10px',
                  boxShadow: '0px 12px 35px rgba(90, 88, 134, 0.25)',
                  textDecoration: 'none',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <i className="ri-smartphone-line" style={{ fontSize: '18px' }}></i>
                {t('downloadAppButton')}
              </a>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default Quiz;
