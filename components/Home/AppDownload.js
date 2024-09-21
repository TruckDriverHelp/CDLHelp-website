import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/router";

const localeContent = {
    "ru": {
        downloadApp: "СКАЧАТЬ ПРИЛОЖЕНИЕ",
        downloadAppText: "Скачать CDL Help - тесты CDL с переводом",
        downloadAndTry: "Бесплатно скачать приложение CDL Help и опробовать вопросы.",
        androidApp: "Приложение Android",
        downloadButton: "Скачать",
        iosApp: "Приложение iOS",
    },

    "en": {
        downloadApp: "DOWNLOAD THE APP",
        downloadAppText: "Download CDL Help - CDL tests with translation",
        downloadAndTry: "Download CDL Help app for free and try the questions.",
        androidApp: "Android",
        downloadButton: "Download",
        iosApp: "iOS"
    },
  
    "uk": {
        downloadApp: "Завантажити додаток",
        downloadAppText: "Завантажити CDL Help — тести CDL з перекладом",
        downloadAndTry: "Безкоштовно завантажити додаток CDL Help і протестувати питання.",
        androidApp: "Додаток Android",
        downloadButton: "Завантажити",
        iosApp: "Додаток iOS",
    }
};


const AppDownload = () => {
    const { locale, locales, defaultLocale, asPath } = useRouter();
    const { downloadApp, downloadAndTry, downloadAppText, downloadButton, androidApp, iosApp } = localeContent[locale];
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
                                <span className="sub-title">{downloadApp}</span>
                                <h2>{downloadAppText}</h2>
                                <p>{downloadAndTry}</p>

                                <div className="btn-box color-wrap">
                                    <a href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp" onClick={() => trackDownload('Android')} className="playstore-btn" target="_blank">
                                        <div>
                                            <Image
                                                src="/images/play-store.png"
                                                alt="image"
                                                width={27}
                                                height={30}
                                            />
                                        </div>
                                        {androidApp}
                                        <span>{downloadButton}</span>
                                    </a>
                                    <a href="https://apps.apple.com/us/app/cdl-help/id6444388755?platform=iphone" onClick={() => trackDownload('iOS')} className="applestore-btn" target="_blank">
                                        <div>
                                            <Image
                                                src="/images/apple-store.png"
                                                alt="image"
                                                width={34}
                                                height={35}
                                            />
                                        </div>
                                        {iosApp}
                                        <span>{downloadButton}</span>
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