import Head from 'next/head';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import axios from 'axios';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ARTICLE_BY_SLUG_QUERY } from '../../lib/graphql/articleBySlug';
import { ALTERNATE_LINKS_QUERY } from '../../lib/graphql/alternateLinks';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import ReactMarkdown from 'react-markdown';
import YouTubePlayer from '../../components/Common/YouTubePlayer';
import { SEOHead } from '../../src/shared/ui/SEO';
import { LinkRenderer } from '../../lib/markdown-utils';
import { generateArticleHreflangUrls } from '../../lib/article-utils';
import fetchArticles from '../../lib/fetchArticles';

const BlogPostDetailView = ({ slug, article, locale, alternateLinks = {} }) => {
  const { t } = useTranslation('article');
  const host = 'http://' + process.env.STRAPI_HOST + ':' + process.env.STRAPI_PORT;

  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = url => {
    if (!url) return null;

    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }

    // Handle youtube.com/watch format
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      return urlParams.get('v');
    }

    // Handle youtube.com/embed format
    if (url.includes('youtube.com/embed/')) {
      return url.split('youtube.com/embed/')[1]?.split('?')[0];
    }

    // Handle youtube.com/v format
    if (url.includes('youtube.com/v/')) {
      return url.split('youtube.com/v/')[1]?.split('?')[0];
    }

    return null;
  };

  if (!article) {
    return (
      <Layout>
        <Navbar />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h1>Article not found</h1>
        </div>
        <Footer />
      </Layout>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description || '',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: article.author?.data
      ? {
          '@type': 'Person',
          name: article.author.data.attributes.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'CDL Help',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog/${slug}`,
    },
  };

  return (
    <>
      <SEOHead
        title={article.meta?.title || article.title}
        description={article.meta?.description || article.description || ''}
        url={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog/${slug}`}
        canonical={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/blog/${slug}`}
        type="article"
        alternateLinks={alternateLinks}
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>

      <Layout>
        <Navbar alternateLinks={alternateLinks} />

        <PageBannerStyle1
          pageTitle={article.title}
          homePageUrl="/"
          homePageText={t('home')}
          activePageText={article.title}
          bgImg="/images/page-banner/banner-bg-2.jpg"
        />

        <div className="blog-details-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="blog-details-desc">
                  <div className="article-content">
                    <div className="article-meta mb-4">
                      <p className="text-muted">
                        {new Date(article.publishedAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {article.blocks?.map((section, index) => {
                      if (section.__typename === 'ComponentArticlePartsRichTextMarkdown') {
                        return (
                          <div key={index} className="rich-text-content">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: LinkRenderer,
                                h1: ({ children }) => <h1 className="mt-4 mb-3">{children}</h1>,
                                h2: ({ children }) => <h2 className="mt-4 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="mt-3 mb-2">{children}</h3>,
                                p: ({ children }) => <p className="mb-3">{children}</p>,
                                ul: ({ children }) => <ul className="mb-3">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-3">{children}</ol>,
                                blockquote: ({ children }) => (
                                  <blockquote className="blockquote border-start border-4 ps-3 my-3">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {section.richtext}
                            </ReactMarkdown>
                          </div>
                        );
                      } else if (section.__typename === 'ComponentArticlePartsMedia') {
                        return (
                          <div key={index} className="article-media my-4">
                            {section.Media?.data?.map((media, mediaIndex) => (
                              <div key={mediaIndex} className="mb-3">
                                <Image
                                  src={
                                    media.attributes.url.startsWith('http')
                                      ? media.attributes.url
                                      : `${host}${media.attributes.url}`
                                  }
                                  alt={
                                    media.attributes.alternativeText || `Image ${mediaIndex + 1}`
                                  }
                                  width={media.attributes.width || 800}
                                  height={media.attributes.height || 600}
                                  layout="responsive"
                                  objectFit="contain"
                                />
                                {media.attributes.caption && (
                                  <p className="text-center text-muted mt-2">
                                    {media.attributes.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      } else if (section.__typename === 'ComponentArticlePartsSlider') {
                        return (
                          <div key={index} className="article-slider my-4">
                            {/* Implement slider component here if needed */}
                            <div className="row">
                              {section.Slider?.data?.map((media, mediaIndex) => (
                                <div key={mediaIndex} className="col-md-6 mb-3">
                                  <Image
                                    src={
                                      media.attributes.url.startsWith('http')
                                        ? media.attributes.url
                                        : `${host}${media.attributes.url}`
                                    }
                                    alt={
                                      media.attributes.alternativeText || `Slide ${mediaIndex + 1}`
                                    }
                                    width={600}
                                    height={400}
                                    layout="responsive"
                                    objectFit="cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      } else if (section.__typename === 'ComponentArticlePartsQuote') {
                        return (
                          <div key={index} className="article-quote my-4">
                            <blockquote className="blockquote bg-light p-4 border-start border-4 border-primary">
                              <p className="mb-2">{section.Quote}</p>
                            </blockquote>
                          </div>
                        );
                      } else if (section.__typename === 'ComponentArticlePartsYouTube') {
                        const videoId = extractYouTubeVideoId(section.YouTube);
                        if (videoId) {
                          return (
                            <div key={index} className="article-youtube my-4">
                              <YouTubePlayer videoId={videoId} title="YouTube Video" />
                            </div>
                          );
                        }
                      } else if (
                        section.__typename === 'ComponentArticlePartsRelatedArticles' &&
                        section.articles?.data?.length > 0
                      ) {
                        return (
                          <div key={index} className="related-articles my-5">
                            <h3 className="mb-4">{t('relatedArticles')}</h3>
                            <div className="row">
                              {section.articles.data.map(relatedArticle => (
                                <div key={relatedArticle.id} className="col-md-6 mb-3">
                                  <div className="card h-100">
                                    <div className="card-body">
                                      <h5 className="card-title">
                                        <a
                                          href={`${locale === 'en' ? '' : `/${locale}`}/${relatedArticle.attributes.blog_page ? 'blog/' : ''}${relatedArticle.attributes.slug}`}
                                          className="text-decoration-none"
                                        >
                                          {relatedArticle.attributes.title}
                                        </a>
                                      </h5>
                                      {relatedArticle.attributes.description && (
                                        <p className="card-text text-muted">
                                          {relatedArticle.attributes.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const paths = [];

  try {
    // Fetch ALL articles and then filter by blog_page in the response
    const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate=localizations&pagination[limit]=1000`;
    console.log('[getStaticPaths] Fetching articles from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const articles = json.data || [];
      console.log(`[getStaticPaths] Found ${articles.length} total articles`);

      // Filter for blog_page = true
      const blogArticles = articles.filter(article => article.attributes.blog_page === true);
      console.log(`[getStaticPaths] Found ${blogArticles.length} blog articles`);

      blogArticles.forEach(article => {
        const locale = article.attributes.locale;

        // For English, we need to handle it specially
        if (locale === 'en') {
          paths.push({
            params: { slug: article.attributes.slug },
            locale: undefined, // This makes it use the default locale
          });
        } else {
          paths.push({
            params: { slug: article.attributes.slug },
            locale: locale,
          });
        }

        // Also add paths for localizations
        if (article.attributes.localizations?.data) {
          article.attributes.localizations.data.forEach(loc => {
            if (loc.attributes.locale === 'en') {
              paths.push({
                params: { slug: loc.attributes.slug },
                locale: undefined,
              });
            } else {
              paths.push({
                params: { slug: loc.attributes.slug },
                locale: loc.attributes.locale,
              });
            }
          });
        }
      });

      console.log(`[getStaticPaths] Generated ${paths.length} paths for blog articles`);
    } else {
      console.error(
        '[getStaticPaths] Failed to fetch articles:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('[getStaticPaths] Error fetching blog articles:', error);
  }

  return {
    paths,
    fallback: 'blocking', // This allows new blog posts to be created without rebuilding
  };
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const actualLocale = locale || 'en'; // Handle default locale

  console.log(`[getStaticProps] Fetching blog article: slug=${slug}, locale=${actualLocale}`);

  const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

  try {
    // Fetch the article
    const articleResponse = await axios.post(
      url,
      {
        query: ARTICLE_BY_SLUG_QUERY,
        variables: { slug, locale: actualLocale },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const articles = articleResponse.data?.data?.articles?.data || [];
    console.log(`[getStaticProps] Found ${articles.length} articles for slug=${slug}`);

    // Find the article that has blog_page = true
    const article = articles.find(a => {
      console.log(
        `[getStaticProps] Article ${a.attributes.slug}: blog_page=${a.attributes.blog_page}`
      );
      return a.attributes.blog_page === true;
    });

    if (!article) {
      console.log(`[getStaticProps] No blog article found for slug=${slug} with blog_page=true`);
      return {
        notFound: true,
      };
    }

    console.log(`[getStaticProps] Found blog article: ${article.attributes.title}`);

    // Fetch alternate links
    let alternateLinks = {};
    try {
      const alternateLinksResponse = await axios.post(
        url,
        {
          query: ALTERNATE_LINKS_QUERY,
          variables: { slug, locale: actualLocale },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
          },
        }
      );

      if (alternateLinksResponse.data?.data?.articles?.data?.[0]) {
        const alternateArticle = alternateLinksResponse.data.data.articles.data[0];
        alternateLinks = generateArticleHreflangUrls(
          alternateArticle.attributes,
          actualLocale,
          slug,
          true // This is a blog post
        );
      }
    } catch (altError) {
      console.error('[getStaticProps] Error fetching alternate links:', altError);
      // Generate fallback alternate links
      alternateLinks = generateArticleHreflangUrls(article.attributes, actualLocale, slug, true);
    }

    return {
      props: {
        ...(await serverSideTranslations(actualLocale, ['common', 'navbar', 'footer', 'article'])),
        slug,
        article: article.attributes,
        locale: actualLocale,
        alternateLinks,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error(`[getStaticProps] Error fetching blog article for slug=${slug}:`, error.message);
    if (error.response?.data) {
      console.error(
        '[getStaticProps] GraphQL errors:',
        JSON.stringify(error.response.data, null, 2)
      );
    }
    return {
      notFound: true,
    };
  }
}

export default BlogPostDetailView;
