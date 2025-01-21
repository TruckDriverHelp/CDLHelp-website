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

    const howToGetArticleSlug = {
        en: "how-to-become-a-truck-driver-in-usa",
        ar: "kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida",
        tr: "nasil-kamyon-soforu-olunur",
        pt: "",
        ko: "migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob",
        zh: "ruhe-chengwei-meiguo-kache-siji"
    }

    return (
        <>
            <div id="truckdriverhelp" className="app-video-area pb-100">
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
                                {(locale === "ru" || locale === "uk") ? <div
                                    onClick={e => { e.preventDefault(); openModal() }}
                                    className="video-btn popup-youtube"
                                >
                                    <i className="ri-play-line"></i>
                                </div> : null}

                            </div>
                        </div>
                        

                        {<div className="col-lg-6 col-md-12">
                            {(locale === "ru" || locale === "uk") ? (
                                <div className="app-intro-video-content">
                                    <span className="sub-title">{t("stepByStep")}</span>
                                    <h2>{t("howToGet")}</h2>    
                                    <p>{t("videoDescription")}</p>
                                    <a className="default-btn" href="https://www.youtube.com/watch?v=Ll4yVz7yBlQp">
                                        {t("startWatching")}
                                    </a>
                                </div>
                            ) : (
                                <div className="app-intro-video-content">
                                    <span className="sub-title">{t("stepByStep")}</span>
                                    <h2>{t("howToGet")}</h2>

                                    <ul className="article-links">
                                        <li>
                                            <a href={`/${locale}/how-to-become-truck-driver-usa/`} className="article-link">
                                                How to become a truck driver in United States (Video)
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`/${locale}/how-to-prepare-cdl-test/`} className="article-link">
                                                How to prepare for theory CDL test at the DMV (Video)
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`/${locale}/how-to-use-cdl-help-app/`} className="article-link">
                                                How to use CDL Help app (Video)
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`/${locale}/what-is-eldt/`} className="article-link">
                                                What is ELDT?
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`/${locale}/cdl-driving-schools/`} className="article-link">
                                                What is taught at CDL driving schools and how to find one
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`/${locale}/cdl-faq/`} className="article-link">
                                                Frequently Asked Questions
                                            </a>
                                        </li>
                                    </ul>

                                </div>
                            )}
                        </div>}
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