import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
			<div id="truckdriverhelp" className="app-video-area ptb-100">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-box">
                                <img 
                                    src="/images/home-7-8-9/video/video-2.jpg" 
                                    alt="video-img" 
                                />
                                <div
                                    onClick={e => {e.preventDefault(); openModal()}}
                                    className="video-btn popup-youtube"
                                > 
                                    <i className="ri-play-line"></i>
                                </div>

                                <div className="intro-video-shape">
                                    <img 
                                        src="/images/home-7-8-9/video/shape-3.png" 
                                        alt="image" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="app-intro-video-content">
                                <span className="sub-title">О ПРОЕКТЕ</span>
                                <h2>Разработано при поддержке проекта TruckDriver.help</h2>
                                <p>TruckDriver.help это уникальный онлайн проект нацеленный помочь иммигрантам работающим в траковой индустрии. На данный момент основная платформа состоит из объявлений логистических компаний. Желающие найти работу в индустрии, смогут воспользоваться расширенными фильтрами предоставленные на сайте, для поиска работы по указанным критериям.</p>
                                    <a className="default-btn" href="https://www.truckdriver.help">Посетить</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* If you want to change the video need to update videoID */}
            <ModalVideo 
                channel='youtube' 
                isOpen={!isOpen} 
                videoId='2TeHq1JdmK4' 
                onClose={() => setIsOpen(!isOpen)} 
            />
		</>
    );
}

export default AppIntroVideo;