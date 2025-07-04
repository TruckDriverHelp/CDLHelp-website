const LanguageSwitcher = ({ alternateLinks }) => {
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

  const handleLocaleChange = event => {
    const locale = event.target.value;
    try {
      const link = alternateLinks.find(link => link.hrefLang === locale);
      window.location.replace(link.href);
    } catch (error) {
      console.error(error);
      window.location.replace(`/${locale}`);
    }
  };

  return (
    <div className="language-switcher-container">
      <label htmlFor="language-select" className="visually-hidden">
        Select Language
      </label>
      <select
        id="language-select"
        name="language"
        onChange={handleLocaleChange}
        className="language-switcher"
        aria-label="Select Language"
        title="Select Language"
      >
        {Object.entries(languages).map(([locale, language]) => (
          <option key={locale} value={locale}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
