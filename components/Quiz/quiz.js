import { useEffect, useState, useContext } from 'react'
import Answers from './answers'
import styles from './quiz.module.css'
import QuizContext from '../../store/quiz-context'
import Top from './top'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import quizData from '../../data/quiz-questions.json'
import ConfettiExplosion from 'react-confetti-explosion';

const Quiz = ({ title, id, name, translation }) => {
    const { t } = useTranslation('index');
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isExploding, setIsExploding] = useState(false);

    useEffect(() => {
        setSelected(false)
        setWrong([])
        setDisabled(true)
    }, [])

    const quizCtx = useContext(QuizContext)
    const {
        translate,
        selected,
        setSelected,
        wrong,
        setWrong,
        setDisabled } = quizCtx

    const currentQuestion = quizData[currentQuestionIndex];
    const correct = currentQuestion.answer;

    const handleSelect = (i) => {
        if (selected === i && selected === correct) return false;
        else if (selected === i && selected !== correct) return 'red';
        else if (selected !== i && i !== correct) return 'grey';
        else if (i === correct) return false;
    }

    const handleCheck = (i) => {
        setSelected(i);
        
        const questionResult = {
            questionIndex: currentQuestionIndex,
            userAnswer: i,
            isCorrect: i === correct
        };
        
        setAnsweredQuestions([...answeredQuestions, questionResult]);
        
        if (i === correct) {
            setUserScore(userScore + 1);
        } else {
            setWrong([...wrong])
        }
    }

    const goToNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelected(false);
        } else {
            console.log(userScore, quizData.length)
            if (userScore === quizData.length) {
                setIsExploding(true);
            }
            setShowResults(true);
        }
    }

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserScore(0);
        setShowResults(false);
        setAnsweredQuestions([]);
        setSelected(false);
        setWrong([]);
        setIsExploding(false);
    }

    const renderResults = () => {
        return (
            <div className={styles.results}>
                <h2>{t('quizResults')}</h2>
                <p>{t('yourScore')}: {userScore} / {quizData.length}</p>
                {isExploding && <ConfettiExplosion particleCount={100} duration={3000} force={0.6} width={1000} />}
                <a 
                    href={`https://test.cdlhelp.com/${router.locale == 'en' ? '' : router.locale}`}
                    className="translation-btn"
                    style={{ 
                        background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                        padding: "12px 25px",
                        border: "none",
                        boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {t('tryTestsOnline')}
                </a>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className={styles.quiz}>
                {renderResults()}
            </div>
        );
    }

    return (
        <div className={styles.quiz}>
            {["ru", "uk", "en"].includes(router.locale) ? <div style={{ gap: 0, textAlign: 'center', color: '#d45058' }}>
            </div> : null}

            <div className={styles.question}>
                {
                    <>
                        <div dir={translate && ["ar", "fa", "he", "ur"].includes(router.locale) ? "rtl" : "ltr"}>
                            <div className={styles.head}>
                                <span>
                                    <h4 style={{ textAlign: 'center', margin: "20px auto" }}>
                                        {translate 
                                            ? currentQuestion.question[router.locale]
                                            : currentQuestion.question.en}
                                    </h4>
                                </span>
                            </div>
                            <Top translation={translation} />
                            <Answers data={currentQuestion} handleSelect={handleSelect} handleCheck={handleCheck} />
                            {selected && <div className={styles.explanation}>
                                <h4>{t('explanation')}</h4>
                                <p>{translate ? currentQuestion.explanation[router.locale] : currentQuestion.explanation.en}</p>
                            </div>} 
                        </div>
                        <div className={styles.nav} style={{ width: "100%", margin: "0 auto", display: "flex", gap: "15px", justifyContent: "center" }}>
                            {selected && (
                                <button 
                                    onClick={goToNextQuestion}
                                    className="translation-btn"
                                    style={{ 
                                        background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                                        padding: "12px 25px",
                                        border: "none",
                                        boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)",
                                        color: "white",
                                        cursor: "pointer"
                                    }}
                                >
                                    {currentQuestionIndex < quizData.length - 1 ? t('nextQuestion') : t('seeResults')}
                                </button>
                            )}
                            
                            {/* <button 
                                onClick={() => {
                                    document.getElementById('download').scrollIntoView({ 
                                        behavior: 'smooth'
                                    });
                                }}
                                style={{ 
                                    border: "none",
                                    background: "none",
                                    color: "#5a5886",
                                    padding: "12px 25px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    textDecoration: "underline"
                                }}
                            >
                                {t('download')}
                            </button> */}
                            
                            <a className='translation-btn' href={`https://test.cdlhelp.com/${router.locale == 'en' ? '' : router.locale}`} style={{ 
                                background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                                padding: "12px 25px",
                                border: "none",
                                boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)",
                                textDecoration: "none",
                                color: "white"
                            }}>{t('tryTestsOnline')}</a>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Quiz;