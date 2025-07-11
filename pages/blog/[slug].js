import Head from 'next/head';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import axios from 'axios';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { gql } from 'graphql-request';
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
                                    // Define color styles for the new design
                                    const colorStyles = {
                                      blue: {
                                        accentColor: '#3B82F6',
                                        iconBg: '#3B82F6',
                                        buttonBg: '#3B82F6',
                                        buttonHover: '#2563EB',
                                      },
                                      green: {
                                        accentColor: '#10B981',
                                        iconBg: '#10B981',
                                        buttonBg: '#10B981',
                                        buttonHover: '#059669',
                                      },
                                      yellow: {
                                        accentColor: '#F59E0B',
                                        iconBg: '#F59E0B',
                                        buttonBg: '#F59E0B',
                                        buttonHover: '#D97706',
                                      },
                                      red: {
                                        accentColor: '#EF4444',
                                        iconBg: '#EF4444',
                                        buttonBg: '#EF4444',
                                        buttonHover: '#DC2626',
                                      },
                                      purple: {
                                        accentColor: '#8B5CF6',
                                        iconBg: '#8B5CF6',
                                        buttonBg: '#8B5CF6',
                                        buttonHover: '#7C3AED',
                                      },
                                      default: {
                                        accentColor: '#6B7280',
                                        iconBg: '#6B7280',
                                        buttonBg: '#6B7280',
                                        buttonHover: '#4B5563',
                                      },
                                    };

                                    const style =
                                      colorStyles[container.container_color] || colorStyles.default;

                                    processedContent.push(
                                      <div
                                        key={`container-${paragraphCounter}-${cIndex}`}
                                        className="article-container my-5"
                                        style={{
                                          background: '#FFFFFF',
                                          borderRadius: '12px',
                                          boxShadow:
                                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                          border: '1px solid #E5E7EB',
                                          position: 'relative',
                                          overflow: 'hidden',
                                        }}
                                      >
                                        {/* Left accent bar */}
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '4px',
                                            backgroundColor: style.accentColor,
                                          }}
                                        />

                                        <div className="p-5">
                                          <div className="d-flex align-items-start mb-4">
                                            {container.container_icon && (
                                              <div
                                                className="me-4 d-flex align-items-center justify-content-center"
                                                style={{
                                                  width: '64px',
                                                  height: '64px',
                                                  backgroundColor: style.iconBg,
                                                  borderRadius: '50%',
                                                  flexShrink: 0,
                                                  color: 'white',
                                                  marginTop: '-4px', // Align with the top of the title text
                                                }}
                                              >
                                                <i
                                                  className={`ri-${container.container_icon}`}
                                                  style={{ fontSize: '1.75rem' }}
                                                ></i>
                                              </div>
                                            )}
                                            <div className="flex-grow-1">
                                              {container.container_title && (
                                                <h4
                                                  className="mb-2 fw-bold"
                                                  style={{ color: '#1F2937', fontSize: '1.25rem' }}
                                                >
                                                  {container.container_title}
                                                </h4>
                                              )}
                                              {container.container_text && (
                                                <p
                                                  className="mb-0"
                                                  style={{
                                                    color: '#6B7280',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.6',
                                                  }}
                                                >
                                                  {container.container_text}
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            {container.container_button_text && (
                                              <a
                                                href={container.container_button_link || '#'}
                                                className="btn"
                                                style={{
                                                  backgroundColor: style.buttonBg,
                                                  border: 'none',
                                                  color: 'white',
                                                  borderRadius: '8px',
                                                  padding: '10px 20px',
                                                  fontWeight: '600',
                                                  fontSize: '0.875rem',
                                                  transition: 'all 0.2s ease-in-out',
                                                  textDecoration: 'none',
                                                  display: 'inline-block',
                                                }}
                                                onMouseOver={e => {
                                                  e.target.style.backgroundColor =
                                                    style.buttonHover;
                                                  e.target.style.transform = 'translateY(-1px)';
                                                  e.target.style.boxShadow =
                                                    '0 4px 8px rgba(0, 0, 0, 0.15)';
                                                }}
                                                onMouseOut={e => {
                                                  e.target.style.backgroundColor = style.buttonBg;
                                                  e.target.style.transform = 'translateY(0)';
                                                  e.target.style.boxShadow = 'none';
                                                }}
                                              >
                                                {container.container_button_text}
                                              </a>
                                            )}

                                            {container.container_sidenote && (
                                              <div className="d-flex align-items-center">
                                                {container.container_sidenote_icon && (
                                                  <i
                                                    className={`ri-${container.container_sidenote_icon} me-2`}
                                                    style={{
                                                      fontSize: '0.875rem',
                                                      color: '#9CA3AF',
                                                    }}
                                                  ></i>
                                                )}
                                                <small
                                                  style={{ fontSize: '0.875rem', color: '#9CA3AF' }}
                                                >
                                                  {container.container_sidenote}
                                                </small>
                                              </div>
                                            )}
                                          </div>
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
                          let videoId = null;

                          // Handle different YouTube data structures
                          if (section.YouTube) {
                            if (typeof section.YouTube === 'object' && section.YouTube !== null) {
                              // Strapi v5 structure
                              if (section.YouTube.url) {
                                videoId = extractYouTubeVideoId(section.YouTube.url);
                              } else if (section.YouTube.rawData && section.YouTube.rawData.html) {
                                // Extract from embed HTML
                                const embedMatch = section.YouTube.rawData.html.match(
                                  /src="[^"]*embed\/([a-zA-Z0-9_-]+)/
                                );
                                if (embedMatch) {
                                  videoId = embedMatch[1];
                                }
                              }
                            } else if (typeof section.YouTube === 'string') {
                              // Strapi v3/v4 or plain URL
                              videoId = extractYouTubeVideoId(section.YouTube);
                            }
                          }
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
  const paths = [];

  try {
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    // Query to get all articles that should be in /blog/[slug]
    // These are articles where blog_page is true
    const query = gql`
      query getAllBlogArticles {
        articles(filters: { blog_page: { eq: true } }, pagination: { limit: 1000 }) {
          slug
          locale
          blog_post
          blog_page
          localizations {
            slug
            locale
          }
        }
      }
    `;

    const response = await axios.post(
      graphqlUrl,
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const articles = response.data?.data?.articles || [];
    const processedSlugs = new Set(); // Track processed slug+locale combinations

    articles.forEach(article => {
      // Create unique key for tracking
      const key = `${article.locale}-${article.slug}`;

      if (!processedSlugs.has(key)) {
        processedSlugs.add(key);

        if (article.locale === 'en') {
          paths.push({ params: { slug: article.slug }, locale: undefined });
        } else {
          paths.push({ params: { slug: article.slug }, locale: article.locale });
        }
      }

      // Add localizations
      if (article.localizations) {
        article.localizations.forEach(loc => {
          const locKey = `${loc.locale}-${loc.slug}`;
          if (!processedSlugs.has(locKey)) {
            processedSlugs.add(locKey);

            if (loc.locale === 'en') {
              paths.push({ params: { slug: loc.slug }, locale: undefined });
            } else {
              paths.push({ params: { slug: loc.slug }, locale: loc.locale });
            }
          }
        });
      }
    });

    // Paths generated successfully
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

  // Fetch blog article from Strapi

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

    if (articleResponse.data?.errors) {
      // Handle GraphQL errors
    }

    const articles = articleResponse.data?.data?.articles || [];

    // Find article that should be in /blog section
    // Articles should be in /blog/[slug] ONLY if blog_page is true
    const article = articles.find(a => a.blog_page === true);

    if (!article) {
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
          variables: { slug },
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
    // Error fetching blog article
    return {
      notFound: true,
    };
  }
}

export default BlogPostDetailView;
