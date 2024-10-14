const LanguageSwitcher = ({ alternateLinks }) => {
    const languages = {
        "": "Language",
        "ar": "عربي",
        "en": "English",
        "ru": "Русский",
        "uk": "Українська",
        "zh": "中文",
        "ko": "한국어",
        "tr": "Türkçe",
    }

    const handleLocaleChange = (event) => {
        const locale = event.target.value;
        try{
            const link = alternateLinks.find(link => link.hrefLang === locale);
            window.location.replace(link.href)
        }
        catch (error) {
            console.error(error);
            window.location.replace(`/${locale}`);
        }
    };

    return (
        <div>
            <select name="language" onChange={handleLocaleChange} className='language-switcher'>
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
