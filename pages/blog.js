import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { SEOHead } from '../src/shared/ui/SEO/SEOHead';
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';
import Layout from '../components/_App/Layout';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import ArticleCard from '../components/ArticleCard';
import styles from '../styles/Blog.module.scss';

const ARTICLES_PER_PAGE = 9;

const Blog = ({ articles, pagination, blogMeta, alternateLinks }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('blog');
  const [currentPage, setCurrentPage] = useState(pagination.page);

  const title = blogMeta?.title || t('title');
  const description = blogMeta?.description || t('description');
  const metaTitle = blogMeta?.meta?.title || title;
  const metaDescription = blogMeta?.meta?.description || description;

  const handlePageChange = page => {
    setCurrentPage(page);
    router.push({
      pathname: '/blog',
      query: { page },
    });
  };

  // Build comprehensive schemas for blog listing page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and trucking blog',
    })
    .addWebsite({
      description: 'CDL Help Blog - Trucking news, tips, and career advice',
    })
    .addBreadcrumb([
      { name: t('home', 'Home'), url: '/' },
      { name: t('blog', 'Blog'), url: '/blog' },
    ])
    .addWebPage({
      name: metaTitle || 'CDL Help Blog',
      description:
        metaDescription || 'Latest trucking news, CDL tips, and career advice for truck drivers',
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`,
      datePublished: '2023-01-01',
      dateModified: new Date().toISOString(),
    })
    .addItemList({
      name: 'CDL Help Blog Articles',
      description: 'Latest blog posts about trucking, CDL exams, and driver careers',
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog`,
      numberOfItems: pagination.total || articles.length,
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: (currentPage - 1) * ARTICLES_PER_PAGE + index + 1,
        name: article.title || article.attributes?.title,
        url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog/${article.slug || article.attributes?.slug}`,
        item: {
          '@type': 'BlogPosting',
          headline: article.title || article.attributes?.title,
          description: article.description || article.attributes?.description,
          datePublished: article.publishedAt || article.attributes?.publishedAt,
          author: {
            '@type': 'Person',
            name: article.author?.data?.attributes?.name || 'CDL Help Editorial Team',
          },
          image:
            article.image?.url ||
            article.attributes?.image?.data?.attributes?.url ||
            'https://www.cdlhelp.com/images/truckdriverhelp-og.jpg',
        },
      })),
    })
    .build();

  const renderPagination = () => {
    if (pagination.pageCount <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} className={styles.pageButton} onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className={styles.dots}>
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    if (endPage < pagination.pageCount) {
      if (endPage < pagination.pageCount - 1) {
        pages.push(
          <span key="dots2" className={styles.dots}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagination.pageCount}
          className={styles.pageButton}
          onClick={() => handlePageChange(pagination.pageCount)}
        >
          {pagination.pageCount}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          className={styles.prevButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t('previous')}
        </button>
        <div className={styles.pages}>{pages}</div>
        <button
          className={styles.nextButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.pageCount}
        >
          {t('next')}
        </button>
      </div>
    );
  };

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        url={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog`}
        canonical={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog`}
        type="website"
        alternateLinks={alternateLinks}
      />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      <Layout>
        <Navbar alternateLinks={alternateLinks} />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          {articles.length > 0 ? (
            <>
              <div className={styles.grid}>
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className={styles.noArticles}>
              <p>{t('noArticles')}</p>
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ locale, query }) {
  const page = parseInt(query.page) || 1;
  const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api`;

  try {
    // Fetch articles using REST API - only those marked as blog posts
    const articlesUrl = `${baseUrl}/articles?locale=${locale}&filters[blog_post][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${ARTICLES_PER_PAGE}&sort=publishedAt:desc&populate=*`;
    const articlesResponse = await fetch(articlesUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    if (!articlesResponse.ok) {
      throw new Error(`Failed to fetch articles: ${articlesResponse.status}`);
    }

    const articlesData = await articlesResponse.json();
    const articles = articlesData.data || [];
    const pagination = articlesData.meta?.pagination || {
      total: 0,
      page: 1,
      pageSize: ARTICLES_PER_PAGE,
      pageCount: 1,
    };

    // For now, we'll use null for blogMeta since the REST API might not have a blogPage endpoint
    const blogMeta = null;

    // Generate alternate links for hreflang
    const alternateLinks = {
      en: '/blog',
      ru: '/ru/blog',
      uk: '/uk/blog',
      ar: '/ar/blog',
      ko: '/ko/blog',
      zh: '/zh/blog',
      tr: '/tr/blog',
      pt: '/pt/blog',
    };

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'blog', 'navbar', 'footer'])),
        articles,
        pagination,
        blogMeta,
        alternateLinks,
      },
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'blog', 'navbar', 'footer'])),
        articles: [],
        pagination: {
          total: 0,
          page: 1,
          pageSize: ARTICLES_PER_PAGE,
          pageCount: 1,
        },
        blogMeta: null,
        alternateLinks: {
          en: '/blog',
          ru: '/ru/blog',
          uk: '/uk/blog',
          ar: '/ar/blog',
          ko: '/ko/blog',
          zh: '/zh/blog',
          tr: '/tr/blog',
          pt: '/pt/blog',
        },
      },
    };
  }
}

export default Blog;
