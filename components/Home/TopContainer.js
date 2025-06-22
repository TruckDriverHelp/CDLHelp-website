import React from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DynamicQuiz } from '../_App/DynamicImports';

const TopContainer = () => {
  const { t } = useTranslation('index');
  const router = useRouter();

  return (
    <>
      <div className="new-app-main-banner-wrap-area">
        <div className="background-lines">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="line"
              style={{
                left: `${index * 25}%`,
                animationDelay: `${index * 0.2}s`
              }}
            />
          ))}
        </div>
        <div className="container-fluid" style={{ marginBottom: '4rem' }}>
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8 col-md-10" style={{ maxWidth: '800px' }}>
              <div style={{marginTop: '40px'}}>
              <h1 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '20px' }}>{t('title')}</h1>

              <p style={{ textAlign: 'center', margin: 0, marginBottom: '40px' }}>{t('description')}</p>
              </div>
              
              {/* Telegram Group Link - Only for RU and UK locales */}
              {(router.locale === 'ru' || router.locale === 'uk') && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <a 
                    href="https://www.t.me/truckdrivergroup" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0088cc',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    <i 
                      className="ri-telegram-fill" 
                      style={{ 
                        fontSize: '20px',
                        color: '#0088cc'
                      }}
                    ></i>
                    Группа Телеграм
                  </a>
                </div>
              )}
              
              <div>
                <DynamicQuiz contained={true} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '360px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '30px 0 10px 0' }}>
                  <a href={`https://apps.apple.com/${router.locale == 'en' ? 'us' : router.locale}/app/cdl-help/id6444388755`} className="cta-btn cta-btn-primary" style={{
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    border: '3px solid #5a5886',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#5a5886',
                    borderRadius: '50px',
                    padding: "10px 25px"
                  }}>
                    <i className="ri-apple-fill" style={{ fontSize: '24px' }}></i>
                    App Store
                  </a>
                  <a href={`https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp${router.locale == 'en' ? '' : `&hl=${router.locale}`}`} className="cta-btn cta-btn-secondary" style={{
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    border: '3px solid #5a5886',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#5a5886',
                    borderRadius: '50px',
                    padding: "10px 25px"
                  }}>
                    <i className="ri-google-play-fill" style={{ fontSize: '24px' }}></i>
                    Play Store
                  </a>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '0px',
                  marginBottom: '10px',
                }}>
                  <i className="ri-star-fill" style={{ color: '#f4cc43', fontSize: '20px' }}></i>
                  <i className="ri-star-fill" style={{ color: '#f4cc43', fontSize: '20px' }}></i>
                  <i className="ri-star-fill" style={{ color: '#f4cc43', fontSize: '20px' }}></i>
                  <i className="ri-star-fill" style={{ color: '#f4cc43', fontSize: '20px' }}></i>
                  <i className="ri-star-half-fill" style={{ color: '#f4cc43', fontSize: '20px' }}></i>
                  <span style={{ marginLeft: '4px', color: '#5a5886', fontSize: '20px' }}>4.5+</span>
                </div>
                <a href={`https://test.cdlhelp.com/${router.locale == 'en' ? '' : `${router.locale}`}`} style={{
                  color: '#5a5886',
                  textDecoration: 'underline',
                  marginBottom: '30px'
                }}>
                  {t('tryOnline')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopContainer;

