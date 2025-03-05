import { createContext, useState } from 'react'

const QuizContext = createContext({
    selected: null,
    setSelected: function () { },
    score: null,
    setScore: function () { },
    translate: null,
    setTranslate: function () { },
    wrong: null,
    setWrong: function () { },
    time: null,
    setTime: function () { },
    running: null,
    setRunning: function () { },
    advert: null,
    setAdvert: function () { },
    disabled: null,
    setDisabled: function () { },
})

export function QuizContextProvider(props) {
    const [activeSelected, setActiveSelected] = useState()
    const [activeScore, setActiveScore] = useState(0)
    const [activeTranslate, setActiveTranslate] = useState(false)
    const [activeWrong, setActiveWrong] = useState([])
    const [activeTime, setActiveTime] = useState(0)
    const [activeRunning, setActiveRunning] = useState(true)
    const [activeAdvert, setActiveAdvert] = useState(true)
    const [activeDisabled, setActiveDisabled] = useState(true)


    function setSelectedHandler(data) {
        setActiveSelected(data)
    }

    function setScoreHandler(data) {
        setActiveScore(data)
    }


    function setTranslateHandler(data) {
        setActiveTranslate(data)
    }

    function setWrongHandler(data) {
        setActiveWrong(data)
    }

    function setTimeHandler(data) {
        setActiveTime(data)
    }

    function setRunningHandler(data) {
        setActiveRunning(data)
    }

    function setAdvertHandler(data) {
        setActiveAdvert(data)
    }

    function setDisabledHandler(data) {
        setActiveDisabled(data)
    }
    const context = {
        selected: activeSelected,
        setSelected: setSelectedHandler,
        score: activeScore,
        setScore: setScoreHandler,
        translate: activeTranslate,
        setTranslate: setTranslateHandler,
        wrong: activeWrong,
        setWrong: setWrongHandler,
        time: activeTime,
        setTime: setTimeHandler,
        running: activeRunning,
        setRunning: setRunningHandler,
        advert: activeAdvert,
        setAdvert: setAdvertHandler,
        disabled: activeDisabled,
        setDisabled: setDisabledHandler,
    };

    return (
        <QuizContext.Provider value={context}>
            {props.children}
        </QuizContext.Provider>
    )
}

export default QuizContext