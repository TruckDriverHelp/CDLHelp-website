// Navbar Component Style File Path: public/css/pages-and-components-css/navbar.scss

import React from "react";
import Link from "@/utils/ActiveLink";
import Image from "next/image";
import { useRouter } from "next/router";

const localeContent = {
  "ru": {
    main: "Главная", 
    resources: "Ресурсы",
    dalnoboishik: "Как стать дальнобойщиком",
    howToUseApp: "Как пользоваться приложением CDL help",
    howToGetPermit: "Как получить пермит CLP (пермит)",
    workForTruckers: "Работа для дальнобойщиков",
    faq: "Часто Задаваемые Вопросы",
    cdlSchool: "CDL школа",
  },
  "ua": {
    main: "Головна",
    resources: "Ресурси",
    dalnoboishik: "Як стати далекобійником",
    howToUseApp: "Як користуватися додатком CDL help",
    howToGetPermit: "Як отримати дозвіл CLP (Перміт)",
    workForTruckers: "Робота для далекобійників",
    faq: "Поширені запитання",
    cdlSchool: "CDL школа",
  }
};

const Navbar = () => {
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

    // const { locale, locales, defaultLocale, asPath } = useRouter();
    // const { main, resources, dalnoboishik, howToGetPermit, howToUseApp, workForTruckers, faq, cdlSchool } = localeContent[locale];

  return (
    <>
      <div id="navbar" className="navbar-area navbar-style-two">
        {/* <div className="texap-nav">
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light bg-light">
              <Link href="/">
                <a className="navbar-brand">
                  <Image
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
                      <a className="nav-link">{main}</a>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link href="#" activeClassName="active">
                      <a
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle nav-link"
                      >
                        {resources}
                      </a>
                    </Link>

                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/dalnoboishik">
                          <a>{dalnoboishik}</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kak-ispolzovat-cdl-help">
                          <a>{howToUseApp}</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/permit">
                          <a>{howToGetPermit}</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="https://www.truckdriver.help/"
                        >
                          {workForTruckers}
                        </a>
                      </li>

                      <li className="nav-item">
                        <Link href="/faq">
                          <a className="nav-link">{faq}</a>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link href="/cdl-shkola">
                      <a className="nav-link">{cdlSchool}</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="https://www.dmvhelp.app/">
                      DMV Help
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="https://www.mir.chat/">
                      Mir.chat
                    </a>
                  </li>
                  <li className="nav-item">
                  <Link href="/contact">
                    <a className="nav-link">Контакты</a>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="others-options">
                <a href="https://www.t.me/truckdriverhelp">
                  <i
                    className="ri-telegram-fill"
                    style={{ color: "#3c9ff0", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>
                <a href="https://www.youtube.com/@truckdriverdothelp">
                  <i
                    className="ri-youtube-fill"
                    style={{ color: "#ff0000", fontSize: 26, marginRight: 5 }}
                  ></i>
                </a>
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
        </div> */}
      </div>
    </>
  );
};

export default Navbar;
