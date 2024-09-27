import { gql } from 'graphql-request';

export const ARTICLE_BY_SLUG_QUERY = gql`
  query articleBySlug($slug: String!, $locale: I18NLocaleCode) {
    articles(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        attributes {
          title
          description
          slug
          updatedAt
          publishedAt
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
                  attributes {
                    title
                    slug
                    locale
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