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
import { getLocalizedOrganizationName, getLocalizedUrl } from '../../lib/schemaLocalization';

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

  // Generate structured data for SEO with localization
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description || '',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: locale,
    author: article.author?.data
      ? {
          '@type': 'Person',
          name: article.author.data.attributes.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getLocalizedUrl(locale, `/blog/${slug}`),
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

                    {(() => {
                      // Extract containers from the separate container field
                      const containerBlocks = article.container || [];

                      // Process blocks with container injection logic
                      let paragraphCounter = 0;
                      const containersToInject = {};

                      // Map containers to their insertion points
                      containerBlocks.forEach(container => {
                        const afterParagraph = container.container_after_paragraph;
                        if (!containersToInject[afterParagraph]) {
                          containersToInject[afterParagraph] = [];
                        }
                        containersToInject[afterParagraph].push(container);
                      });

                      return article.blocks?.map((section, index) => {
                        if (section.__typename === 'ComponentArticlePartsRichTextMarkdown') {
                          // Split the markdown content into paragraphs
                          const lines = section.richtext.split('\n');
                          const processedContent = [];
                          let currentContent = '';

                          lines.forEach((line, lineIndex) => {
                            currentContent += (lineIndex > 0 ? '\n' : '') + line;

                            // Check if this line ends a paragraph (empty line after content or last line)
                            const isEndOfParagraph =
                              (line.trim() &&
                                lineIndex < lines.length - 1 &&
                                lines[lineIndex + 1].trim() === '') ||
                              (line.trim() && lineIndex === lines.length - 1);

                            if (isEndOfParagraph) {
                              paragraphCounter++;
                              processedContent.push(
                                <ReactMarkdown
                                  key={`p-${index}-${paragraphCounter}`}
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
                                  {currentContent}
                                </ReactMarkdown>
                              );

                              // Check if we need to inject containers after this paragraph
                              if (containersToInject[paragraphCounter]) {
                                containersToInject[paragraphCounter].forEach(
                                  (container, cIndex) => {
                                    // Define gradient styles based on color
                                    const colorStyles = {
                                      blue: {
                                        background:
                                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        iconBg: 'rgba(255, 255, 255, 0.2)',
                                      },
                                      green: {
                                        background:
                                          'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                        iconBg: 'rgba(255, 255, 255, 0.2)',
                                      },
                                      yellow: {
                                        background:
                                          'linear-gradient(135deg, #f6d55c 0%, #ed8936 100%)',
                                        iconBg: 'rgba(255, 255, 255, 0.2)',
                                      },
                                      red: {
                                        background:
                                          'linear-gradient(135deg, #fc5c7d 0%, #eb3349 100%)',
                                        iconBg: 'rgba(255, 255, 255, 0.2)',
                                      },
                                      purple: {
                                        background:
                                          'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                        iconBg: 'rgba(255, 255, 255, 0.3)',
                                      },
                                      default: {
                                        background:
                                          'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        iconBg: 'rgba(0, 0, 0, 0.1)',
                                      },
                                    };

                                    const style =
                                      colorStyles[container.container_color] || colorStyles.default;

                                    processedContent.push(
                                      <div
                                        key={`container-${paragraphCounter}-${cIndex}`}
                                        className="article-container my-5 p-5 shadow-lg"
                                        style={{
                                          background: style.background,
                                          borderRadius: '20px',
                                          color:
                                            container.container_color &&
                                            container.container_color !== 'default'
                                              ? 'white'
                                              : '#333',
                                          position: 'relative',
                                          overflow: 'hidden',
                                        }}
                                      >
                                        <div className="d-flex align-items-start mb-3">
                                          {container.container_icon && (
                                            <div
                                              className="me-3 d-flex align-items-center justify-content-center"
                                              style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: style.iconBg,
                                                borderRadius: '12px',
                                                flexShrink: 0,
                                              }}
                                            >
                                              <i className={`${container.container_icon} fs-4`}></i>
                                            </div>
                                          )}
                                          {container.container_title && (
                                            <h4 className="mb-0 fw-bold">
                                              {container.container_title}
                                            </h4>
                                          )}
                                        </div>

                                        {container.container_text && (
                                          <p
                                            className="mb-4"
                                            style={{ fontSize: '1.1rem', lineHeight: '1.6' }}
                                          >
                                            {container.container_text}
                                          </p>
                                        )}

                                        <div className="d-flex justify-content-between align-items-end flex-wrap">
                                          {container.container_button_text && (
                                            <button
                                              className="btn btn-lg me-3 mb-2"
                                              style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                border: '2px solid rgba(255, 255, 255, 0.5)',
                                                color:
                                                  container.container_color &&
                                                  container.container_color !== 'default'
                                                    ? 'white'
                                                    : '#333',
                                                borderRadius: '10px',
                                                padding: '10px 25px',
                                                fontWeight: '600',
                                                backdropFilter: 'blur(10px)',
                                              }}
                                              onMouseOver={e => {
                                                e.target.style.backgroundColor =
                                                  'rgba(255, 255, 255, 0.4)';
                                                e.target.style.transform = 'translateY(-2px)';
                                              }}
                                              onMouseOut={e => {
                                                e.target.style.backgroundColor =
                                                  'rgba(255, 255, 255, 0.3)';
                                                e.target.style.transform = 'translateY(0)';
                                              }}
                                            >
                                              {container.container_button_text}
                                            </button>
                                          )}

                                          {container.container_sidenote && (
                                            <div className="d-flex align-items-center mb-2">
                                              {container.container_sidenote_icon && (
                                                <i
                                                  className={`${container.container_sidenote_icon} me-2`}
                                                  style={{ fontSize: '0.9rem' }}
                                                ></i>
                                              )}
                                              <small style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                                {container.container_sidenote}
                                              </small>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }

                              currentContent = '';
                            }
                          });

                          // Handle any remaining content
                          if (currentContent.trim()) {
                            processedContent.push(
                              <ReactMarkdown
                                key={`p-${index}-final`}
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
                                {currentContent}
                              </ReactMarkdown>
                            );
                          }

                          return (
                            <div key={index} className="rich-text-content">
                              {processedContent}
                            </div>
                          );
                        } else if (section.__typename === 'ComponentArticlePartsMedia') {
                          return (
                            <div key={index} className="article-media my-4">
                              {section.Media?.map((media, mediaIndex) => (
                                <div key={mediaIndex} className="mb-3">
                                  <Image
                                    src={
                                      media.url.startsWith('http')
                                        ? media.url
                                        : `${host}${media.url}`
                                    }
                                    alt={media.alternativeText || `Image ${mediaIndex + 1}`}
                                    width={media.width || 800}
                                    height={media.height || 600}
                                    layout="responsive"
                                    objectFit="contain"
                                  />
                                  {media.caption && (
                                    <p className="text-center text-muted mt-2">{media.caption}</p>
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
                                {section.Slider?.map((media, mediaIndex) => (
                                  <div key={mediaIndex} className="col-md-6 mb-3">
                                    <Image
                                      src={
                                        media.url.startsWith('http')
                                          ? media.url
                                          : `${host}${media.url}`
                                      }
                                      alt={media.alternativeText || `Slide ${mediaIndex + 1}`}
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
                                {section.articles?.map(relatedArticle => (
                                  <div key={relatedArticle.documentId} className="col-md-6 mb-3">
                                    <div className="card h-100">
                                      <div className="card-body">
                                        <h5 className="card-title">
                                          <a
                                            href={`${locale === 'en' ? '' : `/${locale}`}/${relatedArticle.blog_page ? 'blog/' : ''}${relatedArticle.slug}`}
                                            className="text-decoration-none"
                                          >
                                            {relatedArticle.title}
                                          </a>
                                        </h5>
                                        {relatedArticle.description && (
                                          <p className="card-text text-muted">
                                            {relatedArticle.description}
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
                      });
                    })()}
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
  // const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const paths = [];

  try {
    // Fetch ALL articles and then filter by blog_page in the response
    const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate=localizations&pagination[limit]=1000`;
    // Fetch articles from Strapi

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const articles = json.data || [];
      // Filter for blog_page = true
      const blogArticles = articles.filter(article => article.attributes.blog_post === true);

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

      // Paths generated successfully
    } else {
      // Failed to fetch articles
    }
  } catch (error) {
    // Error fetching blog articles
  }

  return {
    paths,
    fallback: 'blocking', // This allows new blog posts to be created without rebuilding
  };
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const actualLocale = locale || 'en'; // Handle default locale

  console.log('\n=== BLOG ARTICLE FETCH DEBUG ===');
  console.log('Slug:', slug);
  console.log('Locale:', actualLocale);

  // Fetch blog article from Strapi

  const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;
  console.log('GraphQL URL:', url);

  try {
    // Fetch the article
    const articleResponse = await axios.post(
      url,
      {
        query: ARTICLE_BY_SLUG_QUERY,
        variables: { slug }, // Remove locale from variables
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    console.log('GraphQL Response Status:', articleResponse.status);
    console.log('GraphQL Response Data:', JSON.stringify(articleResponse.data, null, 2));

    if (articleResponse.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(articleResponse.data.errors, null, 2));
    }

    const articles = articleResponse.data?.data?.articles || [];
    console.log('Articles found:', articles.length);
    console.log('Articles data:', JSON.stringify(articles, null, 2));

    // Process articles to find blog page
    console.log('\n--- Processing blog articles ---');
    articles.forEach((a, i) => {
      console.log(`Article ${i}:`, {
        slug: a.slug,
        blog_page: a.blog_page,
        blog_post: a.blog_post,
        locale: a.locale,
        title: a.title,
      });
    });

    // Find article that IS a blog post
    const article = articles.find(a => a.blog_post === true);
    console.log('Found blog article:', article ? 'Yes' : 'No');

    if (!article) {
      console.log('No blog articles found with slug:', slug);
      return {
        notFound: true,
      };
    }

    // Fetch alternate links
    let alternateLinks = {};
    try {
      const alternateLinksResponse = await axios.post(
        url,
        {
          query: ALTERNATE_LINKS_QUERY,
          variables: { slug }, // Remove locale from variables
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
          },
        }
      );

      if (alternateLinksResponse.data?.data?.articles?.[0]) {
        const alternateArticle = alternateLinksResponse.data.data.articles[0];
        alternateLinks = generateArticleHreflangUrls(
          alternateArticle,
          actualLocale,
          slug,
          true // This is a blog post
        );
      }
    } catch (altError) {
      // Error fetching alternate links - use fallback
      // Generate fallback alternate links
      alternateLinks = generateArticleHreflangUrls(article, actualLocale, slug, true);
    }

    console.log('Blog article found successfully:', {
      documentId: article.documentId,
      title: article.title,
      slug: article.slug,
      blog_page: article.blog_page,
      blog_post: article.blog_post,
    });

    return {
      props: {
        ...(await serverSideTranslations(actualLocale, ['common', 'navbar', 'footer', 'article'])),
        slug,
        article: article,
        locale: actualLocale,
        alternateLinks,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('\n=== BLOG ARTICLE FETCH ERROR ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Full Error:', error);

    // Error fetching blog article
    return {
      notFound: true,
    };
  }
}

export default BlogPostDetailView;
