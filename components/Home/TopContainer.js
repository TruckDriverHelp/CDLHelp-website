import React from "react";
import Image from "next/image";
import Quiz from "../Quiz/quiz";
const TopContainer = () => {
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
            <div className="col-lg-6 col-md-6" style={{ maxWidth: '650px' }}>
              <h1 style={{ textAlign: 'center', fontSize: '1.6rem' }}>Подготовительные CDL тесты на русском языке
              </h1>

              <p style={{ textAlign: 'center', margin: 0 }}>Приложение CDL Help поможет Вам не только подготовиться к тестам CDL для того чтобы получить водительские права и стать дальнобойщиком в США, но с изучением английского языка.</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '360px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '30px 0 10px 0' }}>
                  <a href="#" className="cta-btn cta-btn-primary" style={{
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
                  <a href="#" className="cta-btn cta-btn-secondary" style={{
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
                <a href="#" style={{
                  color: '#5a5886',
                  textDecoration: 'underline',
                  marginBottom: '30px'
                }}>
                  Попробовать тесты онлайн
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="app-intro-video-box">
                <Image
                  src="/images/video/video-3.jpg"
                  alt="video-img"
                  width={550}
                  height={360}
                />
                <div
                  onClick={e => { e.preventDefault(); openModal() }}
                  className="video-btn popup-youtube"
                >
                  <i className="ri-play-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div >
    </>
  );
};

export default TopContainer;

