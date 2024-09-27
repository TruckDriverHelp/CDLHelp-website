import Image from "next/image";
import { useTranslation } from 'next-i18next';

function ArticleCard(props) {
    const { title, description, imageURL, imageAlt, slug, locale } = props;
    const URL = `/${locale}/${slug}`;
    const {t} = useTranslation("article");

    return (
        <div class="article-card">
            <Image src={imageURL} alt={imageAlt} />
                <h2>{title}</h2>
                <p>{description}</p>
                <a href={URL} class="read-more">{t("readArticle")}</a>
        </div>
    )
}

export default ArticleCard;
