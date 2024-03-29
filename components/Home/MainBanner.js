import Link from "next/link";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Image from "next/image";

const MainBanner = () => {
  return (
    <>
      <div className="new-app-main-banner-wrap-area">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="new-app-main-banner-wrap-content">
                <h1>CDL на русском языке</h1>
                <p>
                  Приложение CDL Help поможет Вам не только подготовиться к
                  тестам CDL для того чтобы получить водительские права и стать
                  дальнобойщиком в США, но с изучением английского языка.
                </p>

                <div className="app-btn-box">
                  <a href="#download" className="applestore-btn">
                    <i className="ri-download-fill main-banner-btn-icon"></i>
                    iOS / Android
                    <span>Скачать</span>
                  </a>
                  <Link href="/cdl-shkola">
                    <a className="playstore-btn">
                      <i className="ri-truck-fill main-banner-btn-icon"></i>
                      CDL школы
                      <span>на русском</span>
                    </a>
                  </Link>
                </div>
                <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 5}}>
                  <a href="https://www.t.me/TruckDriverHelp" target="_blank">
                    <i
                      className="ri-telegram-fill"
                      style={{ color: "#3c9ff0", fontSize: 26 }}
                    ></i>
                  </a>
                  <a style={{ fontWeight: 600 }} href="https://www.t.me/truckdrivergroup">
                    Лучший Телеграм чат для начинающих дальнобойщиков
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <ScrollAnimation
                animateIn="fadeInLeft"
                duration={2}
                animateOnce={true}
                initiallyVisible={true}
              >
                <div className="new-app-main-banner-wrap-image">
                  <Image
                    src="/images/home-7-8-9/banner/banner-2.png"
                    alt="image"
                    width={815}
                    height={708}
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
                    <Image
                      src="/images/home-7-8-9/banner/banner-circle.png"
                      alt="image"
                      width={815}
                      height={815}
                    />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>

        <div className="new-app-main-banner-wrap-shape">
          <Image
            src="/images/home-7-8-9/banner/shape-5.png"
            alt="image"
            width={584}
            height={555}
          />
        </div>
      </div>
    </>
  );
};

export default MainBanner;
