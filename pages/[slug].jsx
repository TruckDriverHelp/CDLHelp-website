import Head from 'next/head';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import axios from 'axios';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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

  const metaTags = article?.meta_tag?.data?.attributes || {
    title: article?.title || 'CDL Help',
    description: article?.description || '',
    image: { data: { attributes: { url: '' } } },
  };
  const metaImage = metaTags.image?.data?.attributes?.url
    ? host + metaTags.image.data.attributes.url
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
            __html: `${JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metaTags.title,
              image: metaImage,
              author: {
                '@type': 'Organization',
                name: 'CDL Help',
                url: 'https://www.cdlhelp.com',
              },
            })}`,
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
          {article.blocks?.map((block, index) => {
            if (block.__typename === 'ComponentArticlePartsRichTextMarkdown') {
              return (
                <div key={index} id={block.idtag}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: LinkRenderer,
                    }}
                  >
                    {block.richtext}
                  </ReactMarkdown>
                </div>
              );
            } else if (block.__typename === 'ComponentArticlePartsMedia') {
              return (
                <Image
                  key={index}
                  src={host + block.Media.data[0].attributes.url}
                  alt={block.Media.data[0].attributes.alternativeText}
                  width={block.Media.data[0].attributes.width}
                  height={block.Media.data[0].attributes.height}
                />
              );
            } else if (block.__typename === 'ComponentArticlePartsSlider') {
              return (
                <div key={index}>
                  {block.Slider.data.map((file, index) => (
                    <Image
                      key={index}
                      src={host + file.attributes.url}
                      alt={file.attributes.alternativeText}
                      width={file.attributes.width}
                      height={file.attributes.height}
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
                  return <div key={index}>Error: Could not extract video ID from YouTube data</div>;
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
                    {block.articles.data.map((articleData, i) => {
                      const article = articleData.attributes;
                      const url = '/' + article.locale + '/' + article.slug + '/';
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
          })}
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

    // Handle GraphQL errors silently
    if (articleResponse.data?.errors) {
      // GraphQL errors are handled by returning notFound
    }

    const articles = articleResponse.data?.data?.articles?.data || [];

    if (articles.length === 0) {
      // REST API fallback removed - not needed in production

      return {
        notFound: true,
      };
    }

    // Process articles to find non-blog page

    // Find the article that is NOT a blog page
    const article = articles.find(a => a.attributes.blog_page !== true);

    if (!article) {
      return {
        notFound: true,
      };
    }

    const { attributes } = article;

    // If this is a blog post, return not found (it should be handled by /blog/[slug])
    if (attributes.blog_page === true) {
      return {
        notFound: true,
      };
    }

    const alternateLinksResponse = await axios.post(
      graphqlUrl,
      { query: ALTERNATE_LINKS_QUERY, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const alternateLinksData =
      alternateLinksResponse.data.data.articles.data[0].attributes.localizations.data;

    // Create a map to ensure we have unique entries per locale
    const alternateLinksMap = new Map();

    // Add current article first
    alternateLinksMap.set(locale, {
      href: locale === 'en' ? `/${slug}` : `/${locale}/${slug}`,
      hrefLang: locale,
    });

    // Add localizations
    alternateLinksData.forEach(link => {
      alternateLinksMap.set(link.attributes.locale, {
        href:
          link.attributes.locale === 'en'
            ? `/${link.attributes.slug}`
            : `/${link.attributes.locale}/${link.attributes.slug}`,
        hrefLang: link.attributes.locale,
      });
    });

    // Convert map to array
    const alternateLinks = Array.from(alternateLinksMap.values());

    return {
      props: {
        slug,
        article: attributes,
        locale: locale,
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
    const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate[localizations]=*&filters[blog_page][$ne]=true&pagination[limit]=1000`;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    const articles = data.data || [];

    const paths = [];
    articles.forEach(post => {
      // For English articles, we only want to generate paths without the /en/ prefix
      // Next.js will handle the routing correctly when locale is undefined for default locale
      if (post.attributes.locale === 'en') {
        paths.push({ params: { slug: post.attributes.slug }, locale: undefined });
      } else {
        paths.push({ params: { slug: post.attributes.slug }, locale: post.attributes.locale });
      }

      // Add localizations
      if (post.attributes.localizations?.data) {
        post.attributes.localizations.data.forEach(locale => {
          // Same logic for localizations
          if (locale.attributes.locale === 'en') {
            paths.push({ params: { slug: locale.attributes.slug }, locale: undefined });
          } else {
            paths.push({
              params: { slug: locale.attributes.slug },
              locale: locale.attributes.locale,
            });
          }
        });
      }
    });

    return {
      paths,
      fallback: 'blocking', // Allow new pages to be generated on demand
    };
  } catch (error) {
    if (error.response) {
      // Error response data available in error.response.data
    }
    // Return empty paths but with blocking fallback
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export default PostDetailView;
