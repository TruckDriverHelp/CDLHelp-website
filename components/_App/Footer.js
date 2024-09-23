// Footer Component Style File Path: public/css/pages-and-components-css/footer.scss

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const localeContent = {
  "ru": {
    downloadApp: "СКАЧАТЬ ПРИЛОЖЕНИЕ",
    downloadAppText: "Скачать CDL Help - тесты CDL с переводом",
    downloadAndTry: "Бесплатно скачать приложение CDL Help и опробовать вопросы.",
    androidApp: "Приложение Android",
    downloadButton: "Скачать",
    iosApp: "Приложение iOS",
    mobileApp: "Приложение для мобильных устройств iOS и Android, с тестами CDL с возможностью перевода.",
    aboutProject: "О Проекте",
    tryFree: "Попробовать Бесплатно",
    support: "Поддержка",
    privacy: "Конфиденциальность",
    publicAgreement: "Публичное Соглашение",
    feedback: "Обратная связь",
    resources: "Ресурсы",
    jobs: "Найти Работу",
    cdlRussianSchool: "Школа CDL на русском",
    allRightsReserved: "Все права защищены",
  },

  "en": {
    downloadApp: "DOWNLOAD APP",
    downloadAppText: "Download CDL Help - CDL tests with translation",
    downloadAndTry: "Download the CDL Help app for free and try the questions",
    androidApp: "Android",
    downloadButton: "Download",
    iosApp: "iOS",
    mobileApp: "Mobile app for iOS and Android with CDL tests and translation capability",
    aboutProject: "About",
    tryFree: "Try",
    support: "Support",
    privacy: "Privacy Policy",
    publicAgreement: "Terms & Conditions",
    feedback: "Feedback",
    resources: "Resources",
    jobs: "Find a job",
    cdlRussianSchool: "CDL school list",
    allRightsReserved: "All rights reserved",
  },

  "uk": {
    downloadApp: "Завантажити додаток",
    downloadAppText: "Завантажити CDL Help — тести CDL з перекладом",
    downloadAndTry: "Безкоштовно завантажити додаток CDL Help і протестувати питання.",
    androidApp: "Додаток Android",
    downloadButton: "Завантажити",
    iosApp: "Додаток iOS",
    mobileApp: "Додаток для мобільних пристроїв iOS та Android з тестами CDL з можливістю перекладу.",
    aboutProject: "Про проект",
    tryFree: "Спробувати безкоштовно",
    support: "Підтримка",
    privacy: "Конфіденційність",
    publicAgreement: "Публічний договір",
    feedback: "Зворотній зв'язок",
    resources: "Ресурси",
    jobs: "Знайти роботу",
    cdlRussianSchool: "Школа CDL українською мовою",
    allRightsReserved: "Все права защищены",
  }
}

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
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { downloadApp, downloadAndTry, downloadAppText, downloadButton, iosApp, androidApp, jobs, mobileApp, aboutProject, tryFree, support, privacy, publicAgreement, feedback, resources, cdlRussianSchool, allRightsReserved } = localeContent[locale];
  const currentYear = new Date().getFullYear();
  const { howToUseAppArticle, howToBecomeTruckDriverArticle, faq, howToGetPermitArticle } = articleList[locale];

  return (
    <>
      <div className="footer-area footer-style-two bg-black">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <Link href="/">
                  <a className="logo">
                    <Image
                      src="/images/logo.png"
                      alt="logo"
                      width="101"
                      height="44"
                    />
                  </a>
                </Link>

                <p>
                  {mobileApp}
                </p>

                <ul className="social-links">
                  <li>
                    <a href="https://www.youtube.com/@truckdriverdothelp" target="_blank">
                      <i className="ri-youtube-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.t.me/TruckDriverHelp" target="_blank">
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
                    <Link href="/contact">
                      <a target="_blank"><i className="ri-mail-fill"></i></a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-2">
                <h3>CDL Help</h3>
                <ul className="links-list">
                  <li>
                    <Link href={howToUseAppArticle.slug} locale={locale}>
                      <a>{howToUseAppArticle.title}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#about">
                      <a>{aboutProject}</a>
                    </Link>
                  </li>
                  {/* <li>
                                        <Link href="/features">
                                            <a>Отзывы</a>
                                        </Link>
                                    </li> */}
                  <li>
                    <a href={`https://test.cdlhelp.com/${locale}`}>
                      {tryFree}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="single-footer-widget">
                <h3>{support}</h3>
                <ul className="links-list">
                  <li>
                    <Link href="/privacy-policy" locale={false}>
                      <a>{privacy}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" locale={false}>
                      <a>{publicAgreement}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="/contact">{feedback}</a>
                  </li>
                  <li>
                    <Link href={faq.slug} locale={locale}>
                      <a>{faq.title}</a>
                    </Link>

                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="single-footer-widget">
                <h3>{resources}</h3>
                <ul className="links-list">
                  <li>
                    <Link href={howToBecomeTruckDriverArticle.slug} locale={locale}>
                      <a>{howToBecomeTruckDriverArticle.title}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={howToGetPermitArticle.slug} locale={locale}>
                      <a>{howToGetPermitArticle.title}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cdl-shkola">
                      <a>{cdlRussianSchool}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://www.truckdriver.help/">{jobs}</a>
                  </li>
                </ul>
              </div>
            </div>

            {/*<div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Рассылка</h3>
                                <p>Подпишитесь на рассылку поектов TruckDriver.help и CDL Help.</p>

                                <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                                    <input 
                                        type="text" 
                                        className="input-newsletter" 
                                        placeholder="Ваш Email" 
                                        name="EMAIL" 
                                        required 
                                    />
                                    <button type="submit">
                                        <i className="ri-send-plane-2-line"></i>
                                    </button>
                                </form>
                            </div>
                        </div>*/}
          </div>

          <div className="copyright-area">
            <p>
              {currentYear} &copy; <strong>CDL Help</strong>. {allRightsReserved}{" "}
              <a href="https://www.truckdriver.help/" target="_blank">
                TruckDriver.help llc
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
