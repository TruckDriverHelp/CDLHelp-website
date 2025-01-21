import { useEffect, useState, useContext } from 'react'
import Answers from './answers'
import styles from './quiz.module.css'
import QuizContext from '../../store/quiz-context'
import Stopwatch from './stopwatch'
import Image from 'next/image'
import Router from 'next/router'
import Top from './top'
import { useTranslation } from '../../lib/useTranslation'
import { useRouter } from 'next/router'

const Quiz = ({ question, title, id, name, translation }) => {
    const { t } = useTranslation(translation);
    const router = useRouter();

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


    const data = {
        "answer": 2,
        "question": {
            "eng": "What should you do when merging?",
            "lang": "При перестроении в другую полосу движения при сужении дороги:"
        },
        "answers": [
            {
                "eng": "Merge at a much lower speed than the flow of traffic.",
                "lang": "Перестраиваться на значительно более низкой скорости, чем та, с которой движутся транспортные средства."
            },
            {
                "eng": "Use your mirrors to make sure the gap in traffic is large enough for you to enter safely.",
                "lang": "Следует использовать зеркала, чтобы убедиться, что дистанция до других участников движения достаточно велика, чтобы вы могли безопасно перестроиться."
            },
            {
                "eng": "Merge without signaling.",
                "lang": "Перестраиваться следует не давая никаких сигналов о своих намерениях."
            }
        ]
    }
    const correct = data.answer

    const handleSelect = (i) => {
        if (selected === i && selected === correct) return false;
        else if (selected === i && selected !== correct) return 'red';
        else if (selected !== i && i !== correct) return 'grey';
        else if (i === correct) return false;
    }

    const handleCheck = (i) => {
        setSelected(i);
        if (i === correct) {
            // setScore(score + 1)
        } else {
            setWrong([...wrong])
        }
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
                                <span>Вопрос: <h4 style={{ textAlign: 'center' }}>{translate ? data.question.lang : data.question.eng}</h4></span>
                            </div>

                            <Top translation={translation} />
                            
                            <Answers data={data} handleSelect={handleSelect} handleCheck={handleCheck} />
                        </div>
                        <div className={styles.nav} style={{ width: "100%", margin: "0 auto", display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button 
                                disabled={!selected} 
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
                                Скачать приложение
                            </button>
                            <button 
                                disabled={!selected} 
                                className="translation-btn"
                                style={{ 
                                    background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                                    padding: "12px 25px",
                                    border: "none",
                                    boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)"
                                }}
                            >
                                Продолжить на сайте
                            </button>
                        </div>
                    </>
                }
            </div>
        </div >

    )
}

export default Quiz;