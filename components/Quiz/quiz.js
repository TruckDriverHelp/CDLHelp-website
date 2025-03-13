import { useEffect, useState, useContext } from 'react'
import Answers from './answers'
import styles from './quiz.module.css'
import QuizContext from '../../store/quiz-context'
import Stopwatch from './stopwatch'
import Image from 'next/image'
import Router from 'next/router'
import Top from './top'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const Quiz = ({ question, title, id, name, translation }) => {
    const { t } = useTranslation('index');
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
                "en": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "What principle should be understood about speed management and its impact on stopping distances?"
                },
                "ko": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "속도 제어에 관한 다음 설명 중 옳은 것은 무엇입니까?"
                },
                "uk": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "Яке з наступних тверджень про управління швидкістю правильне?"
                },
                "pt": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "Qual das seguintes afirmações sobre controle de velocidade é verdadeira?"
                },
                "ru": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "Какое из следующих утверждений о контроле скорости является верным?"
                },
                "ar": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "ما هو المبدأ الذي يجب فهمه بخصوص إدارة السرعة وتأثيرها على مسافات التوقف؟"
                },
                "tr": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "Hız yönetimi ve durma mesafeleri üzerindeki etkisi hakkında hangi ilke anlaşılmalıdır?"
                },
                "zh": {
                    "eng": "What principle should be understood about speed management and its impact on stopping distances?",
                    "lang": "应该了解关于速度管理及其对制动距离影响的什么原则？"
                }
            },
            "answers": [
                {
                    "en": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "Speed does not affect stopping distance."
                    },
                    "ko": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "속도는 제동 거리에 영향을 미치지 않습니다."
                    },
                    "uk": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "Швидкість не впливає на зупинний шлях."
                    },
                    "pt": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "A velocidade não tem efeito sobre a distância de parada."
                    },
                    "ru": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "Скорость не влияет на остановочный путь."
                    },
                    "ar": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "السرعة لا تؤثر على مسافة التوقف."
                    },
                    "tr": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "Hız, durma mesafesini etkilemez."
                    },
                    "zh": {
                        "eng": "Speed does not affect stopping distance.",
                        "lang": "速度不影响停车距离。"
                    }
                },
                {
                    "en": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "If you double your speed, stopping distance will be increased by 4 times."
                    },
                    "ko": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "속도를 두 배로 늘리면 제동 거리는 4배 증가합니다."
                    },
                    "uk": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "Якщо ви збільшите швидкість вдвічі, зупинний шлях збільшиться в 4 рази."
                    },
                    "pt": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "Se você dobrar a velocidade, a distância de frenagem aumentará em 4 vezes."
                    },
                    "ru": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "Если вы увеличите скорость вдвое, тормозной путь увеличится в 4 раза."
                    },
                    "ar": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "إذا ضاعفت سرعتك، ستزيد مسافة التوقف بمقدار 4 مرات."
                    },
                    "tr": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "Eğer hızınızı iki katına çıkarırsanız, durma mesafesi 4 kat artar."
                    },
                    "zh": {
                        "eng": "If you double your speed, stopping distance will be increased by 4 times.",
                        "lang": "如果你将速度加倍，停车距离将增加4倍。"
                    }
                },
                {
                    "en": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "Stopping distance decreases as your speed increases."
                    },
                    "ko": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "속도가 빨라질수록 제동 거리가 감소합니다."
                    },
                    "uk": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "Зупинний шлях зменшується зі збільшенням швидкості."
                    },
                    "pt": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "A distância de parada diminui à medida que a velocidade aumenta."
                    },
                    "ru": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "Остановочный путь уменьшается по мере увеличения скорости."
                    },
                    "ar": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "مسافة التوقف تقل كلما زادت سرعتك."
                    },
                    "tr": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "Hızınız arttıkça durma mesafesi azalır."
                    },
                    "zh": {
                        "eng": "Stopping distance decreases as your speed increases.",
                        "lang": "随着速度增加，停车距离减少。"
                    }
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
                                <span>{t('questionLabel')} <h4 style={{ textAlign: 'center' }}>
                                    {translate ? data.question[router.locale].lang : data.question[router.locale].eng}
                                </h4></span>
                            </div>

                            <Top translation={translation} />
                            
                            <Answers data={data} handleSelect={handleSelect} handleCheck={handleCheck} />
                        </div>
                        <div className={styles.nav} style={{ width: "100%", margin: "0 auto", display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button 
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
                            </button>
                            
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
        </div >

    )
}

export default Quiz;