import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Lazy load the quiz since it's below the fold
const DynamicQuiz = dynamic(() => import('../_App/DynamicImports').then(mod => mod.DynamicQuiz), {
  ssr: false,
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const TopContainer = () => {
  const { t } = useTranslation('index');

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
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </div>
        <div className="container-fluid" style={{ marginBottom: '4rem' }}>
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8 col-md-10" style={{ maxWidth: '800px' }}>
              <div style={{ marginTop: '40px' }}>
                <h1
                  style={{
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    marginBottom: '20px',
                    minHeight: '38px', // Prevent layout shift
                    lineHeight: '1.2',
                  }}
                >
                  {t('title')}
                </h1>

                <p
                  style={{
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '40px',
                    minHeight: '24px', // Prevent layout shift
                    lineHeight: '1.5',
                  }}
                >
                  {t('description')}
                </p>
              </div>
              <div>
                <DynamicQuiz contained={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopContainer;
