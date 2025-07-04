// hooks/useTranslation.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const loadLocaleData = async locale => {
  const response = await fetch(`/locales/${locale}/common.json`);
  return await response.json();
};

export const useTranslation = (initialTranslations = {}) => {
  const { locale } = useRouter();
  const [translations, setTranslations] = useState(initialTranslations);

  useEffect(() => {
    if (!initialTranslations) {
      loadLocaleData(locale).then(setTranslations);
    }
  }, [locale]);

  const t = key => {
    return translations[key] || key;
  };

  return { t, translations };
};
