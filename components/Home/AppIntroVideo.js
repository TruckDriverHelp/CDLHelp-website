import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const AppIntroVideo = () => {
  const { t } = useTranslation('index');
  const { locale } = useRouter();

  // Common link style to prevent layout shifts
  const linkStyle = {
    border: 'none',
    background: 'none',
    color: '#5a5886',
    padding: '12px 0px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'underline',
    display: 'block',
    minHeight: '44px',
    lineHeight: '20px',
  };

  // List item style to prevent shifts
  const listItemStyle = {
    marginBottom: '8px',
    minHeight: '44px',
  };

  // Define URL slugs for each locale
  const articleSlugs = {
    howToBecome: {
      en: 'how-to-become-a-truck-driver',
      ar: 'kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
      ru: 'kak-stat-dalnoboishikom',
      uk: 'yak-staty-dalekobiinykom-v-Amerytsi',
      zh: 'ruhe-chengwei-meiguo-kache-siji',
      ko: 'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
      tr: 'nasil-kamyon-soforu-olunur',
      pt: 'como-se-tornar-motorista-de-caminhaoo',
    },
    howToPrepare: {
      en: 'how-to-get-cdl-permit',
      ar: 'kayfa-tahsil-cdl',
      ru: 'kak-poluchit-cdl',
      uk: 'yak-otrymaty-cdl',
      zh: 'ruhe-huode-cdl',
      ko: 'cdl-eobtneun-bangbeob',
      tr: 'cdl-nasil-alinir',
      pt: 'como-obter-cdl',
    },
    howToUseApp: {
      en: 'how-to-use-cdl-help',
      ar: 'kayfiyat-astikhdam-tatbiq-cdl-musaeda',
      ru: 'kak-ispolzovat-cdlhelp',
      uk: 'yak-vykorystovuvaty-dodatok-cdl-help',
      zh: 'ruhe-shiyong-cdl-bangzhu-yingyongchengxu',
      ko: 'cdl-help-aeb-sayongbeob',
      tr: 'cdl-yardim-nasil-kullanilir',
      pt: 'como-usar-o-cdl-help',
    },
    cdlSchools: {
      en: 'what-is-taught-in-cdl-schools',
      ar: 'ma-yatimmu-tadrisuh-fi-madaris-cdl',
      ru: 'o-cdl-shkolakh',
      uk: 'choho-navchayut-u-shkolakh-cdl',
      zh: 'guanyu-cdl-xuexiao',
      ko: 'cdl-haggyoeseoneun-mueos-eul-galeuchimniga',
      tr: 'cdl-okul',
      pt: 'sobre-as-escolas',
    },
    faq: {
      en: 'frequently-asked-questions',
      ar: 'alas-ila-alshaeia-musaedat-cdl',
      ru: 'chasto-zadavaemye-voprosy',
      uk: 'chasti-zapytannya',
      zh: 'changjian-wenti-cdl-bangzhu',
      ko: 'jaju-mudneun-jilmun-cdl-doum',
      tr: 'sikca-sorulan-sorular',
      pt: 'perguntas-frequentes',
    },
  };

  return (
    <>
      <div id="truckdriverhelp" className="app-video-area pb-100" style={{ minHeight: '500px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div
                className="app-intro-video-box"
                style={{ minHeight: '420px', position: 'relative' }}
              >
                <Image
                  src="/images/video/video-2.jpg"
                  alt="video-img"
                  width={635}
                  height={420}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAA8DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQQDAAMAAAAAAAAAAAABAgMABAUREiExE0Gg/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAbEQABBAMAAAAAAAAAAAAAAAABAAIDEQQSIf/aAAwDAQACEQMRAD8AltbO1t0CRoFUAAAbNAUqhzk5Kbdf/9k="
                />
              </div>
            </div>

            {
              <div className="col-lg-6 col-md-12">
                <div className="app-intro-video-content">
                  <span
                    className="sub-title"
                    style={{ display: 'block', minHeight: '24px', lineHeight: '24px' }}
                  >
                    {t('stepByStep')}
                  </span>
                  <h2
                    style={{
                      minHeight: '50px',
                      lineHeight: '1.4',
                      fontSize: '36px',
                      marginBottom: '15px',
                    }}
                  >
                    {t('howToGet')}
                  </h2>

                  <ul
                    className="article-links"
                    style={{ minHeight: '300px', listStyle: 'none', padding: 0, margin: 0 }}
                  >
                    <li style={listItemStyle}>
                      <Link
                        href={`/${locale}/${articleSlugs.howToBecome[locale] || articleSlugs.howToBecome.en}`}
                      >
                        <a style={linkStyle}>{t('videoTitles.howToBecome')}</a>
                      </Link>
                    </li>
                    <li style={listItemStyle}>
                      <Link
                        href={`/${locale}/${articleSlugs.howToPrepare[locale] || articleSlugs.howToPrepare.en}`}
                      >
                        <a style={linkStyle}>{t('videoTitles.howToPrepare')}</a>
                      </Link>
                    </li>
                    <li style={listItemStyle}>
                      <Link
                        href={`/${locale}/${articleSlugs.howToUseApp[locale] || articleSlugs.howToUseApp.en}`}
                      >
                        <a style={linkStyle}>{t('videoTitles.howToUseApp')}</a>
                      </Link>
                    </li>
                    {/* <li>
                                            <a href={`/${locale}/what-is-eldt/`} >
                                                {t('eldtTitle')}
                                            </a><a style={{ 
                                    border: "none",
                                    background: "none",
                                    color: "#5a5886",
                                    padding: "12px 0px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    textDecoration: "underline"
                                }}></a>
                                        </li> */}
                    <li style={listItemStyle}>
                      <Link
                        href={`/${locale}/${articleSlugs.cdlSchools[locale] || articleSlugs.cdlSchools.en}`}
                      >
                        <a style={linkStyle}>{t('cdlSchoolsInfo')}</a>
                      </Link>
                    </li>
                    <li style={listItemStyle}>
                      <Link href={`/${locale}/${articleSlugs.faq[locale] || articleSlugs.faq.en}`}>
                        <a style={linkStyle}>{t('faq.title')}</a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AppIntroVideo;
