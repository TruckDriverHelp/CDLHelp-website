import { useEffect, useState, useContext } from 'react';
import QuizContext from '../../store/quiz-context';
import { useTranslation } from '../../lib/useTranslation';

const Stopwatch = ({ translation }) => {
  const { t } = useTranslation(translation);
  const quizCtx = useContext(QuizContext);
  const { running, time, setTime } = quizCtx;

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1000);
      }, 1000);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="numbers">
      {t('stopwatchTime') + ': '}
      <strong style={running ? { color: 'black' } : { color: '#D33231' }}>
        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      </strong>
    </div>
  );
};

export default Stopwatch;
