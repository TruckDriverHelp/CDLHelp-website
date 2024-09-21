import { useRouter } from 'next/router';

const LanguageSwitcher = ({alternateLinks}) => {

    const router = useRouter()
    const { locales } = router;

    const handleLocaleChange = (event) => {
        const locale = event.target.value;
        router.push("/", undefined, { locale });
    };

    return (
        <select onChange={handleLocaleChange}>
            {locales.map((locale) => (
                <option key={locale} value={locale}>
                    {locale}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher