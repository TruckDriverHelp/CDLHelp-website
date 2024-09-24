import Link from "next/link";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Image from "next/image";
import { useTranslation } from 'next-i18next';

const MainBanner = () => {
  const { t } = useTranslation('index');
  return (
    <>
      <div className="new-app-main-banner-wrap-area">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="new-app-main-banner-wrap-content">
                <h1>{t("title")}</h1>
                <p>{t("description")}</p>

                <div className="app-btn-box">
                  <a href="#download" className="applestore-btn">
                    <i><img src="/images/icons/download-bar-down.svg" alt="Скачать" style={{color: "white", width: 30, height: 30 }}></img></i>
                    iOS / Android
                    <span>{t("download")}</span>
                  </a>
                  <Link href="/cdl-shkola">
                    <a className="playstore-btn">
                      <i className="ri-truck-fill main-banner-btn-icon"></i>
                      {t("cdlSchools")}
                      <span>{t("language")}</span>
                    </a>
                  </Link>
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <a href="https://www.t.me/TruckDriverHelp" target="_blank">
                    <i
                      className="ri-telegram-fill"
                      style={{ color: "#3c9ff0", fontSize: 26 }}
                    ></i>
                  </a>
                  <a style={{ fontWeight: 600 }} href="https://t.me/TruckDriverGroup/13900/13904">
                    {t("bestTelegramChat")}
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

      </div>
    </>
  );
};

export default MainBanner;

