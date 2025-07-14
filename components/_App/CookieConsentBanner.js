import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import consentManager from '../../lib/consent-manager';
import styles from '../../styles/CookieConsent.module.css';

const CookieConsentBanner = () => {
  const { t, ready } = useTranslation('cookie');
  const [showBanner, setShowBanner] = useState(false);
  const [isTranslationReady, setIsTranslationReady] = useState(false);

  useEffect(() => {
    consentManager.init();
    const consent = consentManager.getConsent();

    if (consent === null) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, []);

  useEffect(() => {
    // Wait for translations to be ready before showing the banner
    if (ready) {
      setIsTranslationReady(true);
    }
  }, [ready]);

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

  // Don't show banner if it shouldn't be shown or if translations aren't ready
  if (!showBanner || !isTranslationReady) {
    return null;
  }

  // Helper function to get translation with fallback
  const getTranslation = (key, fallback) => {
    const translation = t(key);
    // If translation is the same as key, it means it's not loaded yet
    if (translation === key || !translation) {
      return fallback;
    }
    return translation;
  };

  return (
    <div className={styles.cookieBanner}>
      <p className={styles.cookieText}>
        {getTranslation(
          'text',
          'We use cookies to improve your experience. By continuing, you accept our use of cookies.'
        )}
      </p>
      <p className={styles.cookiePolicy}>
        <Link href="/cookies-policy">
          <a>{getTranslation('policy', 'Read more about our Cookies Policy')}</a>
        </Link>
      </p>

      <div className={styles.buttonContainer}>
        <button onClick={handleAccept} className={styles.cookieButtonAccept}>
          {getTranslation('accept', 'Accept All')}
        </button>
        <button onClick={handleCustomize} className={styles.cookieButtonCustomize}>
          {getTranslation('customize', 'Only Essential')}
        </button>
        <button onClick={handleReject} className={styles.cookieButtonReject}>
          {getTranslation('deny', 'Reject All')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
