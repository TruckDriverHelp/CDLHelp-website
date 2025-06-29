import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import analytics from '../../lib/analytics';
import attribution from '../../lib/attribution';

const SmartAppBanner = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // Check if should show banner
    if (typeof window === 'undefined') return;

    // Don't show if already dismissed
    const dismissed = localStorage.getItem('smartBannerDismissed');
    if (dismissed) return;

    // Don't show on download page
    if (window.location.pathname.includes('/download')) return;

    // Detect mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setPlatform('ios');
      setShowBanner(true);
      
      // Track banner impression
      analytics.trackFeatureEngagement('smart_banner', 'impression', 'ios');
    } else if (isAndroid) {
      setPlatform('android');
      setShowBanner(true);
      
      // Track banner impression
      analytics.trackFeatureEngagement('smart_banner', 'impression', 'android');
    }

    // Also add native iOS meta tag for Safari
    if (isIOS) {
      const meta = document.createElement('meta');
      meta.name = 'apple-itunes-app';
      meta.content = `app-id=6444388755, app-argument=${window.location.href}`;
      document.head.appendChild(meta);
    }
  }, []);

  const handleInstall = () => {
    // Track click
    analytics.trackFeatureEngagement('smart_banner', 'click', platform);
    analytics.trackDownloadIntent(platform, 'smart_banner');

    // Redirect with attribution
    attribution.redirect(platform, {
      source: 'smart_banner',
      page: router.pathname
    });
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('smartBannerDismissed', 'true');
    
    // Track dismissal
    analytics.trackFeatureEngagement('smart_banner', 'dismiss', platform);
  };

  if (!showBanner) return null;

  return (
    <div className="smart-app-banner" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 9999,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: '#6c757d',
          cursor: 'pointer',
          padding: '5px'
        }}
        aria-label="Close"
      >
        ×
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        marginLeft: '10px'
      }}>
        <img
          src="/images/cdlhelp-icon.png"
          alt="CDL Help"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            marginRight: '12px'
          }}
        />
        
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '2px'
          }}>
            CDL Help
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6c757d'
          }}>
            {t('smartBannerText', 'Free - On the App Store')}
          </div>
        </div>
      </div>

      <button
        onClick={handleInstall}
        style={{
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {t('smartBannerButton', 'VIEW')}
      </button>

      <style jsx>{`
        @media (max-width: 480px) {
          .smart-app-banner {
            padding: 8px !important;
          }
          .smart-app-banner img {
            width: 35px !important;
            height: 35px !important;
          }
          .smart-app-banner button {
            padding: 5px 15px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartAppBanner;