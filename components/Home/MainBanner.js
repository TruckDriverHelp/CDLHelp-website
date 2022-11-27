import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll'

const MainBanner = () => {
    return (
		<>
			<div className="new-app-main-banner-wrap-area">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="new-app-main-banner-wrap-content">
                                <h1>CDL тесты с переводом на русский язык</h1>
                                <p>Приложение CDL Help поможет вам подготовиться к тестам CDL для того чтобы получить водительские права и стать дальнобойщиком в США.</p>
                                {/* <ul className="user-info">
                                    <li>
                                        <img 
                                            src="/images/user/user1.jpg" 
                                            className="rounded-circle" 
                                            alt="image" 
                                        />
                                    </li>
                                    <li>
                                        <img 
                                            src="/images/user/user2.jpg" 
                                            className="rounded-circle" 
                                            alt="image" 
                                        />
                                    </li>
                                    <li>
                                        <img 
                                            src="/images/user/user3.jpg" 
                                            className="rounded-circle" 
                                            alt="image" 
                                        />
                                    </li>
                                    <li>
                                        <img 
                                            src="/images/user/user4.jpg" 
                                            className="rounded-circle" 
                                            alt="image" 
                                        />
                                    </li> 
                                    <li className="title">2K+ пользователей ежемесячно</li>
                                </ul> */}

                                <div className="app-btn-box">
                                    <a href="https://apps.apple.com/us/app/cdl-help/id6444388755?platform=iphone" className="applestore-btn" target="_blank">
                                        <img 
                                            src="/images/apple-store.png" 
                                            alt="image" 
                                        />
                                        Приложение iOS
                                        <span>Apple Store</span>
                                    </a>

                                    <a href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp" className="playstore-btn" target="_blank">
                                        <img 
                                            src="/images/play-store.png" 
                                            alt="image" 
                                        />
                                        Приложение Android
                                        <span>Google Play</span>
                                    </a>
                                </div>
                            </div>
                        </div> 
                        <div className="col-lg-6 col-md-12">
                            <ScrollAnimation animateIn='fadeInLeft' duration={2} animateOnce={true} initiallyVisible={true}>
                                <div className="new-app-main-banner-wrap-image">
                                    <img 
                                        src="/images/home-7-8-9/banner/banner-2.png" 
                                        alt="image" 
                                    />

                                    {/* <div className="wrap-image-shape-1">
                                        <img 
                                            src="/images/home-7-8-9/banner/shape-3.png" 
                                            alt="image" 
                                        />
                                    </div>
                                    <div className="wrap-image-shape-2">
                                        <img 
                                            src="/images/home-7-8-9/banner/shape-4.png" 
                                            alt="image" 
                                        />
                                    </div> */}
                                    <div className="banner-circle">
                                        <img 
                                            src="/images/home-7-8-9/banner/banner-circle.png" 
                                            alt="image" 
                                        />
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </div>

                <div className="new-app-main-banner-wrap-shape">
                    <img 
                        src="/images/home-7-8-9/banner/shape-5.png" 
                        alt="image" 
                    />
                </div>
            </div>
		</>
    );
}

export default MainBanner;