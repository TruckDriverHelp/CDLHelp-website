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
      slug: "/how-to-become-a-truck-driver"
    },
    howToGetPermitArticle: {
      title: "How to get a CDL Permit",
      slug: "/how-to-get-cdl-permit"
    },
    faq: {
      title: "Frequently Asked Questions",
      slug: "/frequently-asked-questions"
    },
    howToGetCDLArticle: {
      title: "How to get CDL",
      slug: "/how-to-get-cdl"
    }
  },
  "ru": {
    howToUseAppArticle: {
      title: "Как использовать приложение CDL Help",
      slug: "/kak-ispolzovat-cdlhelp"
    },
    howToBecomeTruckDriverArticle: {
      title: "Как стать дальнобойщиком в США",
      slug: "/kak-stat-dalnoboishikom"
    },
    howToGetPermitArticle: {
      title: "Как получить CDL пермит",
      slug: "/kak-poluchit-cdl-permit"
    },
    faq: {
      title: "Часто задаваемые вопросы",
      slug: "/chasto-zadavaemye-voprosy"
    },
    howToGetCDLArticle: {
      title: "Как получить CDL",
      slug: "/kak-poluchit-cdl"
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
    },
    howToGetCDLArticle: {
      title: "Як отримати CDL",
      slug: "/yak-otrymaty-cdl"
    }
  },
  "ar": {
    howToUseAppArticle: {
      title: "كيفية استخدام تطبيق CDL مساعدة",
      slug: "/kayfiyat-astikhdam-tatbiq-cdl-musaeda"
    },
    howToBecomeTruckDriverArticle:
    {
      title: "كيف تصبح سائق شاحنة في الولايات المتحدة",
      slug: "/kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida"
    },
    howToGetPermitArticle:
    {
      title: "كيفية الحصول على تصريح CDL",
      slug: "/kayfiyat-alhusul-ala-tasrih-cdl"
    },
    faq:
    {
      title: "الأسئلة الشائعة مساعدة CDL",
      slug: "/alas-ila-alshaeia-musaedat-cdl"
    },
    howToGetCDLArticle: {
      title: "كيفية الحصول على رخصة القيادة التجارية (CDL)",
      slug: "/kayfa-tahsil-cdl"
    }
  },
  "zh": {
    howToUseAppArticle: {
      title: "如何使用 CDL 帮助应用程序",
      slug: "/ruhe-shiyong-cdl-bangzhu-yingyongchengxu"
    },
    howToBecomeTruckDriverArticle:
    {
      title: "如何成为美国卡车司机",
      slug: "/ruhe-chengwei-meiguo-kache-siji"
    },
    howToGetPermitArticle:
    {
      title: "如何获得 CDL 许可证",
      slug: "/ruhe-huode-cdl-xukezheng"
    },
    faq:
    {
      title: "常见问题 CDL 帮助",
      slug: "/changjian-wenti-cdl-bangzhu"
    },
    howToGetCDLArticle: {
      title: "如何获得CDL",
      slug: "/ruhe-huode-cdl"
    }
  },
  "ko": {
    howToUseAppArticle: {
      title: "CDL 도움 앱 사용법",
      slug: "/cdl-doum-aeb-sayongbeob"
    },
    howToBecomeTruckDriverArticle:
    {
      title: "미국에서 트럭 운전사가 되는 방법",
      slug: "/migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob"
    },
    howToGetPermitArticle:
    {
      title: "CDL 허가증을 받는 방법",
      slug: "/cdl-heogajeungeul-badneun-bangbeob"
    },
    faq:
    {
      title: "자주 묻는 질문 CDL 도움",
      slug: "/jaju-mudneun-jilmun-cdl-doum"
    },
    howToGetCDLArticle: {
      title: "CDL 취득 방법",
      slug: "/cdl-eobtneun-bangbeob"
    }
  },
  "tr": {
    howToUseAppArticle: {
      title: "CDL Yardım nasıl kullanılır",
      slug: "/cdl-yardim-nasil-kullanilir"
    },
    howToBecomeTruckDriverArticle:
    {
      title: "Nasıl kamyon şoförü olunur",
      slug: "/nasil-kamyon-soforu-olunur"
    },
    howToGetPermitArticle:
    {
      title: "CDL İzni Nasıl Alınır",
      slug: "/cdl-izni-nasil-alinir"
    },
    faq:
    {
      title: "Sıkça Sorulan Sorular CDL Help",
      slug: "/sikca-sorulan-sorular"
    },
    howToGetCDLArticle: {
      title: "CDL nasıl alınır",
      slug: "/cdl-nasil-alinir"
    }
  },
  "pt": {
    howToUseAppArticle: {
      title: "Como Usar o CDL Help",
      slug: "/como-usar-o-cdl-help"
    },
    howToBecomeTruckDriverArticle:
    {
      title: "Como se tornar um motorista de caminhãoo",
      slug: "/como-se-tornar-motorista-de-caminhaoo"
    },
    howToGetPermitArticle:
    {
      title: "Como obter uma licença CDL",
      slug: "/como-obter-uma-licenca-cdl"
    },
    faq:
    {
      title: "Perguntas Frequentes",
      slug: "/perguntas-frequentes"
    },
    howToGetCDLArticle: {
      title: "Como tirar a CDL",
      slug: "/como-obter-cdl"
    }
  }
}

const Footer = () => {
  const { t } = useTranslation("footer");
  const { locale } = useRouter();
  const currentYear = new Date().getFullYear();
  const { howToUseAppArticle, howToBecomeTruckDriverArticle, faq, howToGetPermitArticle, howToGetCDLArticle } = articleList[locale];

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
                  {t("mobileApp")}
                </p>

                <ul className="social-links">
                  {/* {(locale === "ru" || locale === "uk") && <li>
                    <a href="https://www.youtube.com/@truckdriverdothelp" target="_blank">
                      <i className="ri-youtube-fill"></i>
                    </a>
                  </li>}
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
                  </li> */}
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
                      <a>{t("aboutProject")}</a>
                    </Link>
                  </li>
                  {/* <li>
                                        <Link href="/features">
                                            <a>Отзывы</a>
                                        </Link>
                                    </li> */}
                  <li>
                    <a href={`https://test.cdlhelp.com/${locale}/`}>
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
                    <Link href="/privacy-policy/" locale={false}>
                      <a>{t("privacy")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions/" locale={false}>
                      <a>{t("publicAgreement")}</a>
                    </Link>
                  </li>
                  <li>
                    <a href={`/${locale}/contact/`}>{t("feedback")}</a>
                  </li>
                  <li>
                    <Link href={faq.slug + '/'} locale={locale}>
                      <a>{faq.title}</a>
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
                    <Link href={howToGetCDLArticle.slug} locale={locale}>
                      <a>{howToGetCDLArticle.title}</a>
                    </Link>
                  </li>
                  {locale == "ru" && <li>
                    <Link href="/cdl-shkola/">
                      <a>{t("cdlRussianSchool")}</a>
                    </Link>
                  </li>}
                  <li>
                    <a href="https://www.truckdriver.help/">{t("jobs")}</a>
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
                {t("footerText")}<br />
                {currentYear} &copy; <a href="https://www.truckdriver.help/" target="_blank">TruckDriver.help LLC </a>{t("allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
