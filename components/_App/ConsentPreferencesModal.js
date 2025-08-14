import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/ConsentPreferences.module.css';

const ConsentPreferencesModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation('cookie');

  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be changed
    analytics: false,
    marketing: false,
    preferences: false,
  });

  if (!isOpen) return null;

  const handleToggle = type => {
    if (type === 'necessary') return; // Cannot toggle necessary cookies

    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSavePreferences = () => {
    onSave(preferences);
  };

  const handleAcceptAll = () => {
    onSave({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleRejectAll = () => {
    onSave({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('preferences.title', 'Privacy Preferences Center')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.description}>
            {t(
              'preferences.description',
              'When you visit our website, we may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences, or your device and is mostly used to make the site work as you expect it to.'
            )}
          </p>

          <div className={styles.consentCategories}>
            {/* Necessary Cookies - Always On */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <h3>{t('preferences.necessary.title', 'Strictly Necessary Cookies')}</h3>
                  <p>
                    {t(
                      'preferences.necessary.description',
                      'These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.'
                    )}
                  </p>
                </div>
                <div className={styles.toggle}>
                  <span className={styles.alwaysOn}>{t('preferences.alwaysOn', 'Always On')}</span>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <h3>{t('preferences.analytics.title', 'Analytics Cookies')}</h3>
                  <p>
                    {t(
                      'preferences.analytics.description',
                      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.'
                    )}
                  </p>
                  <details className={styles.vendorDetails}>
                    <summary>{t('preferences.viewVendors', 'View vendors')}</summary>
                    <ul>
                      <li>Google Analytics 4</li>
                      <li>Yandex Metrica</li>
                      <li>Amplitude</li>
                    </ul>
                  </details>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleToggle('analytics')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <h3>{t('preferences.marketing.title', 'Marketing Cookies')}</h3>
                  <p>
                    {t(
                      'preferences.marketing.description',
                      'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant ads on other sites.'
                    )}
                  </p>
                  <details className={styles.vendorDetails}>
                    <summary>{t('preferences.viewVendors', 'View vendors')}</summary>
                    <ul>
                      <li>Meta (Facebook) Pixel</li>
                      <li>Google Ads</li>
                      <li>AppsFlyer</li>
                    </ul>
                  </details>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleToggle('marketing')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            {/* Preference Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <h3>{t('preferences.preferences.title', 'Preference Cookies')}</h3>
                  <p>
                    {t(
                      'preferences.preferences.description',
                      'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.'
                    )}
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={() => handleToggle('preferences')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.rejectAllButton} onClick={handleRejectAll}>
            {t('preferences.rejectAll', 'Reject All')}
          </button>
          <button className={styles.saveButton} onClick={handleSavePreferences}>
            {t('preferences.savePreferences', 'Save Preferences')}
          </button>
          <button className={styles.acceptAllButton} onClick={handleAcceptAll}>
            {t('preferences.acceptAll', 'Accept All')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentPreferencesModal;
