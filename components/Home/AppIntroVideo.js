import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from "next/router";

const ModalVideo = dynamic(() => import('react-modal-video'), {
    ssr: false
});

const localeContent = {
    "ru": {
        stepByStep: "ПОШАГОВАЯ ИНСТРУКЦИЯ",
        howToGet: "Как получить CDL",
        videoDescription: "В этом видео представлен подробный гид о том, как стать дальнобойщиком в США и получить CDL (коммерческие водительские права). Во-первых, объясняется процесс прохождения медицинского осмотра DOT, который необходим для всех кандидатов на получение CDL. Затем рассматривается процесс сдачи теоретических тестов в DMV для получения ученического разрешения (CLP), что позволяет практиковать вождение грузовика. Наконец, видео затрагивает обучение в школе CDL и процесс сдачи практического экзамена по вождению, включая ссылку на список школ с русскоязычными инструкторами для удобства подготовки.",
        startWatching: "Начать просмотр"
    },
    "en": {
        stepByStep: "Step-by-step instructions",
        howToGet: "How to get CDL",
        videoDescription: "This video offers a detailed guide on how to become a truck driver in the U.S. and obtain a CDL (Commercial Driver's License). First, it explains the process of passing the DOT medical exam, which is required for all CDL applicants. Then, it covers the procedure for taking the DMV theory tests to obtain a learner's permit (CLP), allowing you to practice driving a truck. Finally, the video discusses CDL school training and the process of taking the driving skills test, including a link to a list of schools with Russian-speaking instructors for easier preparation.",
        startWatching: "Start watching"
    },
    "uk": {
        stepByStep: "Покрокова інструкція",
        howToGet: "Як отримати CDL",
        videoDescription: "У цьому відео представлено докладний гід про те, як стати водієм вантажівки в США і отримати CDL (комерційні водійські права). Спочатку пояснюється процес проходження медичного огляду DOT, який є обов'язковим для всіх кандидатів на отримання CDL. Далі розглядається процедура складання теоретичних тестів у DMV для отримання учнівського дозволу (CLP), що дозволяє практикувати водіння вантажівки. Нарешті, відео охоплює навчання у школі CDL та процес складання практичного іспиту з водіння, включаючи посилання на список шкіл з інструкторами, які говорять російською, для зручнішої підготовки.",
        startWatching: "Почніть перегляд"
    }
};

const AppIntroVideo = () => {
    // Popup Video
    const { locale, locales, defaultLocale, asPath } = useRouter();
    const { stepByStep, howToGet, videoDescription, startWatching } = localeContent[locale];
    const [isOpen, setIsOpen] = React.useState(true);
    const openModal = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
            <div id="truckdriverhelp" className="app-video-area ptb-100">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-box">
                                <Image
                                    src="/images/video/video-2.jpg"
                                    alt="video-img"
                                    width={635}
                                    height={420}
                                />
                                <div
                                    onClick={e => { e.preventDefault(); openModal() }}
                                    className="video-btn popup-youtube"
                                >
                                    <i className="ri-play-line"></i>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-content">
                                <span className="sub-title">{stepByStep}</span>
                                <h2>{howToGet}</h2>
                                <p>{videoDescription}</p>
                                <a className="default-btn" href="https://www.youtube.com/watch?v=Ll4yVz7yBlQp">{startWatching}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* If you want to change the video need to update videoID */}
            <ModalVideo
                channel='youtube'
                isOpen={!isOpen}
                videoId='Ll4yVz7yBlQ'
                onClose={() => setIsOpen(!isOpen)}
            />
        </>
    );
}

export default AppIntroVideo;
