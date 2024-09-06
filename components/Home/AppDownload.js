import React from 'react';
import Image from 'next/image';
import ScrollAnimation from "react-animate-on-scroll";
import { useTranslation } from 'lib/useTranslation';


const AppDownload = ({translations}) => {
    const {t} = useTranslation(translations);
    
    const trackDownload = (platform) => {
        if (window.fbq) {
            window.fbq('trackCustom', `AppDownload_${platform}`, { platform: platform });
        }
    }
    return (
        <>
            <div id="download" className="new-app-download-wrap-area ptb-100">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12" style={{ textAlign: 'center' }}>
                            <div className="new-app-download-content">
                                <span className="sub-title">{t("DOWNLOAD THE APP")}</span>
                                <h2>{t("Download CDL Help - CDL tests with translation")}</h2>
                                <p>{t("for free download the CDL Help app and try out the questions")}</p>

                                <div className="btn-box color-wrap">
                                    <a href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp" onClick={() => trackDownload('Android')} className="playstore-btn" target="_blank">
                                        <div>
                                            <img 
                                                src="/images/play-store.png"
                                                alt="image"
                                                width={27}
                                                height={30}
                                            />
                                        </div>
                                        {t("For Android")}
                                        <span>{t("Download")}</span>
                                    </a>
                                    <a href="https://apps.apple.com/us/app/cdl-help/id6444388755?platform=iphone" onClick={() => trackDownload('iOS')} className="applestore-btn" target="_blank">
                                        <div>
                                            <img 
                                                src="/images/apple-store.png"
                                                alt="image"
                                                width={34}
                                                height={35}
                                            />
                                        </div>
                                        {t("For iOS")}
                                        <span>{t("Download")}</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12" >
                            <ScrollAnimation
                            animateIn="fadeInDown"
                            duration={2}
                            animateOnce={true}
                            initiallyVisible={false}
                        >
                            <div className="new-app-download-image text-center" data-aos="fade-up" >
                                <img 
                                    src="/images/banner/cdl-help-app-0.png"
                                    alt="app-Image"
                                    width={336}
                                    height={680}
                                />

                            </div>
                        </ScrollAnimation>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppDownload;