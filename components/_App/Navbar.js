// Navbar Component Style File Path: public/css/pages-and-components-css/navbar.scss

import React from "react";
import Link from "@/utils/ActiveLink";
import Image from "next/image";
import LanguageSwitcher from "@/components/_App/LanguageSwitcher"
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";


const articleList = {
  "en": [
    {
      "title": "How to use the CDL Help App",
      "slug": "how-to-use-cdl-help"
    },
    {
      "title": "How to become a Truck Driver in USA",
      "slug": "how-to-become-a-truck-driver-in-usa"
    },
    {
      "title": "How to get a CDL Permit",
      "slug": "how-to-get-clp-permit"
    },
    {
      "title": "CDL – Frequently Asked Questions",
      "slug": "frequently-asked-questions-cdl-help"
    }
  ],
  "ru": [
    {
      "title": "Как стать дальнобойщиком в США",
      "slug": "kak-stat-dalnoboishikom"
    },
    {
      "title": "Как использовать приложение CDL Help",
      "slug": "kak-ispolzovat-cdl-help"
    },
    {
      "title": "Как получить CLP пермит",
      "slug": "kak-poluchit-clp-permit"
    },
    {
      "title": "Часто задаваемые вопросы",
      "slug": "chasto-zadavaemye-voprosy"
    }
  ],
  "uk": [
    {
      "title": "Як використовувати додаток CDL Help",
      "slug": "yak-vykorystovuvaty-dodatok-cdl-help"
    },
    {
      "title": "Як стати водієм вантажівки в США",
      "slug": "yak-staty-vodiyem-vantazhivky-v-amerytsi"
    },
    {
      "title": "Як отримати дозвіл CDL",
      "slug": "yak-otrymaty-dozvil-cdl"
    },
    {
      "title": "CDL Help – Часті запитання",
      "slug": "chasti-zapytannya"
    }
  ]

}

const Navbar = () => {
  const {t} = useTranslation("navbar");
  const {locale} = useRouter();
  const [menu, setMenu] = React.useState(true);

  const toggleNavbar = () => {
    setMenu(!menu);
  };

  React.useEffect(() => {
    let elementId = document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        elementId.classList.add("is-sticky");
      } else {
        elementId.classList.remove("is-sticky");
      }
    });
  });

  const classOne = menu
    ? "collapse navbar-collapse"
    : "collapse navbar-collapse show";
  const classTwo = menu
    ? "navbar-toggler navbar-toggler-right collapsed"
    : "navbar-toggler navbar-toggler-right";

  return (
    <>
      <div id="navbar" className="navbar-area navbar-style-two">
        <div className="texap-nav">
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light bg-light">
              <Link href="/">
                <a className="navbar-brand">
                  <img 
                    src="/images/black-logo.png"
                    alt="logo"
                    width="101"
                    height="44"
                  />
                </a>
              </Link>

              <button
                onClick={toggleNavbar}
                className={classTwo}
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-bar top-bar"></span>
                <span className="icon-bar middle-bar"></span>
                <span className="icon-bar bottom-bar"></span>
              </button>

              <div className={classOne} id="navbarSupportedContent">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" activeClassName="active">
                      <a className="nav-link">{t("main")}</a>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link href="#" activeClassName="active">
                      <a
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle nav-link"
                      >
                        {t("resources")}
                      </a>
                    </Link>

                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/dalnoboishik">
                          <a>{t("How to become a truck driver")}</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kak-ispolzovat-cdl-help">
                          <a>{t("How to use the app")}</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/permit">
                          <a>{t("How to get a permit")}</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="https://www.truckdriver.help/"
                        >
                          {t("workForTruckers")}
                        </a>
                      </li>

                      <li className="nav-item">
                        <Link href="/faq">
                          <a className="nav-link">{t("Frequently Asked Questions")}</a>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {(locale === "ru" || locale === "uk") && (
                    <li className="nav-item">
                      <Link href="/cdl-shkola">
                        <a className="nav-link">{t("cdlSchool")}</a>
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <a className="nav-link" href="https://www.dmvhelp.app/">
                      {t("DMV Help")}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="https://www.mir.chat/">
                      {t("Mir.chat")}
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact">
                      <a className="nav-link">{t("contacts")}</a>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="others-options">
                <a href="https://t.me/TruckDriverGroup/13900/13904">
                  <i
                    className="ri-telegram-fill"
                    style={{ color: "#3c9ff0", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>
                {(locale ==="ru" || locale === "uk") && <a href="https://www.youtube.com/@truckdriverdothelp">
                  <i
                    className="ri-youtube-fill"
                    style={{ color: "#ff0000", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>}
                <a href="https://www.facebook.com/truckdriverhelp">
                  <i
                    className="ri-facebook-circle-fill"
                    style={{ color: "#1b74e4", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>
                <a href="https://school.cdlhelp.app/contact/">
                  <i
                    className="ri-mail-fill"
                    style={{ color: "#3b3e78", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
