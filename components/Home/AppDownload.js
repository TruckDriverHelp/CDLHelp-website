import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';
import analytics from '../../lib/analytics';

const AppDownload = () => {
    const {t} = useTranslation("index");
    const { locale } = useRouter();
    
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

                                <div className="btn-box">
                                    <a 
                                        href={`/${locale == 'en' ? '' : locale + '/'}download`}
                                        onClick={() => {
                                            analytics.trackFeatureEngagement('app_download_section', 'click', 'home');
                                            analytics.trackDownloadIntent('website', 'home_download_section');
                                        }}
                                        className="translation-btn"
                                        style={{ 
                                            background: "linear-gradient(44.44deg, #5a5886 7.79%, #9290bb 94.18%)",
                                            padding: "12px 25px",
                                            border: "none",
                                            borderRadius: "10px",
                                            boxShadow: "0px 12px 35px rgba(90, 88, 134, 0.25)",
                                            textDecoration: "none",
                                            color: "white",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: "16px"
                                        }}
                                    >
                                        <i className="ri-smartphone-line" style={{ fontSize: '18px' }}></i>
                                        {t('downloadAppButton')}
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