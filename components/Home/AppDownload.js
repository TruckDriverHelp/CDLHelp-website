import React from 'react';
import Image from 'next/image';
import ScrollAnimation from "react-animate-on-scroll";

const AppDownload = () => {
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
                                <span className="sub-title">СКАЧАТЬ ПРИЛОЖЕНИЕ</span>
                                <h2>Скачать CDL Help - тесты CDL с переводом</h2>
                                <p>Бесплатно скачать приложение CDL Help и опробовать вопросы.</p>

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
                                        Приложение Android
                                        <span>Скачать</span>
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
                                        Приложение iOS
                                        <span>Скачать</span>
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