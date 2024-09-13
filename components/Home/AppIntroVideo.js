import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslation } from 'lib/useTranslation';

const ModalVideo = dynamic(() => import('react-modal-video'), {
    ssr: false
});

const AppIntroVideo = ({translations}) => {
    // Popup Video
    const {t} = useTranslation(translations);
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
                                <h2>{t("How to get a CDL")}</h2>
                                <p>{t("This article provides a detailed guide on how to become a trucker in the USA and get a CDL (Commercial Driver's License). First, we explain the process of passing the DOT medical examination, which is necessary for all CDL candidates. Then, the process of taking theoretical tests at the DMV for obtaining a student permit (CLP) is considered, which allows you to practice driving a truck. Finally, the guide touches on CDL school curriculum and the process of passing the practical driving test")}</p>
                                <div className='app-intro-buttons'>
                                    <a className="default-btn" href="https://www.youtube.com/watch?v=Ll4yVz7yBlQp">{t("Watch")}</a>
                                    <Link href="/dalnoboishik">
                                    <a style={{ fontWeight: 600, textDecoration: 'underline' }} >{t("Read the full article by clicking the link")}</a>
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