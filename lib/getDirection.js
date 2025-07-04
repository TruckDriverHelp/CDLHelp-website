export function getDirection(locale) {
  const rtlLocales = ['ar', 'fa', 'he', 'ur']; // Add more RTL locales as needed

  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}
