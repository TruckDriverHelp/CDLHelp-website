import { useRouter } from 'next/router';

const LanguageSwitcher = ({ alternateLinks }) => {

    const router = useRouter()
    const { locale } = router;

    const languages = {
        "": "Language",
        "uk": "Українська",
        "ru": "Русский",
        "en": "English"
    }

    const handleLocaleChange = (event) => {
        const locale = event.target.value;
        router.push("/", null, { locale });
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

export default LanguageSwitcher