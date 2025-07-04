import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DynamicModalVideo } from '../_App/DynamicImports';

const AppIntroVideo = () => {
  // Popup Video
  const { t } = useTranslation('index');
  const { locale } = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);
  // const openModal = () => {
  //   setIsOpen(!isOpen);
  // };

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
      <div id="truckdriverhelp" className="app-video-area pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="app-intro-video-box">
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
                  <span className="sub-title">{t('stepByStep')}</span>
                  <h2>{t('howToGet')}</h2>

                  <ul className="article-links">
                    <li>
                      <Link
                        href={`/${locale}/${articleSlugs.howToBecome[locale] || articleSlugs.howToBecome.en}`}
                      >
                        <a
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#5a5886',
                            padding: '12px 0px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                          }}
                        >
                          {t('videoTitles.howToBecome')}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${locale}/${articleSlugs.howToPrepare[locale] || articleSlugs.howToPrepare.en}`}
                      >
                        <a
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#5a5886',
                            padding: '12px 0px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                          }}
                        >
                          {t('videoTitles.howToPrepare')}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${locale}/${articleSlugs.howToUseApp[locale] || articleSlugs.howToUseApp.en}`}
                      >
                        <a
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#5a5886',
                            padding: '12px 0px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                          }}
                        >
                          {t('videoTitles.howToUseApp')}
                        </a>
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
                    <li>
                      <Link
                        href={`/${locale}/${articleSlugs.cdlSchools[locale] || articleSlugs.cdlSchools.en}`}
                      >
                        <a
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#5a5886',
                            padding: '12px 0px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                          }}
                        >
                          {t('cdlSchoolsInfo')}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/${articleSlugs.faq[locale] || articleSlugs.faq.en}`}>
                        <a
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#5a5886',
                            padding: '12px 0px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                          }}
                        >
                          {t('faq.title')}
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* If you want to change the video need to update videoID */}
      <DynamicModalVideo
        channel="youtube"
        isOpen={!isOpen}
        videoId="Ll4yVz7yBlQ"
        onClose={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default AppIntroVideo;
