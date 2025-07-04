import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import consentManager from '../../lib/consent-manager';

const CookieConsentBanner = () => {
  const { t } = useTranslation('cookie');
  const [showBanner, setShowBanner] = useState(false);
  // const { locale } = useRouter();

  useEffect(() => {
    consentManager.init();
    const consent = consentManager.getConsent();

    if (consent === null) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    setShowBanner(false);
    consentManager.acceptAll();
    // Reload page to load previously blocked scripts
    window.location.reload();
  };

  const handleReject = () => {
    setShowBanner(false);
    consentManager.rejectAll();
  };

  const handleCustomize = () => {
    // For now, we'll implement simple accept/reject
    // Could expand to show checkboxes for different consent types
    setShowBanner(false);
    consentManager.setConsent({
      analytics: true,
      marketing: false,
    });
    window.location.reload();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="bg-light"
      style={{
        bottom: '0',
        right: '10%',
        position: 'fixed',
        zIndex: '99',
        padding: '20px',
        width: '80%',
        maxWidth: '600px',
        margin: '0 auto',
        borderTop: '2px solid #75759E',
        borderRight: '2px solid #75759E',
        borderLeft: '2px solid #75759E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ color: '#000000', marginBottom: '10px', textAlign: 'center' }}>{t('text')}</p>
      <p style={{ color: '#000000', marginBottom: '20px', textAlign: 'center' }}>
        <Link href="/cookies-policy">
          <a style={{ textDecoration: 'underline' }}>{t('policy')}</a>
        </Link>
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button onClick={handleAccept} className="default-btn">
          {t('accept') || 'Accept All'}
        </button>
        <button
          onClick={handleCustomize}
          className="default-btn"
          style={{ backgroundColor: '#f0f0f0', color: '#333' }}
        >
          {t('customize') || 'Only Essential'}
        </button>
        <button
          onClick={handleReject}
          className="default-btn"
          style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#333' }}
        >
          {t('deny') || 'Reject All'}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
