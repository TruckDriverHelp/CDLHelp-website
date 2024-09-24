import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const ModalVideo = dynamic(() => import('react-modal-video'), {
    ssr: false
});

const AppIntroVideo = () => {
    // Popup Video
    const {t} = useTranslation("index");
    const { locale } = useRouter();
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
                            <div className="app-intro-video-content">
                                <span className="sub-title">{t("stepByStep")}</span>
                                <h2>{t("howToGet")}</h2>
                                <p>{t("videoDescription")}</p>
                                <a className="default-btn" href="https://www.youtube.com/watch?v=Ll4yVz7yBlQp">{t("startWatching")}</a>
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