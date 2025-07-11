import React from 'react';
import Head from 'next/head';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import axios from 'axios';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { gql } from 'graphql-request';
import { ARTICLE_BY_SLUG_QUERY } from '../lib/graphql/articleBySlug';
import { ALTERNATE_LINKS_QUERY } from '../lib/graphql/alternateLinks';
import Layout from '../components/_App/Layout';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import ReactMarkdown from 'react-markdown';
import YouTubePlayer from '../components/Common/YouTubePlayer';
import { SEOHead } from '../src/shared/ui/SEO';
import { LinkRenderer } from '../lib/markdown-utils';
import { generateArticleHreflangUrls } from '../lib/article-utils';
import { getLocalizedOrganizationName, getLocalizedUrl } from '../lib/schemaLocalization';

const PostDetailView = ({ slug, article, locale, alternateLinks = [] }) => {
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

  const metaTags = article?.meta_tag || {
    title: article?.title || 'CDL Help',
    description: article?.description || '',
    image: null,
  };
  const metaImage = metaTags.image?.url
    ? metaTags.image.url.startsWith('http')
      ? metaTags.image.url
      : host + metaTags.image.url
    : '';

  // Convert alternateLinks array to object format for SEOHead
  const alternateLinksObj = {};

  // Always ensure self-referencing hreflang is included first
  alternateLinksObj[locale] = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`;

  // Process alternate links from Strapi
  alternateLinks.forEach(link => {
    // Skip if this is the current locale (we already added it above)
    if (link.hrefLang === locale) {
      return;
    }

    // Validate that the href matches the expected pattern for the locale
    const expectedPrefix = link.hrefLang === 'en' ? '/' : `/${link.hrefLang}/`;

    // Only add the link if it starts with the correct locale prefix
    if (link.href && link.href.startsWith(expectedPrefix)) {
      alternateLinksObj[link.hrefLang] = link.href;
    } else {
      // Log the issue for debugging
      // Invalid hreflang - skip this link
    }
  });

  // Generate fallback hreflang URLs if we have an article
  if (article) {
    const fallbackHreflangUrls = generateArticleHreflangUrls(article, locale, slug, false);

    // Ensure we have all supported locales covered
    const supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    supportedLocales.forEach(loc => {
      if (!alternateLinksObj[loc]) {
        // Use fallback URL from article-utils
        alternateLinksObj[loc] = fallbackHreflangUrls[loc];
      }
    });
  } else {
    // If no article, just generate basic URLs for all locales
    const supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    supportedLocales.forEach(loc => {
      if (!alternateLinksObj[loc]) {
        alternateLinksObj[loc] = loc === 'en' ? `/${slug}` : `/${loc}/${slug}`;
      }
    });
  }

  // Handle case when article is not found
  if (!article) {
    return (
      <Layout>
        <Navbar alternateLinks={alternateLinks} />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h1>Article not found</h1>
          <p>The requested article could not be found.</p>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <>
      <SEOHead
        title={metaTags.title}
        description={metaTags.description}
        url={`${process.env.BASE_URL || 'https://www.cdlhelp.com'}${locale === 'en' ? `/${slug}` : `/${locale}/${slug}`}`}
        image={metaImage}
        type="article"
        locale={locale}
        alternateLinks={alternateLinksObj}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metaTags.title,
              description: metaTags.description,
              image: metaImage,
              inLanguage: locale,
              datePublished: article.publishedAt,
              dateModified: article.updatedAt || article.publishedAt,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': getLocalizedUrl(locale, `/${slug}`),
              },
              author: {
                '@type': 'Organization',
                name: getLocalizedOrganizationName(locale),
                url: getLocalizedUrl(locale),
              },
              publisher: {
                '@type': 'Organization',
                name: getLocalizedOrganizationName(locale),
                url: getLocalizedUrl(locale),
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.cdlhelp.com/images/black-logo.png',
                },
              },
            }),
          }}
        />
      </Head>
      <Layout>
        <Navbar alternateLinks={alternateLinks} />
        <PageBannerStyle1
          pageTitle={article.title}
          homePageUrl="/"
          homePageText="Главная Страница"
          activePageText={article.title}
        />
        <div className="blog-details-area pb-75 col-11 col-md-6 mx-auto">
          <p>{article.description}</p>
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

            return article.blocks?.map((block, index) => {
              if (block.__typename === 'ComponentArticlePartsRichTextMarkdown') {
                // Split the markdown content into paragraphs
                const lines = block.richtext.split('\n');
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
                      <div key={`p-${index}-${paragraphCounter}`} id={block.idtag}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: LinkRenderer,
                          }}
                        >
                          {currentContent}
                        </ReactMarkdown>
                      </div>
                    );

                    // Check if we need to inject containers after this paragraph
                    if (containersToInject[paragraphCounter]) {
                      containersToInject[paragraphCounter].forEach((container, cIndex) => {
                        // Define gradient styles based on color
                        const colorStyles = {
                          blue: {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            iconBg: 'rgba(255, 255, 255, 0.2)',
                          },
                          green: {
                            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                            iconBg: 'rgba(255, 255, 255, 0.2)',
                          },
                          yellow: {
                            background: 'linear-gradient(135deg, #f6d55c 0%, #ed8936 100%)',
                            iconBg: 'rgba(255, 255, 255, 0.2)',
                          },
                          red: {
                            background: 'linear-gradient(135deg, #fc5c7d 0%, #eb3349 100%)',
                            iconBg: 'rgba(255, 255, 255, 0.2)',
                          },
                          purple: {
                            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                            iconBg: 'rgba(255, 255, 255, 0.3)',
                          },
                          default: {
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            iconBg: 'rgba(0, 0, 0, 0.1)',
                          },
                        };

                        const style = colorStyles[container.container_color] || colorStyles.default;

                        processedContent.push(
                          <div
                            key={`container-${paragraphCounter}-${cIndex}`}
                            className="article-container my-5 p-5 shadow-lg"
                            style={{
                              background: style.background,
                              borderRadius: '20px',
                              color:
                                container.container_color && container.container_color !== 'default'
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
                                <h4 className="mb-0 fw-bold">{container.container_title}</h4>
                              )}
                            </div>

                            {container.container_text && (
                              <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
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
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                                    e.target.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseOut={e => {
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
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
                      });
                    }

                    currentContent = '';
                  }
                });

                // Handle any remaining content
                if (currentContent.trim()) {
                  processedContent.push(
                    <div key={`p-${index}-final`} id={block.idtag}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: LinkRenderer,
                        }}
                      >
                        {currentContent}
                      </ReactMarkdown>
                    </div>
                  );
                }

                return <React.Fragment key={index}>{processedContent}</React.Fragment>;
              } else if (block.__typename === 'ComponentArticlePartsMedia') {
                return (
                  <div key={index}>
                    {block.Media?.map((media, mediaIndex) => (
                      <Image
                        key={mediaIndex}
                        src={media.url.startsWith('http') ? media.url : host + media.url}
                        alt={media.alternativeText || ''}
                        width={media.width || 800}
                        height={media.height || 600}
                      />
                    ))}
                  </div>
                );
              } else if (block.__typename === 'ComponentArticlePartsSlider') {
                return (
                  <div key={index}>
                    {block.Slider?.map((file, fileIndex) => (
                      <Image
                        key={fileIndex}
                        src={file.url.startsWith('http') ? file.url : host + file.url}
                        alt={file.alternativeText || ''}
                        width={file.width || 800}
                        height={file.height || 600}
                      />
                    ))}
                  </div>
                );
              } else if (block.__typename === 'ComponentArticlePartsQuote') {
                return (
                  <blockquote key={index}>
                    <p>{block.Quote}</p>
                  </blockquote>
                );
              } else if (block.__typename === 'ComponentArticlePartsYouTube') {
                try {
                  let videoId = null;
                  let youtubeUrl = null;

                  // Try different possible data structures
                  if (block.YouTube) {
                    try {
                      const parsedYoutube = JSON.parse(block.YouTube);

                      if (parsedYoutube.url) {
                        youtubeUrl = parsedYoutube.url;
                      } else if (parsedYoutube.embed_url) {
                        youtubeUrl = parsedYoutube.embed_url;
                      } else if (typeof parsedYoutube === 'string') {
                        youtubeUrl = parsedYoutube;
                      }
                    } catch (parseError) {
                      youtubeUrl = block.YouTube;
                    }
                  }

                  // If we have a URL, extract video ID
                  if (youtubeUrl) {
                    videoId = extractYouTubeVideoId(youtubeUrl);
                  }

                  // If still no video ID, try to extract from the raw data
                  if (!videoId && block.YouTube) {
                    // Try to find a YouTube URL pattern in the raw data
                    const urlMatch = block.YouTube.match(
                      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
                    );
                    if (urlMatch) {
                      videoId = urlMatch[1];
                    }
                  }

                  if (!videoId) {
                    // Could not extract video ID from YouTube data
                    return (
                      <div key={index}>Error: Could not extract video ID from YouTube data</div>
                    );
                  }

                  return (
                    <div key={index}>
                      <YouTubePlayer videoId={videoId} />
                    </div>
                  );
                } catch (error) {
                  // Error processing YouTube block
                  return <div key={index}>Error: Failed to load YouTube video</div>;
                }
              }
              if (block.__typename === 'ComponentArticlePartsRelatedArticles') {
                return (
                  <div key={index}>
                    <p>{t('relatedArticles')}</p>
                    <ul>
                      {block.articles?.map((article, i) => {
                        const url = article.blog_page
                          ? `${locale === 'en' ? '' : `/${locale}`}/blog/${article.slug}`
                          : `${locale === 'en' ? '' : `/${locale}`}/${article.slug}`;
                        return (
                          <li key={i}>
                            <a href={url}>{article.title}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              }
              return null;
            });
          })()}
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const actualLocale = locale || 'en';
  const variables = { slug, locale: actualLocale };

  try {
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    const articleResponse = await axios.post(
      graphqlUrl,
      { query: ARTICLE_BY_SLUG_QUERY, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    // Handle GraphQL errors
    if (articleResponse.data?.errors) {
      // GraphQL errors are handled by returning notFound
    }

    const articles = articleResponse.data?.data?.articles || [];

    if (articles.length === 0) {
      // REST API fallback removed - not needed in production

      return {
        notFound: true,
      };
    }

    // Process articles to find non-blog post

    // Find the article that is NOT a blog post (for regular pages)
    const article = articles.find(a => a.blog_post !== true);

    if (!article) {
      return {
        notFound: true,
      };
    }

    // If this is a blog post, return not found (it should be handled by /blog/[slug])
    if (article.blog_post === true) {
      return {
        notFound: true,
      };
    }

    const alternateLinksResponse = await axios.post(
      graphqlUrl,
      { query: ALTERNATE_LINKS_QUERY, variables: { slug } },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const alternateArticles = alternateLinksResponse.data?.data?.articles || [];
    const alternateArticle = alternateArticles[0];

    let alternateLinks = [];

    if (alternateArticle) {
      // Create a map to ensure we have unique entries per locale
      const alternateLinksMap = new Map();

      // Add current article first
      alternateLinksMap.set(alternateArticle.locale || actualLocale, {
        href:
          (alternateArticle.locale || actualLocale) === 'en'
            ? `/${slug}`
            : `/${alternateArticle.locale || actualLocale}/${slug}`,
        hrefLang: alternateArticle.locale || actualLocale,
      });

      // Add localizations
      if (alternateArticle.localizations) {
        alternateArticle.localizations.forEach(link => {
          alternateLinksMap.set(link.locale, {
            href: link.locale === 'en' ? `/${link.slug}` : `/${link.locale}/${link.slug}`,
            hrefLang: link.locale,
          });
        });
      }

      // Convert map to array
      alternateLinks = Array.from(alternateLinksMap.values());
    }

    return {
      props: {
        slug,
        article: article,
        locale: actualLocale,
        alternateLinks,
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'cookie',
          'article',
        ])),
      },
    };
  } catch (error) {
    return {
      props: {
        slug,
        article: null,
        locale: locale || 'en',
        alternateLinks: [],
        error: error.message,
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'cookie',
          'article',
        ])),
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    // Query to get all non-blog articles with their localizations
    const query = gql`
      query getAllArticles {
        articles(filters: { blog_post: { ne: true } }, pagination: { limit: 1000 }) {
          slug
          locale
          blog_post
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
    const paths = [];
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

    return {
      paths,
      fallback: 'blocking', // Allow new pages to be generated on demand
    };
  } catch (error) {
    // Return empty paths but with blocking fallback
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export default PostDetailView;
