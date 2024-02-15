// Footer Component Style File Path: public/css/pages-and-components-css/footer.scss

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const localeContent = {
  "ru": {
    downloadApplication: "Приложение для мобильных устройств iOS и Android, с тестами CDL с возможностью перевода.",
    howToUse: "Как пользоваться приложением",
    aboutProject: "О Проекте",
    tryOut: "Попробовать Бесплатно",
    confidential: "Конфиденциальность",
    publicAgreement: "Публичное Соглашение",
    feedBack: "Обратная Связь",
    faq: "Часто Задаваемые Вопросы",
    resources: "Ресурсы",
    howToBecome: "Как стать дальнобойщиком",
    howToGetPermit: "Как получить пермит",
    cdlSchool: "Школа CDL на русском",
    findWork: "Найти работу",
    support: "Поддержка", 

  },
  "ua": {
    downloadApplication: "Додаток для мобільних пристроїв iOS та Android з тестами CDL з можливістю перекладу.",
    howToUse: "Як користуватися програмою",
    aboutProject: "Про проект",
    tryOut: "Спробувати безкоштовно",
    confidential: "Конфіденційність",
    publicAgreement: "Публічний договір",
    feedBack: "Зворотній зв'язок",
    faq: "Поширені запитання",
    resources: "Ресурси",
    howToBecome: "Як стати далекобійником",
    howToGetPermit: "Як отримати дозвіл",
    cdlSchool: "Школа CDL українською мовою",
    findWork: "Знайти роботу",
    support: "Підтримка", 
  }
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { downloadApplication, howToBecome, howToGetPermit, howToUse, aboutProject, tryOut, confidential, publicAgreement, feedBack, faq, resources, cdlSchool, findWork, support } = localeContent[locale];
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
                  {downloadApplication}
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
                      <a>{howToUse}</a>
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
                      {tryOut}
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
                      <a>{confidential}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions">
                      <a>{publicAgreement}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://school.cdlhelp.app/contact/">{feedBack}</a>
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
                      <a>{howToBecome}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/permit">
                      <a>{howToGetPermit}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cdl-shkola">
                      <a>{cdlSchool}</a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://www.truckdriver.help/">{findWork}</a>
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
              {currentYear} &copy; <strong>CDL Help</strong>. Все права защищены{" "}
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
