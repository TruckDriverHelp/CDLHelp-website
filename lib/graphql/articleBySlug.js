import { gql } from 'graphql-request';

export const ARTICLE_BY_SLUG_QUERY = gql`
  query articleBySlug($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      documentId
      title
      description
      slug
      updatedAt
      publishedAt
      locale
      blog_post
      blog_page
      localizations {
        documentId
        slug
        locale
      }
      blocks {
        __typename
        ... on ComponentArticlePartsRichTextMarkdown {
          richtext
          idtag
        }
        ... on ComponentArticlePartsMedia {
          Media {
            url
            alternativeText
            width
            height
            caption
          }
        }
        ... on ComponentArticlePartsSlider {
          Slider {
            url
            alternativeText
            width
            height
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
            documentId
            title
            slug
            description
            blog_page
          }
        }
      }
      meta_tag {
        title
        description
        image {
          url
        }
      }
    }
  }
`;
