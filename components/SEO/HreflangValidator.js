import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Same mapping as in SEOHead.tsx
const HREFLANG_LOCALE_MAP = {
  'en-US': 'en',
  'ru-RU': 'ru',
  'uk-UA': 'uk',
  'ar-SA': 'ar',
  'ko-KR': 'ko',
  'zh-CN': 'zh',
  'tr-TR': 'tr',
  'pt-BR': 'pt',
};

export default function HreflangValidator() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Validate hreflang tags in development
      const hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
      const issues = [];

      // Check for x-default
      const hasXDefault = Array.from(hreflangTags).some(
        tag => tag.getAttribute('hreflang') === 'x-default'
      );
      if (!hasXDefault) {
        issues.push('Missing x-default hreflang tag');
      }

      // Check for proper locale codes
      hreflangTags.forEach(tag => {
        const hreflang = tag.getAttribute('hreflang');
        const href = tag.getAttribute('href');

        if (hreflang !== 'x-default') {
          // Check if using proper locale format (except x-default)
          if (!hreflang.includes('-')) {
            issues.push(`Incorrect locale format: ${hreflang} (should be like en-US)`);
          }

          // Check if URL is absolute
          if (!href.startsWith('http')) {
            issues.push(`Hreflang URL must be absolute: ${href}`);
          }

          // Check if URL structure is correct (URLs should use simple codes like /ru/, not /ru-RU/)
          if (href.includes('/en-US/') || href.includes('/ru-RU/') || href.includes('/uk-UA/')) {
            issues.push(`URL should use simple locale codes (/ru/), not full codes: ${href}`);
          }
        }
      });

      // Check for all required locales
      const expectedLocales = Object.keys(HREFLANG_LOCALE_MAP);
      expectedLocales.forEach(locale => {
        const hasLocale = Array.from(hreflangTags).some(
          tag => tag.getAttribute('hreflang') === locale
        );
        if (!hasLocale) {
          issues.push(`Missing hreflang for locale: ${locale}`);
        }
      });

      // Log validation results
      if (issues.length > 0) {
        console.warn(
          'Found hreflang tags:',
          Array.from(hreflangTags).map(tag => ({
            hreflang: tag.getAttribute('hreflang'),
            href: tag.getAttribute('href'),
          }))
        );
      } else {
      }
    }
  }, [router.asPath]);

  return null;
}
