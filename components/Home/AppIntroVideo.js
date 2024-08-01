import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ModalVideo = dynamic(() => import('react-modal-video'), {
    ssr: false
});

const AppIntroVideo = () => {
    // Popup Video
	const [isOpen, setIsOpen] = React.useState(true);
    const openModal = () => {
        setIsOpen(!isOpen);
    }
    return (
		<>
			<div id="truckdriverhelp" className="app-video-area pt-150 pb-100">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-box">
                                <img  
                                    src="/images/video/video-2.jpg" 
                                    alt="video-img"
                                    width={635}
                                    height={420}
                                />
                                <div
                                    onClick={e => {e.preventDefault(); openModal()}}
                                    className="video-btn popup-youtube"
                                > 
                                    <i className="ri-play-line"></i>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-content" style={{textAlign: 'justify'}}>
                                <h2>Как получить CDL</h2>
                                <p>В этом видео представлен подробный гид о том, как стать дальнобойщиком в США и получить CDL (коммерческие водительские права). Во-первых, объясняется процесс прохождения медицинского осмотра DOT, который необходим для всех кандидатов на получение CDL. Затем рассматривается процесс сдачи теоретических тестов в DMV для получения ученического разрешения (CLP), что позволяет практиковать вождение грузовика. Наконец, видео затрагивает обучение в школе CDL и процесс сдачи практического экзамена по вождению, включая ссылку на список школ с русскоязычными инструкторами для удобства подготовки.</p>
                                <div className='app-intro-buttons'>
                                    <a className="default-btn" href="https://www.youtube.com/watch?v=Ll4yVz7yBlQp">Начать просмотр</a>
                                    <Link href="/dalnoboishik">
                                    <a style={{ fontWeight: 600, textDecoration: 'underline' }} >Прочитать подробную инструкцию</a>
                                    </Link>
                                </div>
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