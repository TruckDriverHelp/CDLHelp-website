import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import consentManager from '../../lib/consent-manager';
import styles from '../../styles/CookieConsent.module.css';

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
    <div className={styles.cookieBanner}>
      <p className={styles.cookieText}>{t('text')}</p>
      <p className={styles.cookiePolicy}>
        <Link href="/cookies-policy">
          <a>{t('policy')}</a>
        </Link>
      </p>

      <div className={styles.buttonContainer}>
        <button onClick={handleAccept} className={styles.cookieButtonAccept}>
          {t('accept') || 'Accept All'}
        </button>
        <button onClick={handleCustomize} className={styles.cookieButtonCustomize}>
          {t('customize') || 'Only Essential'}
        </button>
        <button onClick={handleReject} className={styles.cookieButtonReject}>
          {t('deny') || 'Reject All'}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
