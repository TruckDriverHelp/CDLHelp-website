import { i18n } from 'next-i18next';

export function getTranslations(locale, namespace) {
  return i18n.getResource(locale, namespace);
}
