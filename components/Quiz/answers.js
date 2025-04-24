import { useContext } from 'react'
import QuizContext from '../../store/quiz-context'
import styles from './answers.module.css'
import { useRouter } from 'next/router'

const Answers = ({ data, handleCheck, handleSelect }) => {
    const quizCtx = useContext(QuizContext)
    const { selected, translate } = quizCtx
    const router = useRouter()
    const locale = router.locale
    const abc = ["A", "B", "C", "D"]

    console.log(data)

    return (
        <div className={styles.answers} style={{marginTop: "10px", marginBottom: "30px"}}>
            {data && data.answers.map((answer, i) => {
                return (
                    <div style={{ display: "flex", gap: 15, backgroundColor: selected ? handleSelect(i + 1) === "red" ? "#AA4747" : handleSelect(i + 1) === "grey" ? "#F7F7FC" : "#498E3B" : null }} key={i} onClick={() => !selected && handleCheck(i + 1)} className={`${selected && handleSelect(i + 1)}`}>

                        <span className="noselect"><strong>{abc[i]}</strong></span>
                        <span className="noselect">
                            {translate ? answer[locale] : answer.en}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default Answers;