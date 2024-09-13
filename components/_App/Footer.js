// Footer Component Style File Path: public/css/pages-and-components-css/footer.scss

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Email from "./Email";
import { useTranslation } from "lib/useTranslation";

const Footer = ({translations}) => {
  const {t} = useTranslation(translations);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="footer-area footer-style-two bg-black">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <Link href="/">
                  <a className="logo">
                    <img 
                      src="/images/logo.png"
                      alt="logo"
                      width="101"
                      height="44"
                    />
                  </a>
                </Link>

                <p>
                  {t("Mobile app for iOS and Android devices with CDL tests and translation options")}.
                </p>

                <ul className="social-links">
                  <li>
                    <a href="https://www.youtube.com/@truckdriverdothelp" target="_blank">
                      <i className="ri-youtube-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/TruckDriverGroup/13900/13904" target="_blank">
                      <i className="ri-telegram-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/TruckDriverHelp"
                      target="_blank"
                    >
                      <i className="ri-facebook-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://school.cdlhelp.app/contact/" target="_blank">
                      <i className="ri-mail-fill"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-2">
                <h3>CDL Help</h3>
                <ul className="links-list">
                  <li>
                    <Link href="/kak-ispolzovat-cdl-help">
                      <a>{t("How to use the app")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#about">
                      <a>{t("About the Project")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://test.cdlhelp.com">
                      {t("Try for Free")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="single-footer-widget">
                <h3>{t("Support")}</h3>
                <ul className="links-list">
                  <li>
                    <Link href="/privacy-policy">
                      <a>{t("Privacy")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions">
                      <a>{t("Public Agreement")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://school.cdlhelp.app/contact/">{t("Feedback")}</a>
                  </li>
                  <li>
                    <Link href="/faq">
                      <a>{t("Frequently Asked Questions")}</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="single-footer-widget">
                <h3>{t("Resources")}</h3>
                <ul className="links-list">
                  <li>
                    <Link href="/dalnoboishik">
                      <a>{t("How to become a truck driver")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/permit">
                      <a>{t("How to get a permit")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cdl-shkola">
                      <a>{t("CDL school in Russian")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://www.truckdriver.help/">{t("Find a job")}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <Email translation={translations}/>
              </div>
            </div>
          </div>

          <div className="copyright-area">
            <p>
              {currentYear} &copy; <strong>CDL Help</strong>. Все права защищены{" "}
              <a href="https://www.truckdriver.help/" target="_blank">
                TruckDriver.help LLC
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


export default Footer;
