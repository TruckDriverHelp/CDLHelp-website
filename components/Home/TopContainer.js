import React from "react";
import Image from "next/image";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DynamicModalVideo, DynamicQuiz } from '../_App/DynamicImports';

const TopContainer = () => {
  const { t } = useTranslation('index');
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const openModal = () => {
    setIsOpen(!isOpen);
  }
  
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
              <h1 style={{ textAlign: 'center', fontSize: '1.6rem' }}>{t('title')}</h1>

              <p style={{ textAlign: 'center', margin: 0 }}>{t('description')}</p>
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
            {/* center div */}
            <div className="col-lg-6 col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="app-intro-video-box" style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '550px',
                height: '360px'
              }}>
                <Image
                  src="/images/video/video-3-no-text.webp"
                  alt="video-img"
                  width={550}
                  height={360}
                  priority={true}
                  loading="eager"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjg0PjU1ODU4Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojr/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 0
                  }}
                />
                <div
                  onClick={e => { e.preventDefault(); openModal() }}
                  className="video-btn popup-youtube"
                  style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                  }}
                >
                  <i className="ri-play-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DynamicModalVideo 
        channel='youtube' 
        isOpen={isOpen} 
        videoId={t('video.intro')} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default TopContainer;

