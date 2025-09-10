import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const LanguageSwitcher = ({ alternateLinks }) => {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('');

  const languages = {
    '': 'Language',
    ar: 'عربي',
    en: 'English',
    ru: 'Русский',
    uk: 'Українська',
    zh: '中文',
    ko: '한국어',
    tr: 'Türkçe',
    pt: 'Português',
  };

  // Set current locale after mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentLocale(router.locale || 'en');
  }, [router.locale]);

  const handleLocaleChange = async event => {
    const newLocale = event.target.value;

    if (!newLocale || newLocale === currentLocale) {
      return;
    }

    setIsChanging(true);

    try {
      // First, try to find the exact path for this locale from alternateLinks
      if (alternateLinks) {
        // Handle different formats of alternateLinks
        let targetPath = null;

        // Check if alternateLinks is an array (from articles/pages with different slugs)
        if (Array.isArray(alternateLinks)) {
          const link = alternateLinks.find(link => link.hrefLang === newLocale);
          if (link?.href) {
            // Use the href directly as it should already be the correct path
            targetPath = link.href;
          }
        }
        // Check if alternateLinks is an object (from static pages)
        else if (typeof alternateLinks === 'object') {
          targetPath = alternateLinks[newLocale];
        }

        if (targetPath) {
          // If we have a full URL, extract just the path
          if (targetPath.startsWith('http')) {
            const url = new URL(targetPath);
            targetPath = url.pathname + url.search + url.hash;
          }

          // Use router.push with the exact path from alternateLinks
          // This preserves different slugs across locales
          await router.push(targetPath, targetPath, { locale: false });
          return;
        }
      }

      // Fallback: use current path with new locale
      // This is for pages that don't provide alternateLinks
      await router.push(router.asPath, router.asPath, { locale: newLocale });
    } catch (error) {
      console.error('Error changing locale:', error);
      // Last resort fallback
      await router.push('/', '/', { locale: newLocale });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="language-switcher-container">
      <label htmlFor="language-select" className="visually-hidden">
        Choose your preferred language
      </label>
      <select
        id="language-select"
        name="language"
        value={currentLocale}
        onChange={handleLocaleChange}
        className="language-switcher"
        title="Choose your preferred language"
        disabled={isChanging}
      >
        {Object.entries(languages).map(([locale, language]) => (
          <option key={locale} value={locale}>
            {language}
          </option>
        ))}
      </select>
      {isChanging && (
        <style jsx>{`
          .language-switcher {
            opacity: 0.6;
            cursor: wait;
          }
        `}</style>
      )}
    </div>
  );
};

export default LanguageSwitcher;
