import { useState } from "react";
import Head from 'next/head';
import Navbar from '@/components/_App/Navbar';
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1';
import axios from "axios";
import { remark } from 'remark';
import html from 'remark-html';
import Image from "next/image";
import YouTube from 'react-youtube';  

const PostDetailView = ({ article }) => {
  const [isOpen, setIsOpen] = useState(true);
  const openModal = () => {
    setIsOpen(!isOpen);
  }
  const host = 'http://146.190.47.164:1337';
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
            if (block.__typename === 'ComponentSharedRichText') {
              const processedBody = remark().use(html).processSync(block.body).toString();
              return <div key={index} dangerouslySetInnerHTML={{ __html: processedBody }} />;
            } else if (block.__typename === 'ComponentSharedMedia') {
              return (
                <Image
                  key={index}
                  src={host + block.file.data.attributes.url}
                  alt={block.file.data.attributes.alternativeText}
                  width={block.file.data.attributes.width}
                  height={block.file.data.attributes.height}
                />
              );
            } else if (block.__typename === 'ComponentSharedSlider') {
              return (
                <div key={index}>
                  {block.files.data.map((file, index) => (
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
            } else if (block.__typename === 'ComponentSharedQuote') {
              return (
                <blockquote key={index}>
                  <p>{block.body}</p>
                  <footer>{block.title}</footer>
                </blockquote>
              );
            } else if (block.__typename === 'ComponentSharedYouTube') {
              const parsedYoutube = block.youtube ? JSON.parse(block.youtube) : console.log("Failed parsing oembed YouTube-link");
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

export async function getStaticProps(context) {
  const { params } = context
  const slug = params.slug

  const query = `
    query articleBySlug($slug: String!) {
      articles(filters: { slug: { eq: $slug } }) {
        data {
          attributes {
            title
            description
            slug
            blocks {
              __typename
              ... on ComponentSharedRichText {
                body
              }
              ... on ComponentSharedMedia {
                file {
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
              ...on ComponentSharedSlider{
                files{
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
              ...on ComponentSharedQuote{
                title
                body
              }
              ...on ComponentSharedYouTube{
                youtube
              }
            }
          }
        }
      }
    }
  `;
  const variables = {
    slug
  };
  try {
    const response = await axios.post('http://146.190.47.164:1337/graphql', {query, variables});
    const { data } = response.data;
    const { attributes } = data.articles.data[0];

    return {
      props: {
          slug,
          article: attributes
      } 
    }
  } catch (error) {
    // handle any errors here
  }
}

export async function getStaticPaths() {
  const { data } = await axios.get(`http://146.190.47.164:1337/api/articles`);
  const slugs = data.data.map((article) => article.attributes.slug);

  const pathsWithParams = slugs.map((slug) => ({ params: { slug } }))
  return {
      paths: pathsWithParams,
      fallback: false,
  }
}

export default PostDetailView;
