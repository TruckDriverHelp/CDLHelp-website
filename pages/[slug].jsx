import Head from 'next/head';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import axios from "axios";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ARTICLE_BY_SLUG_QUERY } from '../lib/graphql/articleBySlug';
import { ALTERNATE_LINKS_QUERY } from '../lib/graphql/alternateLinks';
import Layout from "../components/_App/Layout";
import Navbar from "../components/_App/Navbar";
import Footer from "../components/_App/Footer";
import ReactMarkdown from 'react-markdown';
import YouTubePlayer from '../components/Common/YouTubePlayer';

const PostDetailView = ({ slug, article, locale, alternateLinks }) => {
  const { t } = useTranslation("article");
  const host = "http://" + process.env.STRAPI_HOST + ":" + process.env.STRAPI_PORT;

  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url) => {
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
    image: { data: { attributes: { url: '' } } }
  };
  const metaImage = metaTags.image?.data?.attributes?.url ? 
    host + metaTags.image.data.attributes.url : 
    '';

  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        {alternateLinks.map((link, index) => (
          <link
            key={index}
            rel="alternate"
            href={process.env.BASE_URL + link.href}
            hrefLang={link.hrefLang}
          />
        ))}

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content={metaTags.title} />
        <meta itemProp="description" content={metaTags.description} />
        <meta itemProp="image" content={metaImage} />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={metaTags.title} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="CDL Help" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content={metaImage} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `${JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metaTags.title,
              image: metaImage,
              author: {
                "@type": "Organization",
                name: "CDL Help",
                url: "https://www.cdlhelp.com"
              }
            })}`
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
            {article.blocks.map((block, index) => {
              if (block.__typename === 'ComponentArticlePartsRichTextMarkdown') {
                return <div key={index} id={block.idtag}><ReactMarkdown children={block.richtext} remarkPlugins={[remarkGfm]} /></div>;
              }
              else if (block.__typename === 'ComponentArticlePartsMedia') {
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
                    const urlMatch = block.YouTube.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
                    if (urlMatch) {
                      videoId = urlMatch[1];
                    }
                  }
                  
                  if (!videoId) {
                    console.error('Could not extract video ID from YouTube data:', block.YouTube);
                    return <div key={index}>Error: Could not extract video ID from YouTube data</div>;
                  }
                  
                  return (
                    <div key={index}>
                      <YouTubePlayer videoId={videoId} />
                    </div>
                  );
                } catch (error) {
                  console.error('Error processing YouTube block:', error);
                  return <div key={index}>Error: Failed to load YouTube video</div>;
                }
              }
              if (block.__typename === 'ComponentArticlePartsRelatedArticles') {
                return <div key={index}>
                  <p>{t("relatedArticles")}</p>
                  <ul>
                    {block.articles.data.map((articleData, i) => {
                      const article = articleData.attributes;
                      const url = "/" + article.locale + "/" + article.slug + "/";
                      return <li key={i}><a href={url}>{article.title}</a></li>
                    })}
                  </ul>
                </div>
              }
              return null;
            })}

          </div>
        <Footer />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const variables = { slug, locale };

  try {
    const articleResponse = await axios.post(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`,
      { query: ARTICLE_BY_SLUG_QUERY, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
        }
      }
    );

    const alternateLinksResponse = await axios.post(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`,
      { query: ALTERNATE_LINKS_QUERY, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
        }
      }
    );

    const { data } = articleResponse.data;
    const { attributes } = data.articles.data[0];

    const alternateLinksData = alternateLinksResponse.data.data.articles.data[0].attributes.localizations.data;
    const alternateLinks = alternateLinksData.map((link) => ({
      href: `/${link.attributes.locale}/${link.attributes.slug}`,
      hrefLang: link.attributes.locale,
    }));

    alternateLinks.push({
      href: `/${locale}/${slug}`,
      hrefLang: locale,
    });

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
          'article'
        ])),
      }
    }
  } catch (error) {
    return {
      props: {
        error: error.message
      }
    }
  }
}

export async function getStaticPaths({ locales }) {
  const { data } = await axios.get(
    `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate[localizations]=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    }
  );
  const slugs = data.data.map((article) => article.attributes.slug);

  const paths = [];
  data.data.flatMap(post => {
    paths.push({ params: { slug: post.attributes.slug }, locale: post.attributes.locale });
    return post.attributes.localizations.data.map(locale => {
      const param = { params: { slug: locale.attributes.slug }, locale: locale.attributes.locale }
      paths.push(param);
    });
  });

  return {
    paths,
    fallback: false,
  }
}

export default PostDetailView;
