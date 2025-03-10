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
                        <div className="col-lg-6 col-md-12">
                            <div className="new-app-download-content">
                                <span className="sub-title">{t("downloadApp")}</span>
                                <h2>{t("downloadAppText")}</h2>
                                <p>{t("downloadAndTry")}</p>

                                <div className="btn-box color-wrap">
                                    <a href={`https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp${locale == 'en' ? '' : `&hl=${locale}`}`} onClick={() => trackDownload('Android')} className="playstore-btn" target="_blank">
                                        <div>
                                            <Image
                                                src="/images/play-store.png"
                                                alt="image"
                                                width={27}
                                                height={30}
                                            />
                                        </div>
                                        {t("androidApp")}
                                        <span>{t("downloadButton")}</span>
                                    </a>
                                    <a href={`https://apps.apple.com/${locale == 'en' ? 'us' : locale}/app/cdl-help/id6444388755`}  onClick={() => trackDownload('iOS')} className="applestore-btn" target="_blank">
                                        <div>
                                            <Image
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

                        <div className="col-lg-6 col-md-12">
                            <div className="new-app-download-image text-end" data-aos="fade-up">
                                <Image
                                    src="/images/home-7-8-9/app-download/download-2.png"
                                    alt="app-img"
                                    width={634}
                                    height={634}
                                />

                                <div className="download-circle">
                                    <Image
                                        src="/images/home-7-8-9/app-download/download-circle.png"
                                        alt="image"
                                        width={634}
                                        height={634}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="app-download-shape-1">
                    <img 
                        src="/images/home-7-8-9/app-download/shape-1.png" 
                        alt="image" 
                    />
                </div>
                <div className="app-download-shape-2">
                    <img 
                        src="/images/home-7-8-9/app-download/shape-2.png" 
                        alt="image" 
                    />
                </div> */}
            </div>
        </>
    );
}

export default AppDownload;