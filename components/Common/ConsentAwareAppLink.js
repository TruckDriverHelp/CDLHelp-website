import React from 'react';
import crossPlatformConsentSync from '../../lib/cross-platform-consent-sync';
import LocalizedLink from './LocalizedLink';

/**
 * ConsentAwareAppLink Component
 * A specialized link component for navigating to the mobile app with consent synchronization
 */
const ConsentAwareAppLink = ({ 
  appRoute = '', 
  children, 
  className = '',
  fallbackUrl = '/download',
  ...props 
}) => {
  const handleAppLinkClick = (e) => {
    e.preventDefault();
    
    try {
      // Generate app deep link with consent parameters
      const appDeepLink = crossPlatformConsentSync.generateAppDeepLinkWithConsent(appRoute);
      
      // Try to open the app
      const appLinkElement = document.createElement('a');
      appLinkElement.href = appDeepLink;
      appLinkElement.click();
      
      // Set a timeout to redirect to fallback URL if app doesn't open
      setTimeout(() => {
        // Check if we're still on the same page (app didn't open)
        if (document.hasFocus()) {
          window.location.href = fallbackUrl;
        }
      }, 2000);
      
      console.log('ConsentAwareAppLink: Opened app with consent sync:', appDeepLink);
    } catch (error) {
      console.warn('ConsentAwareAppLink: Error opening app link:', error);
      // Fallback to download page
      window.location.href = fallbackUrl;
    }
  };

  return (
    <a 
      href="#" 
      onClick={handleAppLinkClick} 
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

/**
 * ConsentAwareWebsiteLink Component
 * For use in mobile app - creates website links with consent parameters
 * (This is the React Native equivalent would be in the mobile app)
 */
export const ConsentAwareWebsiteLink = ({ 
  websitePath = '/', 
  children, 
  className = '',
  ...props 
}) => {
  const websiteUrl = crossPlatformConsentSync.generateWebsiteUrlWithConsent(websitePath);
  
  return (
    <LocalizedLink 
      href={websiteUrl} 
      className={className}
      enableConsentPassthrough={true}
      {...props}
    >
      {children}
    </LocalizedLink>
  );
};

/**
 * SmartAppDownloadButton Component
 * Detects user's platform and provides appropriate download link with consent sync
 */
export const SmartAppDownloadButton = ({ 
  className = '',
  children = 'Download App',
  ...props 
}) => {
  const handleSmartDownload = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let downloadUrl = '/download'; // Default fallback
    
    // Detect platform and generate appropriate link
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // iOS - try App Store or app scheme
      downloadUrl = 'https://apps.apple.com/app/cdl-help/your-app-id';
      
      // Also try to open the app directly with consent sync
      const appDeepLink = crossPlatformConsentSync.generateAppDeepLinkWithConsent('');
      const appLinkElement = document.createElement('a');
      appLinkElement.href = appDeepLink;
      appLinkElement.click();
      
      // Set timeout for App Store fallback
      setTimeout(() => {
        if (document.hasFocus()) {
          window.location.href = downloadUrl;
        }
      }, 2000);
    } else if (/android/i.test(userAgent)) {
      // Android - try Play Store or app scheme
      downloadUrl = 'https://play.google.com/store/apps/details?id=com.cdlhelp.app';
      
      // Also try to open the app directly with consent sync
      const appDeepLink = crossPlatformConsentSync.generateAppDeepLinkWithConsent('');
      const appLinkElement = document.createElement('a');
      appLinkElement.href = appDeepLink;
      appLinkElement.click();
      
      // Set timeout for Play Store fallback
      setTimeout(() => {
        if (document.hasFocus()) {
          window.location.href = downloadUrl;
        }
      }, 2000);
    } else {
      // Desktop or other platforms - go to download page
      window.location.href = downloadUrl;
    }
  };

  return (
    <button 
      onClick={handleSmartDownload}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default ConsentAwareAppLink;