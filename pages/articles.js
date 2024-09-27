import React from 'react'
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ArticleCard from '@/components/Article/card';
import fetchArticles from "../lib/fetchArticles"

const IndexPage = (props) => {
    const { locale } = useRouter();
    return (
        <>
        <div className='articles'>
            {props.articles.map((article) => {
                const data = article.attributes;
                return <ArticleCard
                    title={data.title}
                    description={data.description}
                    slug={data.slug}
                    locale={locale}
                />
            })}
            </div>
        </>
    )
}

export default IndexPage;

export async function getStaticProps({ locale }) {
    const articles = await fetchArticles(locale);
    return {
        props: {
            articles: articles.data,
            ...(await serverSideTranslations(locale ?? 'en', [
                'index',
                'navbar',
                'footer',
                'cookie',
                "article",
            ])),
        },
    };
}