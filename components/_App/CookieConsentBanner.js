import React, { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const CookieConsentBanner = () => {
  const { t } = useTranslation('cookie');
  const [showBanner, setShowBanner] = useState(false);
  const { locale } = useRouter();

  useEffect(() => {
    const consentCookie = cookie.get('cookieConsent');

    if (consentCookie) {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setShowBanner(false);
    cookie.set('cookieConsent', 'accepted', { expires: 365 });
  };

  const handleReject = () => {
    setShowBanner(false);
    cookie.set('cookieConsent', 'rejected', { expires: 365 });
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="bg-light"
      style={{
        bottom: '0',
        right: '10%', // sorry
        position: 'fixed',
        zIndex: '99',
        padding: '10px 10px',
        width: '80%',
        margin: '0 auto',
        borderTop: '2px solid #75759E',
        borderRight: '2px solid #75759E',
        borderLeft: '2px solid #75759E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ color: '#000000' }}>{t('text')}</p>
      <p style={{ color: '#000000' }}>
        <Link href="/cookies-policy">
          <a>{t('policy')}</a>
        </Link>
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button onClick={handleAccept} className="default-btn" style={{ marginRight: '20px' }}>
          {t('accept')}
        </button>
        <button onClick={handleReject} className="default-btn">
          {t('deny')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
