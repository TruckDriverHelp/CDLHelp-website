import { useContext, useState } from 'react'
import QuizContext from '../../store/quiz-context'
import styles from './top.module.css'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const languages = {
    "ar": "عربي",
    "en": "English",
    "ru": "Русский",
    "uk": "Українська",
    "zh": "中文",
    "ko": "한국어",
    "tr": "Türkçe",
    "pt": "Português"
}

const Head = ({ translation }) => {
    const { t } = useTranslation('index');
    const quizCtx = useContext(QuizContext)
    const router = useRouter()
    const [showLanguagePopup, setShowLanguagePopup] = useState(false)
    const {
        translate,
        setTranslate,
    } = quizCtx

    const handleLanguageChange = (locale) => {
        router.push(router.pathname, router.pathname, { locale })
        setShowLanguagePopup(false)
        setTranslate(true)
    }

    return (
        <div style={{ display: "flex" }}>
            {router.locale === 'en' ? (
                <div className={styles.language} >
                    <button
                        onClick={() => setShowLanguagePopup(true)}
                        style={{ 
                            background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                            padding: "12px 25px",
                            border: "none",
                            boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)",
                            textDecoration: "none",
                            color: "white",
                            borderRadius: "10px"
                        }}
                    >
                        Enable Translation
                    </button>
                    {showLanguagePopup && (
                        <div className={styles.languagePopup}>
                            <div className={styles.popupContent}>
                                <h3>Choose Language</h3>
                                <div className={styles.languageGrid}>
                                    {Object.entries(languages).map(([code, name]) => (
                                        <button
                                            key={code}
                                            onClick={() => handleLanguageChange(code)}
                                            className={styles.languageOption}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => setShowLanguagePopup(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.language} style={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <button
                        onClick={() => {
                            setTranslate(!translate)
                        }}
                        className={`translation-btn ${styles.pulsate}`}
                    >
                        {t('translationLabel')}
                    </button>
                    <div>
                        <span>{t('languageLabel')} </span>
                        <span style={{ fontWeight: "bold" }}>
                            {translate ? languages[router.locale] : "English"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Head;