import { useContext } from 'react'
import QuizContext from '../../store/quiz-context'
import { useTranslation } from '../../lib/useTranslation'
import styles from './top.module.css'
const Head = ({ translation }) => {
    const { t } = useTranslation(translation)
    const quizCtx = useContext(QuizContext)
    const {
        translate,
        setTranslate, } = quizCtx

    // Add debugging
    console.log('QuizContext:', quizCtx)
    console.log('Translate value:', translate)

    return (
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>

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
                    Перевод
                </button>
                <div><span>Язык: </span><span style={{ fontWeight: "bold" }}>{translate ? "Русский" : "Английский"}</span></div>

            </div>
        </div>

    )
}

export default Head;