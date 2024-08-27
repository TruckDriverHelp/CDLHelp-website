import { useState } from "react";
import Head from 'next/head';
import Navbar from '@/components/_App/Navbar';
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1';
import axios from "axios";
import { remark } from 'remark';
import html from 'remark-html';
import Image from "next/image";
import YouTube from 'react-youtube';  

const PostDetailView = ({ slug, article }) => {
  const [isOpen, setIsOpen] = useState(true);
  const openModal = () => {
    setIsOpen(!isOpen);
  }
  const host = process.env.STRAPI_HOST;

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
  
        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content="Приложение CDL Help - Тесты CDL на русском языке" />
        <meta itemProp="description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
        <meta itemProp="image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg" />
  
        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://www.cdlhelp.app" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
        <meta property="og:description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
        <meta property="og:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg" />
  
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
        <meta name="twitter:description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
        <meta name="twitter:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg" />
      </Head>
      <Navbar />  
      <PageBannerStyle1
        pageTitle={article.title}
        homePageUrl="/"
        homePageText="Главная Страница"
        activePageText={article.title}
      />
      <div className="blog-details-area pb-75 w-50 mx-auto">
        <div>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          {article.blocks.map((block, index) => {
            if (block.__typename === 'ComponentArticlePartsRichText') {
              const processedBody = remark().use(html).processSync(block.Text).toString();
              return <div key={index} dangerouslySetInnerHTML={{ __html: processedBody }} />;
            } else if (block.__typename === 'ComponentArticlePartsMedia') {
              return (
                <Image
                  key={index}
                  src={host + block.Media.data.attributes.url}
                  alt={block.Media.data.attributes.alternativeText}
                  width={block.Media.data.attributes.width}
                  height={block.Media.data.attributes.height}
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
              const parsedYoutube = block.YouTube ? JSON.parse(block.YouTube) : console.log("Failed parsing oembed YouTube-link");
              const videoId = parsedYoutube.url.split('v=')[1];
              return (
                <div key={index}>
                  <YouTube
                    videoId={videoId}
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0,
                        controls: 1,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                    />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({params, locale}) {
  const {slug} = params;

  const query = `
  query articleBySlug($slug: String!, $locale: I18NLocaleCode) {
    articles(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        attributes {
          title
          description
          slug
          blocks {
            __typename
            ...on ComponentArticlePartsRichText {
              Text
            }
            ...on ComponentArticlePartsMedia {
              Media {
                data {
                  attributes {
                    url
                    alternativeText
                    width
                    height
                  }
                }
              }
            }
            ...on ComponentArticlePartsSlider {
              Slider {
                data {
                  attributes {
                    url
                    alternativeText
                    width
                    height
                  }
                }
              }
            }
            ...on ComponentArticlePartsQuote {
              Quote
            }
            ...on ComponentArticlePartsYouTube {
              YouTube
            }
          }
        }
      }
    }
  }
  `;
  const variables = {
    slug,
    locale
  };
  try {
    const response = await axios.post(
      `${process.env.STRAPI_HOST}/graphql`,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
        }
      }
    );

    const { data } = response.data;
    const { attributes } = data.articles.data[0];

    return {
      props: {
          slug,
          article: attributes
      } 
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        error: error
      }
  }
}
}

export async function getStaticPaths({ locales }) {
  const { data } = await axios.get(
    `${process.env.STRAPI_HOST}/api/articles?populate[localizations]=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    }
  );
  const slugs = data.data.map((article) => article.attributes.slug);

  const paths = [];
  data.data.flatMap(post => {
    paths.push({params: {slug: post.attributes.slug}, locale: post.attributes.locale});
    return post.attributes.localizations.data.map(locale => {
      const param = {params: {slug: locale.attributes.slug}, locale: locale.attributes.locale}
      paths.push(param);
    });
  });

  return {
      paths,
      fallback: false,
  }
}

export default PostDetailView;
        