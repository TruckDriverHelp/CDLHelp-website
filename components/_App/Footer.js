// Footer Component Style File Path: public/css/pages-and-components-css/footer.scss

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";


const articleList = {
  "en": {
    howToUseAppArticle: {
      title: "How to use the app",
      slug: "/how-to-use-cdl-help"
    },
    howToBecomeTruckDriverArticle: {
      title: "How to become a Truck Driver in USA",
      slug: "/how-to-become-a-truck-driver-in-usa"
    },
    howToGetPermitArticle: {
      title: "How to get a CDL Permit",
      slug: "/how-to-get-clp-permit"
    },
    faq: {
      title: "Frequently Asked Questions",
      slug: "/frequently-asked-questions-cdl-help"
    }
  },
  "ru": {
    howToUseAppArticle: {
      title: "Как использовать приложение CDL Help",
      slug: "/kak-ispolzovat-cdl-help"
    },
    howToBecomeTruckDriverArticle: {
      title: "Как стать дальнобойщиком в США",
      slug: "/kak-stat-dalnoboishikom"
    },
    howToGetPermitArticle: {
      title: "Как получить CLP пермит",
      slug: "/kak-poluchit-clp-permit"
    },
    faq: {
      title: "Часто задаваемые вопросы",
      slug: "/chasto-zadavaemye-voprosy"
    }
  },
  "uk": {
    howToUseAppArticle: {
      title: "Як використовувати додаток CDL Help",
      slug: "/yak-vykorystovuvaty-dodatok-cdl-help"
    },
    howToBecomeTruckDriverArticle: {
      title: "Як стати водієм вантажівки в США",
      slug: "/yak-staty-vodiyem-vantazhivky-v-amerytsi"
    },
    howToGetPermitArticle: {
      title: "Як отримати дозвіл CDL",
      slug: "/yak-otrymaty-dozvil-cdl"
    },
    faq: {
      title: "CDL Help – Часті запитання",
      slug: "/chasti-zapytannya"
    }
  }
}

const Footer = () => {
  const {t} = useTranslation("footer");
  const { locale } = useRouter();
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
                  {t("mobileApp")}
                </p>

                <ul className="social-links">
                  {(locale === "ru" || locale === "uk") && <li>
                    <a href="https://www.youtube.com/@truckdriverdothelp" target="_blank">
                      <i className="ri-youtube-fill"></i>
                    </a>
                  </li>}
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
                    <Link href="/#about">
                      <a>{t("aboutProject")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href={`https://test.cdlhelp.com/${locale}`}>
                      {t("tryFree")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="single-footer-widget">
                <h3>{t("support")}</h3>
                <ul className="links-list">
                  <li>
                    <Link href="/privacy-policy" locale={false}>
                      <a>{t("privacy")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" locale={false}>
                      <a>{t("publicAgreement")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="/contact">{t("feedback")}</a>
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
                <h3>{t("resources")}</h3>
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
                      <a>{t("cdlRussianSchool")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://www.truckdriver.help/">{t("jobs")}</a>
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
              {currentYear} &copy; <strong>CDL Help</strong>. {t("allRightsReserved")}{" "}
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
