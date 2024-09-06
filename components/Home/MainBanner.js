import Link from "next/link";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Image from "next/image";

import { useTranslation } from "lib/useTranslation";

const MainBanner = ({translations}) => {
  const {t} = useTranslation(translations);

  return (
    <>
      <div className="new-app-main-banner-wrap-area">
        <div className="container-fluid">
          <div className="row align-items-center mb-5">
            <div className="col-xl-7 col-lg-8 col-md-12">
              <div className="new-app-main-banner-wrap-content" style={{ textAlign: 'center' }}>
                <h1>{t("CDL Tests for Truck Drivers in the USA")}</h1>
                <p>
                {t("The CDL Help app is designed to assist you in preparing for and passing your CDL exams. Our database includes over 1,000 questions, that will help you to become a truck driver")} 
                </p>

                <div className="app-btn-box">
                  <a href="#download" className="applestore-btn">
                    <i><img src="/images/icons/download-bar-down.svg" alt="Скачать" style={{color: "white", width: 30, height: 30 }}></img></i>
                    iOS / Android
                    <span>{t("Download")}</span>
                  </a>
                  <a href="https://test.cdlhelp.com" className="playstore-btn">
                    <i className="ri-play-fill main-banner-btn-icon"></i>
                    {t("Try")}
                    <span>{t("For free")}</span>
                  </a>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '20px 5px', justifyContent: 'center', textAlign: 'center' }}>
                  <div className="col-sm-3 offset-2 offset-md-0" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <img src="/images/stars.png" alt="Rating score" width={100} height={20} />
                  </div>

                  <div style={{display:'flex', justifyContent:'flex-start', flexWrap: 'wrap', gap: 5}}>
                    <div style={{display: 'flex', gap: 5}}>
                      {t("Over 3000 reviews on")}
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <img 
                          src="/images/apple-store.png"
                          alt="image"
                          width={20}
                          height={20}
                        />
                        <span>App Store {t("and")}</span></div>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <img 
                          src="/images/play-store.png"
                          alt="image"
                          width={18}
                          height={18}
                        />
                        <span>Google Play</span></div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <a href="https://t.me/TruckDriverGroup/13900/13904" target="_blank">
                    <i
                      className="ri-telegram-fill"
                      style={{ color: "#3c9ff0", fontSize: 26 }}
                    ></i>
                  </a>
                  <a style={{ fontWeight: 600 }} href="https://t.me/TruckDriverGroup/13900/13904">
                    {t("Telegram community for beginners truck drivers")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-4">
              <ScrollAnimation
                animateIn="fadeInLeft"
                duration={2}
                animateOnce={true}
                initiallyVisible={false}
              >
                <div className="new-app-main-banner-wrap-image" style={{paddingRight:120}}>
                  <img 
                    src="/images/banner/cdl-help-app.png"
                    alt="image"
                    width={260}
                    height={600}
                  />

                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default MainBanner;
