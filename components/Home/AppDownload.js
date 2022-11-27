import React from 'react';

const AppDownload = () => {
    return (
		<>
			<div id="download" className="new-app-download-wrap-area ptb-100">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="new-app-download-content">
                                <span className="sub-title">СКАЧАТЬ ПРИЛОЖЕНИЕ</span>
                                <h2>Скачать CDL Help - тесты CDL с переводом</h2>
                                <p>Бесплатно скачать приложение CDL Help и опробовать вопросы.</p>

                                <div className="btn-box color-wrap">
                                    <a href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp" className="playstore-btn" target="_blank">
                                        <img 
                                            src="/images/play-store.png" 
                                            alt="image" 
                                        />
                                        Приложение Android
                                        <span>Google Play</span>
                                    </a>
                                    <a href="https://apps.apple.com/us/app/cdl-help/id6444388755?platform=iphone" className="applestore-btn" target="_blank">
                                        <img 
                                            src="/images/apple-store.png" 
                                            alt="image" 
                                        />
                                        Приложение iOS
                                        <span>Apple Store</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="new-app-download-image text-end" data-aos="fade-up">
                                <img 
                                    src="/images/home-7-8-9/app-download/download-2.png" 
                                    alt="app-img" 
                                />

                                <div className="download-circle">
                                    <img 
                                        src="/images/home-7-8-9/app-download/download-circle.png" 
                                        alt="image" 
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