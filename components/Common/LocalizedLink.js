import Link from 'next/link';
import { useRouter } from 'next/router';
import { validateAndFixUrl } from '../../lib/url-validator';
import consentManager from '../../lib/consent-manager';

/**
 * LocalizedLink Component
 * A wrapper around Next.js Link that ensures proper locale handling
 * Prevents duplicate locale paths and other URL issues
 * Now includes cross-domain consent passthrough
 */
export default function LocalizedLink({ href, locale, children, enableConsentPassthrough = false, ...props }) {
  const router = useRouter();
  const currentLocale = locale || router.locale || 'en';

  // If href is an external URL or mobile app link, add consent parameters if enabled
  if (
    typeof href === 'string' &&
    (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('cdlhelp://'))
  ) {
    let finalHref = href;
    
    // Add consent parameters for external URLs and app deep links if consent passthrough is enabled
    if (enableConsentPassthrough) {
      finalHref = addConsentParametersToUrl(href);
    }
    
    return (
      <Link href={finalHref} {...props}>
        {children}
      </Link>
    );
  }

  // For internal links, validate and fix the URL
  const validatedHref = typeof href === 'string' ? validateAndFixUrl(href, currentLocale) : href;

  // For non-English locales, use Next.js locale prop
  // For English, use the path without locale prefix
  if (currentLocale === 'en') {
    return (
      <Link href={validatedHref} locale="en" {...props}>
        {children}
      </Link>
    );
  }

  // For other locales, let Next.js handle the locale prefix
  // Remove any locale from the path as Next.js will add it
  const pathWithoutLocale =
    typeof validatedHref === 'string'
      ? validatedHref.replace(new RegExp(`^/${currentLocale}/`), '/')
      : validatedHref;

  return (
    <Link href={pathWithoutLocale} locale={currentLocale} {...props}>
      {children}
    </Link>
  );
}

/**
 * Add consent parameters to a URL for cross-domain consent synchronization
 * @param {string} url - The URL to enhance with consent parameters
 * @returns {string} - URL with consent parameters added
 */
function addConsentParametersToUrl(url) {
  try {
    const consent = consentManager.getConsent();
    if (!consent) {
      return url; // No consent data to pass
    }

    const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://www.cdlhelp.com');
    
    // Add consent parameters
    urlObj.searchParams.set('consent_sync', '1');
    urlObj.searchParams.set('consent_timestamp', Date.now().toString());
    
    // Add individual consent types
    if (consent.analytics !== undefined) {
      urlObj.searchParams.set('consent_analytics', consent.analytics ? '1' : '0');
    }
    if (consent.marketing !== undefined) {
      urlObj.searchParams.set('consent_marketing', consent.marketing ? '1' : '0');
    }
    if (consent.preferences !== undefined) {
      urlObj.searchParams.set('consent_preferences', consent.preferences ? '1' : '0');
    }
    if (consent.necessary !== undefined) {
      urlObj.searchParams.set('consent_necessary', consent.necessary ? '1' : '0');
    }

    // Add consent mode version for compatibility
    urlObj.searchParams.set('consent_mode_version', 'v2');
    
    // Add source for debugging
    urlObj.searchParams.set('consent_source', 'website');

    return urlObj.toString();
  } catch (error) {
    console.warn('Error adding consent parameters to URL:', error);
    return url; // Return original URL if there's an error
  }
}
