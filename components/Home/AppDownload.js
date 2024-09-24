import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const AppDownload = () => {
    const {t} = useTranslation("index");
    const { locale } = useRouter();
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
                                <span className="sub-title">{t("downloadApp")}</span>
                                <h2>{t("downloadAppText")}</h2>
                                <p>{t("downloadAndTry")}</p>

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
                                        {t("androidApp")}
                                        <span>{t("downloadButton")}</span>
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
                                        {t("iosApp")}
                                        <span>{t("downloadButton")}</span>
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