import { gql } from 'graphql-request';

export const ARTICLE_BY_SLUG_QUERY = gql`
  query articleBySlug($slug: String!, $locale: I18NLocaleCode) {
    articles(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          title
          description
          slug
          updatedAt
          publishedAt
          blog_post
          blog_page
          locale
          localizations {
            data {
              id
              attributes {
                slug
                locale
              }
            }
          }
          blocks {
            __typename
            ... on ComponentArticlePartsRichTextMarkdown {
              richtext
              idtag
            }
            ... on ComponentArticlePartsMedia {
              Media {
                data {
                  attributes {
                    url
                    alternativeText
                    width
                    height
                    caption
                  }
                }
              }
            }
            ... on ComponentArticlePartsSlider {
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
            ... on ComponentArticlePartsQuote {
              Quote
            }
            ... on ComponentArticlePartsYouTube {
              YouTube
            }
            ... on ComponentArticlePartsRelatedArticles {
              articles {
                data {
                  id
                  attributes {
                    title
                    slug
                    locale
                    description
                    blog_page
                  }
                }
              }
            }
          }
          meta_tag {
            data {
              attributes {
                title
                description
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;