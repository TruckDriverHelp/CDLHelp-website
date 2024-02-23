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
    howToUseAppArticle: "Как пользоваться приложением",
    aboutProject: "О Проекте",
    tryFree: "Попробовать Бесплатно",
    support: "Поддержка",
    privacy: "Конфиденциальность",
    publicAgreement: "Публичное Соглашение",
    feedback: "Обратная Связь",
    faq: "Часто Задаваемые Вопросы",
    resources: "Ресурсы",
    howToBecomeTruckDriverArticle: "Как стать дальнобойщиком",
    howToGetPermitArticle: "Как получить пермит",
    cdlRussianSchool: "Школа CDL на русском",
    jobs: "Найти Работу",
    allRightsReserved: "Все права защищены",
  },

  "en": {
    downloadApp: "СКАЧАТЬ ПРИЛОЖЕНИЕ",
    downloadAppText: "Скачать CDL Help - тесты CDL с переводом",
    downloadAndTry: "Бесплатно скачать приложение CDL Help и опробовать вопросы.",
    androidApp: "Приложение Android",
    downloadButton: "Скачать",
    iosApp: "Приложение iOS",
    mobileApp: "Приложение для мобильных устройств iOS и Android, с тестами CDL с возможностью перевода.",
    howToUseAppArticle: "Как пользоваться приложением",
    aboutProject: "О Проекте",
    tryFree: "Попробовать Бесплатно",
    support: "Поддержка",
    privacy: "Конфиденциальность",
    publicAgreement: "Публичное Соглашение",
    feedback: "Обратная Связь",
    faq: "Часто Задаваемые Вопросы",
    resources: "Ресурсы",
    howToBecomeTruckDriverArticle: "Как стать дальнобойщиком",
    howToGetPermitArticle: "Как получить пермит",
    cdlRussianSchool: "Школа CDL на русском",
    jobs: "Найти Работу",
    allRightsReserved: "Все права защищены",
  },

  "ua": {
    downloadApp: "Завантажити додаток",
    downloadAppText: "Завантажити CDL Help — тести CDL з перекладом",
    downloadAndTry: "Безкоштовно завантажити додаток CDL Help і протестувати питання.",
    androidApp: "Додаток Android",
    downloadButton: "Завантажити",
    iosApp: "Додаток iOS",
    mobileApp: "Додаток для мобільних пристроїв iOS та Android з тестами CDL з можливістю перекладу.",
    howToUseAppArticle: "Як користуватися програмою",
    aboutProject: "Про проект",
    tryFree: "Спробувати безкоштовно",
    support: "Підтримка",
    privacy: "Конфіденційність",
    publicAgreement: "Публічний договір",
    feedback: "Зворотній зв'язок",
    faq: "Поширені запитання",
    resources: "Ресурси",
    howToBecomeTruckDriverArticle: "Як стати далекобійником",
    howToGetPermitArticle: "Як отримати дозвіл",
    jobs: "Знайти роботу",
    cdlRussianSchool: "Школа CDL українською мовою",
    allRightsReserved: "Все права защищены",
  }
}

const Footer = () => {
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { downloadApp, downloadAndTry, downloadAppText, downloadButton, iosApp, androidApp, jobs, mobileApp, howToBecomeTruckDriverArticle, howToGetPermitArticle, howToUseAppArticle, aboutProject, tryFree, support, privacy, publicAgreement, feedback, faq, resources, cdlRussianSchool, allRightsReserved } = localeContent[locale];
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
                    <Link href="/kak-ispolzovat-cdl-help">
                      <a>{howToUseAppArticle}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#about">
                      <a>{aboutProject}</a>
                    </Link>
                  </li>
                  {/* <li>
                                        <Link href="/features">
                                            <a>Отзывы</a>
                                        </Link>
                                    </li> */}
                  <li>
                    <a href="https://academy.truckdriver.help/quiz">
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
                    <Link href="/privacy-policy">
                      <a>{privacy}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions">
                      <a>{publicAgreement}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://school.cdlhelp.app/contact/">{feedback}</a>
                  </li>
                  <li>
                    <Link href="/faq">
                      <a>{faq}</a>
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
                    <Link href="/dalnoboishik">
                      <a>{howToBecomeTruckDriverArticle}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/permit">
                      <a>{howToGetPermitArticle}</a>
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
